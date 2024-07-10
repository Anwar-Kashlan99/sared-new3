import { useEffect, useRef, useCallback, useState } from "react";
import { ACTIONS } from "../actions";
import socketInit from "../socket";
import { useStateWithCallback } from "./useStateWithCallback";
import freeice from "freeice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useWebRTC = (roomId, userDetails) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const clientsRef = useRef([]);
  const navigate = useNavigate();
  const [handRaiseRequests, setHandRaiseRequests] = useState([]);
  const [speakingUsers, setSpeakingUsers] = useState([]); // New state to track speaking users

  const addNewClient = useCallback(
    (newClient, cb) => {
      setClients((existingClients) => {
        const existing = existingClients.find(
          (client) => client._id === newClient._id
        );
        if (!existing) {
          return [...existingClients, newClient];
        }
        return existingClients;
      }, cb);
    },
    [setClients]
  );

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  useEffect(() => {
    const initChat = async () => {
      console.log("Initializing chat...");

      if (socket.current) {
        console.log(
          "Socket already initialized. Cleaning up existing connections..."
        );
        cleanupConnections();
      }

      socket.current = socketInit();

      // Define socket event handlers
      socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) =>
        handleSetMute(isMute, userId)
      );
      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
      socket.current.on(ACTIONS.MUTE, ({ userId }) =>
        handleSetMute(true, userId)
      );
      socket.current.on(ACTIONS.UNMUTE, ({ userId }) =>
        handleSetMute(false, userId)
      );
      socket.current.on(ACTIONS.ROOM_CLIENTS, ({ roomId, clients }) =>
        setClients(clients)
      );
      socket.current.on("ROOM_ENDED_REDIRECT", handleRoomEnded);
      socket.current.on(ACTIONS.RAISE_HAND, handleRaiseHand);
      socket.current.on(ACTIONS.REJECT_SPEAK, handleRejectSpeak);
      socket.current.on(ACTIONS.RAISE_HAND_DUPLICATE, ({ message }) =>
        toast(message)
      );
      socket.current.on(ACTIONS.APPROVE_SPEAK, handleApproveSpeak);

      await captureMedia();

      addNewClient({ ...userDetails, muted: true }, () => {
        const localElement = audioElements.current[userDetails._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        console.log("Emitting JOIN event:", { roomId, user: userDetails });
        socket.current.emit(ACTIONS.JOIN, { roomId, user: userDetails });
      });

      socket.current.on(ACTIONS.JOIN, ({ user, isAdmin }) => {
        const updatedUserDetails = { ...user, isAdmin };
        addNewClient(updatedUserDetails, () => {
          const existingClient = clientsRef.current.find(
            (client) => client._id === user._id
          );
          if (!existingClient) {
            console.log(
              `User ${user._id} joined as ${isAdmin ? "admin" : "audience"}`
            );
          }
        });
      });
    };

    const cleanupConnections = () => {
      for (let peerId in connections.current) {
        if (connections.current[peerId]) {
          connections.current[peerId].connection.close();
          delete connections.current[peerId];
        }
      }
      for (let userId in audioElements.current) {
        delete audioElements.current[userId];
      }
      if (socket.current) {
        socket.current.off(ACTIONS.MUTE_INFO);
        socket.current.off(ACTIONS.ADD_PEER);
        socket.current.off(ACTIONS.REMOVE_PEER);
        socket.current.off(ACTIONS.ICE_CANDIDATE);
        socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        socket.current.off(ACTIONS.RAISE_HAND_DUPLICATE);
        socket.current.off(ACTIONS.MUTE);
        socket.current.off(ACTIONS.UNMUTE);
        socket.current.emit(ACTIONS.LEAVE, { roomId });
        socket.current = null;
      }
    };

    const captureMedia = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia is not supported in this browser.");
        alert(
          "Your browser does not support WebRTC. Please use a modern browser such as Chrome, Firefox, or Edge."
        );
        return;
      }

      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Media captured");
        analyzeAudioStream(localMediaStream.current); // Start analyzing the audio stream
      } catch (error) {
        console.error("Error capturing media: ", error);
        alert(
          "Error capturing media. Please ensure your browser has permission to access the microphone."
        );
      }
    };

    const analyzeAudioStream = (stream) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectSpeech = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, value) => sum + value, 0);
        const isSpeaking = volume > 1000; // Adjust the threshold value as needed
        if (isSpeaking && !speakingUsers.includes(userDetails._id)) {
          setSpeakingUsers((prev) => [...prev, userDetails._id]);
        } else if (!isSpeaking && speakingUsers.includes(userDetails._id)) {
          setSpeakingUsers((prev) =>
            prev.filter((id) => id !== userDetails._id)
          );
        }
        requestAnimationFrame(detectSpeech);
      };

      detectSpeech();
    };

    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (connections.current[peerId]) {
        return console.warn(`You are already connected with ${peerId}`);
      }

      console.log(
        `Adding new peer: ${peerId} ${remoteUser._id} ${remoteUser.username}`
      );

      const connection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          {
            urls: "turn:turn.anyfirewall.com:443?transport=tcp",
            username: "webrtc",
            credential: "webrtc",
          },
        ],
      });

      connections.current[peerId] = { connection, iceCandidatesQueue: [] };

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        }
      };

      connection.ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          const currentUser = clientsRef.current.find(
            (client) => client._id === userDetails._id
          );
          if (currentUser) {
            socket.current.emit(ACTIONS.MUTE_INFO, {
              userId: userDetails._id,
              roomId,
              isMute: currentUser.muted,
            });
          }

          const audioElement = audioElements.current[remoteUser._id];
          if (audioElement) {
            audioElement.srcObject = remoteStream;
          } else {
            const interval = setInterval(() => {
              const element = audioElements.current[remoteUser._id];
              if (element) {
                element.srcObject = remoteStream;
                clearInterval(interval);
              }
            }, 300);
          }
        });
      };

      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          connection.addTrack(track, localMediaStream.current);
        });
      } else {
        console.warn("Local media stream is not available.");
      }

      if (createOffer) {
        try {
          const offer = await connection.createOffer();
          await connection.setLocalDescription(offer);
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        } catch (error) {
          console.error("Error creating offer: ", error);
        }
      }
    };

    const handleRemovePeer = ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].connection.close();
      }

      delete connections.current[peerId];
      delete audioElements.current[userId];

      setClients((list) => list.filter((c) => c._id !== userId));
    };

    const handleIceCandidate = async ({ peerId, icecandidate }) => {
      if (icecandidate) {
        const connectionData = connections.current[peerId];
        if (connectionData) {
          if (connectionData.connection.remoteDescription) {
            await connectionData.connection.addIceCandidate(icecandidate);
          } else {
            connectionData.iceCandidatesQueue.push(icecandidate);
          }
        }
      }
    };

    const setRemoteMedia = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      const connectionData = connections.current[peerId];
      if (connectionData) {
        const connection = connectionData.connection;
        try {
          await connection.setRemoteDescription(
            new RTCSessionDescription(remoteSessionDescription)
          );

          if (remoteSessionDescription.type === "offer") {
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            socket.current.emit(ACTIONS.RELAY_SDP, {
              peerId,
              sessionDescription: answer,
            });
          }

          // Process queued ICE candidates
          while (connectionData.iceCandidatesQueue.length > 0) {
            const candidate = connectionData.iceCandidatesQueue.shift();
            await connection.addIceCandidate(candidate);
          }
        } catch (error) {
          console.error("Error setting remote description: ", error);
        }
      }
    };

    const handleSetMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client._id)
        .indexOf(userId);
      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
      if (clientIdx > -1) {
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }
    };

    const handleRoomEnded = () => {
      console.log("Room ended, redirecting to /srdhouse");
      toast("Room ended", { icon: "⚠️" });
      navigate("/srdhouse");
    };

    const handleRaiseHand = ({ peerId, userId, username, profile }) => {
      setHandRaiseRequests((requests) => [
        ...requests,
        { peerId, userId, username, profile },
      ]);
      toast(`User ${username} has raised their hand.`);
    };

    const handleRejectSpeak = ({ userId }) => {
      toast(`User ${userId} has been rejected to speak.`);
      setHandRaiseRequests((requests) =>
        requests.filter((req) => req.userId !== userId)
      );
    };

    const handleApproveSpeak = ({ userId }) => {
      toast(`User ${userId} has been approved to speak.`);
      console.log(`User ${userId} has been approved to speak.`);
      setHandRaiseRequests((requests) =>
        requests.filter((req) => req.userId !== userId)
      );
      setClients((prevClients) => {
        console.log("Clients before update:", prevClients);
        const updatedClients = prevClients.map((client) =>
          client._id === userId ? { ...client, role: "speaker" } : client
        );
        console.log("Clients after update:", updatedClients);
        return updatedClients;
      });
    };

    initChat();

    return () => {
      console.log("Cleaning up...");
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      }
      cleanupConnections();
    };
  }, [roomId, userDetails, addNewClient, setClients, navigate]);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const handleMute = (isMute, userId) => {
    let settled = false;
    let interval = null;

    const setMute = () => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          if (track.kind === "audio") {
            track.enabled = !isMute;
            if (!settled) {
              socket.current.emit(isMute ? ACTIONS.MUTE : ACTIONS.UNMUTE, {
                roomId,
                userId,
              });
              settled = true;
            }
          }
        });
      }
    };

    if (localMediaStream.current) {
      setMute();
    } else {
      interval = setInterval(() => {
        if (localMediaStream.current) {
          setMute();
          clearInterval(interval);
        }
      }, 200);
    }
  };

  const endRoom = () => {
    if (socket.current) {
      socket.current.emit(ACTIONS.END_ROOM, roomId);
    }
  };

  const blockUser = (userId) => {
    if (socket.current) {
      socket.current.emit(ACTIONS.BLOCK_USER, { roomId, userId });
    }
  };

  const raiseHand = () => {
    const existingRequest = handRaiseRequests.find(
      (request) => request.userId === userDetails._id
    );

    if (existingRequest) {
      toast(
        "You have already raised your hand. Please wait for the admin to approve or reject."
      );
      return;
    }

    socket.current.emit(ACTIONS.RAISE_HAND, {
      roomId,
      peerId: socket.current.id,
      userId: userDetails._id,
      username: userDetails.username,
      profile: userDetails.profile,
    });

    toast("You have raised your hand.");
  };

  const approveSpeakRequest = (peerId, userId) => {
    socket.current.emit(ACTIONS.APPROVE_SPEAK, { roomId, userId });
    setHandRaiseRequests((requests) =>
      requests.filter((req) => req.userId !== userId)
    );
  };

  const rejectSpeakRequest = (peerId, userId) => {
    socket.current.emit(ACTIONS.REJECT_SPEAK, { roomId, userId });
    setHandRaiseRequests((requests) =>
      requests.filter((req) => req.userId !== userId)
    );
  };

  return {
    clients,
    provideRef,
    handleMute,
    endRoom,
    blockUser,
    raiseHand,
    handRaiseRequests,
    approveSpeakRequest,
    rejectSpeakRequest,
    speakingUsers,
  };
};
