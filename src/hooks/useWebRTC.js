import { useEffect, useRef, useCallback, useState } from "react";
import socketInit from "../socket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import freeice from "freeice";
import { ACTIONS } from "../actionsSrdHouse";
import { useStateWithCallback } from "./useStateWithCallback";

export const useWebRTC = (roomId, userDetails) => {
  const [clients, setClients] = useStateWithCallback([]);

  const [handRaiseRequests, setHandRaiseRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const monitoringInterval = useRef(null);
  const audioElements = useRef({});
  const connections = useRef({});
  const clientsRef = useRef([]);
  const socket = useRef(null);
  const localMediaStream = useRef(null);

  const navigate = useNavigate();

  const addNewClient = useCallback(
    (newClient) => {
      setClients((existingClients) => {
        const clientIndex = existingClients.findIndex(
          (client) => client._id === newClient._id
        );

        if (clientIndex !== -1) {
          // Update existing client
          const updatedClients = [...existingClients];
          updatedClients[clientIndex] = {
            ...updatedClients[clientIndex],
            ...newClient,
          };
          return updatedClients;
        } else {
          // Add new client
          return [...existingClients, newClient];
        }
      });
    },
    [setClients]
  );

  // Keep the clients list in sync with a ref to avoid stale closures
  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  useEffect(() => {
    const initChat = async () => {
      try {
        socket.current = socketInit();

        if (!socket.current) {
          console.error("Socket initialization failed");
          return;
        }

        // Setup listeners
        socket.current.on(ACTIONS.JOIN, handleJoin);
        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
        socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
        socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
        socket.current.on(ACTIONS.MESSAGE, handleMessageReceived);
        socket.current.on(ACTIONS.MUTE, ({ userId }) =>
          handleSetMute(true, userId)
        );
        socket.current.on(ACTIONS.UNMUTE, ({ userId }) =>
          handleSetMute(false, userId)
        );
        socket.current.on(ACTIONS.ROOM_CLIENTS, ({ roomId, clients }) => {
          setClients(clients);
        });
        socket.current.on(ACTIONS.RAISE_HAND, handleRaiseHand);
        socket.current.on(ACTIONS.REJECT_SPEAK, handleRejectSpeak);
        socket.current.on(ACTIONS.APPROVE_SPEAK, handleApproveSpeak);
        socket.current.on(ACTIONS.RETURN_AUDIENCE, handleReturnAudience);
        socket.current.on(ACTIONS.TALK, handleTalk);
        socket.current.on(ACTIONS.ERROR, handleErrorRoom);
        socket.current.on("ROOM_ENDED_REDIRECT", handleRoomEnded);

        await captureMedia();

        socket.current.emit(ACTIONS.JOIN, { roomId, user: userDetails });

        startMonitoringAudioLevels();
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initChat();

    return () => {
      cleanupConnections();
    };
  }, [roomId, userDetails, addNewClient]);

  const cleanupConnections = useCallback(() => {
    for (let peerId in connections.current) {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
        delete connections.current[peerId];
      }
    }
    if (socket.current) {
      Object.values(ACTIONS).forEach((action) => socket.current.off(action));
      socket.current.emit(ACTIONS.LEAVE, { roomId });
      socket.current.disconnect(); // Ensure this is called once
      socket.current = null;
    }

    for (let userId in audioElements.current) {
      delete audioElements.current[userId];
    }

    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }

    console.log("All socket listeners removed and cleanup complete.");
  }, [roomId]);

  const captureMedia = async () => {
    try {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      // Make sure the track is enabled right after capture
      localMediaStream.current.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = true;
          console.log(
            `Captured track kind: ${track.kind}, enabled: ${track.enabled}`
          );
        }
      });

      // Automatically add the local tracks to existing peers
      addLocalTracksToPeers();
    } catch (error) {
      console.error("Error capturing media:", error);
      toast.error(
        "Error capturing media. Please ensure your browser has permission to access the microphone."
      );
    }
  };

  const handleJoin = ({ user, isAdmin }) => {
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
  };

  const handleNewPeer = async ({ peerId, createOffer, user }) => {
    try {
      if (connections.current[peerId]) return;

      const iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.relay.metered.ca:80" },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "c8090ecaa7eb2bc0bb45fcd3",
          credential: "dr9/NfX7eSdwKpFF",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "c8090ecaa7eb2bc0bb45fcd3",
          credential: "dr9/NfX7eSdwKpFF",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "c8090ecaa7eb2bc0bb45fcd3",
          credential: "dr9/NfX7eSdwKpFF",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "c8090ecaa7eb2bc0bb45fcd3",
          credential: "dr9/NfX7eSdwKpFF",
        },
      ];
      const connection = new RTCPeerConnection({ iceServers });
      connections.current[peerId] = connection;

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        }
      };
      connection.oniceconnectionstatechange = () => {
        console.log(
          `ICE connection state for ${peerId}: ${connection.iceConnectionState}`
        );
      };

      connection.ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...user, muted: true });
        const audioElement = audioElements.current[user._id];
        if (audioElement) {
          audioElement.srcObject = remoteStream;
          audioElement.play().catch((error) => {
            if (
              error.name === "NotAllowedError" ||
              error.name === "AbortError"
            ) {
              console.log(
                `Autoplay blocked for user ${user._id}, waiting for user interaction.`
              );
              audioElement.setAttribute("autoplayBlocked", "true");
            } else {
              console.error(`Error playing audio for user ${user._id}:`, error);
            }
          });
        }
      };

      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          connection.addTrack(track, localMediaStream.current);
        });
      }
      if (createOffer) {
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    } catch (error) {
      console.error("Error handling new peer:", error);
    }
  };

  const setRemoteMedia = async ({ peerId, sessionDescription }) => {
    const connection = connections.current[peerId];
    if (!connection) return;

    try {
      await connection.setRemoteDescription(
        new RTCSessionDescription(sessionDescription)
      );

      if (sessionDescription.type === "offer") {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }

      // Add queued ICE candidates after setting the remote description
      if (connection.queuedIceCandidates) {
        for (const candidate of connection.queuedIceCandidates) {
          await connection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        connection.queuedIceCandidates = [];
      }
    } catch (error) {
      console.error("Error setting remote description", error);
    }
  };

  const handleIceCandidate = async ({ peerId, icecandidate }) => {
    const connection = connections.current[peerId];
    if (connection) {
      try {
        if (connection.remoteDescription && connection.remoteDescription.type) {
          await connection.addIceCandidate(new RTCIceCandidate(icecandidate));
          console.log(`ICE candidate added for peer ${peerId}`);
        } else {
          // Queue the ICE candidate until remote description is set
          connection.queuedIceCandidates = connection.queuedIceCandidates || [];
          connection.queuedIceCandidates.push(icecandidate);
          console.log(`ICE candidate queued for peer ${peerId}`);
        }
      } catch (error) {
        console.error(`Error adding ICE candidate for peer ${peerId}:`, error);
      }
    } else {
      console.error(`Connection not found for peer ${peerId}`);
    }
  };

  const handleRemovePeer = ({ peerId, userId }) => {
    if (connections.current[peerId]) {
      connections.current[peerId].close();
      delete connections.current[peerId];
    }

    delete audioElements.current[userId];
    setClients((list) => list.filter((client) => client._id !== userId));
  };

  const handleSetMute = (mute, userId) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === userId
          ? { ...client, muted: mute, speaking: mute ? false : client.speaking }
          : client
      )
    );

    if (userId === userDetails._id) {
      setIsSpeaking(!mute && isSpeaking);

      // Handle possible errors in toggling tracks
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          if (track.kind === "audio") {
            try {
              track.enabled = !mute;
              console.log(`Track ${track.kind} enabled: ${track.enabled}`);
            } catch (error) {
              console.error("Error enabling/disabling audio track:", error);
            }
          }
        });
      }

      socket.current.emit(ACTIONS.TALK, {
        userId,
        roomId,
        isTalk: !mute && isSpeaking,
      });
    }
  };

  const addLocalTracksToPeers = () => {
    if (localMediaStream.current) {
      Object.keys(connections.current).forEach((peerId) => {
        const connection = connections.current[peerId];
        const senders = connection.getSenders();

        localMediaStream.current.getTracks().forEach((track) => {
          const trackAlreadyAdded = senders.some(
            (sender) => sender.track === track
          );

          if (!trackAlreadyAdded) {
            connection.addTrack(track, localMediaStream.current);
          } else {
            const sender = senders.find((sender) => sender.track === track);
            if (sender) {
              sender.replaceTrack(track); // Replace existing track
            }
          }
        });
      });
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

  const handleRoomEnded = () => {
    toast("Room ended", { icon: "⚠️" });
    navigate("/srdhouse");
  };

  const handleErrorRoom = () => {
    toast("You are blocked from this room");
    navigate("/srdhouse");
  };

  const handleRaiseHand = ({ userId, username, profile }) => {
    setHandRaiseRequests((prevRequests) => [
      ...prevRequests,
      { userId, username, profile },
    ]);
    toast(`User ${username} has raised their hand.`);
  };

  const handleRejectSpeak = ({ userId }) => {
    toast(`User ${userId} has been rejected to speak.`);
    setHandRaiseRequests((requests) =>
      requests.filter((req) => req.userId !== userId)
    );
  };

  const handleApproveSpeak = async ({ roomId, userId }) => {
    // Notify the server about the approval of the speak request
    if (socket.current) {
      socket.current.emit(ACTIONS.APPROVE_SPEAK, { roomId, userId });
    }

    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach((track) => {
        track.enabled = true;
      });
    }

    // Remove the user from the raised hands list after approval
    setHandRaiseRequests((requests) =>
      requests.filter((req) => req.userId !== userId)
    );

    // Optionally, notify the user that their request was approved
    toast(`User ${userId} has been approved to speak.`);
  };

  const handleReturnAudience = () => {
    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach((track) => {
        track.enabled = false;
      });
    }
    toast("You have been moved back to the audience.");
  };

  const handleTalk = ({ userId, isTalk }) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === userId ? { ...client, speaking: isTalk } : client
      )
    );
  };

  const startMonitoringAudioLevels = () => {
    monitoringInterval.current = setInterval(async () => {
      if (!localMediaStream.current) return;

      const audioLevel = await getAudioLevel();
      console.log(audioLevel); // This should now print the audio level

      if (audioLevel > 0.1) {
        // Adjust the threshold based on your needs
        if (
          !isSpeaking &&
          !clientsRef.current.find((c) => c._id === userDetails._id)?.muted
        ) {
          setIsSpeaking(true);
          socket.current.emit(ACTIONS.TALK, {
            userId: userDetails._id,
            roomId,
            isTalk: true,
          });

          setClients((prevClients) =>
            prevClients.map((client) =>
              client._id === userDetails._id
                ? { ...client, speaking: true }
                : client
            )
          );
        }
      } else {
        if (isSpeaking) {
          setIsSpeaking(false);
          socket.current.emit(ACTIONS.TALK, {
            userId: userDetails._id,
            roomId,
            isTalk: false,
          });

          setClients((prevClients) =>
            prevClients.map((client) =>
              client._id === userDetails._id
                ? { ...client, speaking: false }
                : client
            )
          );
        }
      }
    }, 400);
  };

  const getAudioLevel = async () => {
    let audioLevel = 0.0;
    const promises = Object.values(connections.current).map(async (pc) => {
      if (pc && typeof pc.getStats === "function") {
        try {
          const stats = await pc.getStats();
          stats.forEach((report) => {
            if (report.type === "media-source" && report.kind === "audio") {
              audioLevel = report.audioLevel || 0.0;
            }
          });
        } catch (error) {
          console.error("Error getting audio stats:", error);
        }
      }
    });
    await Promise.all(promises);
    return audioLevel;
  };

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const handleMute = (isMute, userId) => {
    let settled = false;

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
      const interval = setInterval(() => {
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

  const rejectSpeakRequest = (peerId, userId) => {
    socket.current.emit(ACTIONS.REJECT_SPEAK, { roomId, userId });
    setHandRaiseRequests((requests) =>
      requests.filter((req) => req.userId !== userId)
    );
  };

  const sendMessage = (text) => {
    if (socket.current) {
      socket.current.emit(ACTIONS.MESSAGE, {
        roomId,
        user: userDetails,
        text,
      });
    }
  };

  const returnAudienceSpeak = (userId) => {
    socket.current.emit(ACTIONS.RETURN_AUDIENCE, { roomId, userId });
  };

  return {
    clients,
    provideRef,
    handleMute,
    endRoom,
    blockUser,
    raiseHand,
    handRaiseRequests,
    rejectSpeakRequest,
    messages,
    sendMessage,
    returnAudienceSpeak,
    handleApproveSpeak,
  };
};
