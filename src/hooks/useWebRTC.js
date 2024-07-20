import { useEffect, useRef, useCallback, useState } from "react";
import { ACTIONS } from "../actions";
import socketInit from "../socket";
import { useStateWithCallback } from "./useStateWithCallback";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useWebRTC = (roomId, userDetails) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const audioContext = useRef(null);
  const analyserNode = useRef(null);
  const dataArray = useRef(null);
  const clientsRef = useRef([]);
  const navigate = useNavigate();
  const [handRaiseRequests, setHandRaiseRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const updateSpeakingStatus = (userId, isTalk) => {
    setClients((prevClients) => {
      return prevClients.map((client) =>
        client._id === userId ? { ...client, speaking: isTalk } : client
      );
    });
    socket.current.emit(ACTIONS.TALK, {
      userId,
      roomId,
      isTalk,
    });
  };

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  useEffect(() => {
    const initChat = async () => {
      if (socket.current) {
        cleanupConnections();
      }

      socket.current = socketInit();

      if (!socket.current) {
        console.error("Socket initialization failed");
        return;
      }

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

      // Add message handling
      socket.current.on(ACTIONS.MESSAGE, handleMessageReceived);

      // Add speaking status handling
      socket.current.on(ACTIONS.TALK, handleTalk);

      await captureMedia();

      if (userDetails && userDetails._id) {
        addNewClient({ ...userDetails, muted: true }, () => {
          const localElement = audioElements.current[userDetails._id];
          if (localElement) {
            localElement.volume = 0;
            localElement.srcObject = localMediaStream.current;
          }
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

        // Start monitoring audio levels
        startMonitoringAudioLevels();
      } else {
        console.error("Invalid userDetails");
      }
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
        socket.current.off(ACTIONS.MESSAGE);
        socket.current.emit(ACTIONS.LEAVE, { roomId });
        socket.current = null;
      }
    };

    const captureMedia = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          "Your browser does not support WebRTC. Please use a modern browser such as Chrome, Firefox, or Edge."
        );
        return;
      }

      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Initialize audio context and analyser node
        audioContext.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserNode.current = audioContext.current.createAnalyser();
        analyserNode.current.fftSize = 256;
        const source = audioContext.current.createMediaStreamSource(
          localMediaStream.current
        );
        source.connect(analyserNode.current);
        dataArray.current = new Uint8Array(
          analyserNode.current.frequencyBinCount
        );
      } catch (error) {
        alert(
          "Error capturing media. Please ensure your browser has permission to access the microphone."
        );
      }
    };

    const handleMessageReceived = (data) => {
      console.log("Received message data:", data);

      if (!data || !data.user || !data.message) {
        console.error(
          "Received message is undefined or has missing fields:",
          data
        );
        return;
      }

      const { user, message } = data;

      setMessages((prevMessages) => [
        ...prevMessages,
        { userId: user._id, username: user.username, message },
      ]);
    };

    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (connections.current[peerId]) {
        return;
      }

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

        // Update speaking status when muted
        if (mute) {
          setIsSpeaking(false);
          updateSpeakingStatus(userId, false);
        }
      }
    };

    const handleRoomEnded = () => {
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
      setHandRaiseRequests((requests) =>
        requests.filter((req) => req.userId !== userId)
      );
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === userId ? { ...client, role: "speaker" } : client
        )
      );
    };

    const handleTalk = ({ userId, isTalk }) => {
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === userId ? { ...client, speaking: isTalk } : client
        )
      );
    };

    const startMonitoringAudioLevels = () => {
      const interval = setInterval(() => {
        if (!analyserNode.current || !dataArray.current) return;

        analyserNode.current.getByteFrequencyData(dataArray.current);
        const audioLevel =
          dataArray.current.reduce((a, b) => a + b) / dataArray.current.length;

        console.log(audioLevel); // This should now print the audio level

        if (audioLevel > 50) {
          // Adjust the threshold based on your needs
          if (!isSpeaking) {
            setIsSpeaking(true);
            updateSpeakingStatus(userDetails._id, true);
          }
        } else {
          if (isSpeaking) {
            setIsSpeaking(false);
            updateSpeakingStatus(userDetails._id, false);
          }
        }
      }, 200);

      return () => clearInterval(interval);
    };

    initChat();

    return () => {
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

        // Update speaking status when muted
        if (isMute) {
          setIsSpeaking(false);
          updateSpeakingStatus(userId, false);
        }
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

    const newRequest = {
      peerId: socket.current.id,
      userId: userDetails._id,
      username: userDetails.username,
      profile: userDetails.profile,
    };

    setHandRaiseRequests((prevRequests) => [...prevRequests, newRequest]);

    socket.current.emit(ACTIONS.RAISE_HAND, {
      roomId,
      ...newRequest,
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

  const sendMessage = (text) => {
    if (socket.current) {
      console.log("Sending message:", { roomId, userDetails, text });
      socket.current.emit(ACTIONS.MESSAGE, {
        roomId,
        user: userDetails,
        text,
      });
    }
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
    messages,
    sendMessage,
  };
};
