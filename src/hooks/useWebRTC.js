import { useEffect, useRef, useCallback, useState } from "react";
import socketInit from "../socket";
import { useStateWithCallback } from "./useStateWithCallback";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import freeice from "freeice";
import { ACTIONS } from "../actionsSrdHouse";

export const useWebRTC = (roomId, userDetails) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const clientsRef = useRef([]);
  const navigate = useNavigate();
  const [handRaiseRequests, setHandRaiseRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStartSpeakingPrompt, setShowStartSpeakingPrompt] = useState(false);
  const monitoringInterval = useRef(null);

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
      if (socket.current) {
        cleanupConnections();
      }

      socket.current = socketInit();

      if (!socket.current) {
        console.error("Socket initialization failed");
        return;
      }

      setupSocketEventHandlers();

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

        startMonitoringAudioLevels();
      } else {
        console.error("Invalid userDetails");
      }
    };

    initChat();

    return () => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
        localMediaStream.current = null; // Explicitly clear the media stream reference
      }
      cleanupConnections();
    };
  }, [roomId, userDetails, addNewClient, setClients, navigate]);

  const setupSocketEventHandlers = () => {
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
    socket.current.on(ACTIONS.ROOM_CLIENTS, ({ roomId, clients }) => {
      console.log("ROOM_CLIENTS event received:", { roomId, clients });
      setClients(clients);
    });
    socket.current.on("ROOM_ENDED_REDIRECT", handleRoomEnded);
    socket.current.on(ACTIONS.RAISE_HAND, handleRaiseHand);
    socket.current.on(ACTIONS.REJECT_SPEAK, handleRejectSpeak);
    socket.current.on(ACTIONS.RAISE_HAND_DUPLICATE, ({ message }) =>
      toast(message)
    );
    socket.current.on(ACTIONS.APPROVE_SPEAK, handleApproveSpeak);
    socket.current.on(ACTIONS.MESSAGE, handleMessageReceived);
    socket.current.on(ACTIONS.TALK, handleTalk);
    socket.current.on(ACTIONS.RETURN_AUDIENCE, handleReturnAudience);
    socket.current.on(ACTIONS.ERROR, handleErrorRoom);
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
      socket.current.off(ACTIONS.TALK);
      socket.current.emit(ACTIONS.LEAVE, { roomId });
      socket.current = null;
      console.log("cleanup Connections");
    }

    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
  };

  const captureMedia = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error(
        "Your browser does not support WebRTC. Please use a modern browser such as Chrome, Firefox, or Edge."
      );
      return;
    }

    try {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Add local tracks to all existing peer connections
      addLocalTracksToPeers();
    } catch (error) {
      toast.error(
        "Error capturing media. Please ensure your browser has permission to access the microphone."
      );
      console.error("Error capturing media:", error);
    }
  };

  const handleErrorRoom = () => {
    toast("You are blocked from this room");
    navigate("/srdhouse");
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

  // const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
  //   if (connections.current[peerId]) {
  //     return;
  //   }

  //   const connection = new RTCPeerConnection({
  //     iceServers: [
  //       { urls: "stun:stun.l.google.com:19302" },
  //       { urls: "stun:stun1.l.google.com:19302" },
  //       { urls: "stun:stun2.l.google.com:19302" },
  //       { urls: "stun:stun3.l.google.com:19302" },
  //       { urls: "stun:stun4.l.google.com:19302" },
  //       {
  //         urls: "turn:turn.anyfirewall.com:443?transport=tcp",
  //         username: "webrtc",
  //         credential: "webrtc",
  //       },
  //     ],
  //   });

  //   connections.current[peerId] = { connection, iceCandidatesQueue: [] };

  //   connection.onicecandidate = (event) => {
  //     console.log("ICE candidate event:", event);
  //     if (event.candidate) {
  //       socket.current.emit(ACTIONS.RELAY_ICE, {
  //         peerId,
  //         icecandidate: event.candidate,
  //       });
  //     }
  //   };

  //   connection.ontrack = ({ streams: [remoteStream] }) => {
  //     console.log("Track event:", remoteStream);
  //     addNewClient({ ...remoteUser, muted: true }, () => {
  //       const audioElement = audioElements.current[remoteUser._id];
  //       if (audioElement) {
  //         audioElement.srcObject = remoteStream;
  //       } else {
  //         const interval = setInterval(() => {
  //           const element = audioElements.current[remoteUser._id];
  //           if (element) {
  //             element.srcObject = remoteStream;
  //             clearInterval(interval);
  //           }
  //         }, 300);
  //       }
  //     });
  //   };

  //   if (localMediaStream.current) {
  //     localMediaStream.current.getTracks().forEach((track) => {
  //       connection.addTrack(track, localMediaStream.current);
  //     });
  //   }

  //   if (createOffer) {
  //     try {
  //       const offer = await connection.createOffer();
  //       await connection.setLocalDescription(offer);
  //       socket.current.emit(ACTIONS.RELAY_SDP, {
  //         peerId,
  //         sessionDescription: offer,
  //       });
  //     } catch (error) {
  //       console.error("Error creating offer: ", error);
  //     }
  //   }
  // };

  const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
    if (connections.current[peerId]) {
      return;
    }

    const iceServers = freeice();
    const connection = new RTCPeerConnection({ iceServers });

    connections.current[peerId] = { connection, iceCandidatesQueue: [] };

    connection.onicecandidate = (event) => {
      console.log("ICE candidate event:", event);
      if (event.candidate) {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      }
    };

    connection.ontrack = ({ streams: [remoteStream] }) => {
      console.log("Track event:", remoteStream);
      addNewClient({ ...remoteUser, muted: true }, () => {
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

    // if (createOffer) {
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
    // }
  };

  const handleRemovePeer = ({ peerId, userId }) => {
    if (connections.current[peerId]) {
      connections.current[peerId].connection.close();
    }

    delete connections.current[peerId];
    delete audioElements.current[userId];

    setClients((list) => list.filter((c) => c._id !== userId));
  };

  //   const handleIceCandidate = async ({ peerId, icecandidate }) => {
  //     if (icecandidate) {
  //       const connectionData = connections.current[peerId];
  //       if (connectionData) {
  //         if (connectionData.connection.remoteDescription) {
  //           await connectionData.connection.addIceCandidate(icecandidate);
  //         } else {
  //           connectionData.iceCandidatesQueue.push(icecandidate);
  //         }
  //       }
  //     }
  //   };

  //   const setRemoteMedia = async ({
  //     peerId,
  //     sessionDescription: remoteSessionDescription,
  //   }) => {
  //     const connectionData = connections.current[peerId];
  //     if (connectionData) {
  //       const connection = connectionData.connection;
  //       try {
  //         await connection.setRemoteDescription(
  //           new RTCSessionDescription(remoteSessionDescription)
  //         );

  //         if (remoteSessionDescription.type === "offer") {
  //           const answer = await connection.createAnswer();
  //           await connection.setLocalDescription(answer);
  //           socket.current.emit(ACTIONS.RELAY_SDP, {
  //             peerId,
  //             sessionDescription: answer,
  //           });
  //         }

  //         while (connectionData.iceCandidatesQueue.length > 0) {
  //           const candidate = connectionData.iceCandidatesQueue.shift();
  //           await connection.addIceCandidate(candidate);
  //         }
  //       } catch (error) {
  //         console.error("Error setting remote description: ", error);
  //       }
  //     }
  //   };

  const handleIceCandidate = async ({ peerId, icecandidate }) => {
    const connectionData = connections.current[peerId];
    if (connectionData && icecandidate) {
      if (connectionData.connection.remoteDescription) {
        await connectionData.connection.addIceCandidate(icecandidate);
      } else {
        connectionData.iceCandidatesQueue.push(icecandidate);
      }
    }
  };

  //   const setRemoteMedia = async ({
  //     peerId,
  //     sessionDescription: remoteSessionDescription,
  //   }) => {
  //     const connectionData = connections.current[peerId];
  //     if (connectionData) {
  //       const connection = connectionData.connection;

  //       // Ensure we are in the right state
  //       if (connection.signalingState !== "stable") {
  //         console.warn("Connection not in stable state, delaying SDP setting");
  //         setTimeout(
  //           () =>
  //             setRemoteMedia({
  //               peerId,
  //               sessionDescription: remoteSessionDescription,
  //             }),
  //           100
  //         );
  //         return;
  //       }

  //       try {
  //         await connection.setRemoteDescription(
  //           new RTCSessionDescription(remoteSessionDescription)
  //         );

  //         if (remoteSessionDescription.type === "offer") {
  //           const answer = await connection.createAnswer();
  //           await connection.setLocalDescription(answer);
  //           socket.current.emit(ACTIONS.RELAY_SDP, {
  //             peerId,
  //             sessionDescription: answer,
  //           });
  //         }

  //         while (connectionData.iceCandidatesQueue.length > 0) {
  //           const candidate = connectionData.iceCandidatesQueue.shift();
  //           await connection.addIceCandidate(candidate);
  //         }
  //       } catch (error) {
  //         console.error("Error setting remote description: ", error);
  //       }
  //     }
  //   };

  const setRemoteMedia = async ({
    peerId,
    sessionDescription: remoteSessionDescription,
  }) => {
    const connectionData = connections.current[peerId];
    if (!connectionData) return;

    const connection = connectionData.connection;

    // Use a debounce to avoid multiple retries in quick succession
    let retryTimeout;

    const trySettingRemoteDescription = async () => {
      if (connection.signalingState === "stable") {
        clearTimeout(retryTimeout); // Clear any previous retries
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

          // Process any queued ICE candidates
          while (connectionData.iceCandidatesQueue.length > 0) {
            const candidate = connectionData.iceCandidatesQueue.shift();
            await connection.addIceCandidate(candidate);
          }
        } catch (error) {
          console.error("Error setting remote description: ", error);
        }
      } else {
        console.warn("Connection not in stable state, delaying SDP setting");
        retryTimeout = setTimeout(trySettingRemoteDescription, 500); // Retry after a delay
      }
    };

    trySettingRemoteDescription();
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
      setIsSpeaking(!mute && isSpeaking); // Maintain speaking state only if not muted
      socket.current.emit(ACTIONS.TALK, {
        userId: userId,
        roomId,
        isTalk: !mute && isSpeaking,
      });
    }
  };

  const handleRoomEnded = () => {
    toast("Room ended", { icon: "⚠️" });
    navigate("/srdhouse");
  };

  const handleRaiseHand = ({ userId, username, profile, peerId }) => {
    setHandRaiseRequests((prevRequests) => [
      ...prevRequests,
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

  // const handleApproveSpeak = ({ userId }) => {
  //   toast(`User ${userId} has been approved to speak.`);
  //   setHandRaiseRequests((requests) =>
  //     requests.filter((req) => req.userId !== userId)
  //   );
  //   setClients((prevClients) =>
  //     prevClients.map((client) =>
  //       client._id === userId ? { ...client, role: "speaker" } : client
  //     )
  //   );
  // };

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

    // If the current user is the one being approved, add local tracks to peer connection
    if (userId === userDetails._id) {
      //   addLocalTracksToPeers();
      setShowStartSpeakingPrompt(true);
    }
  };

  const handleStartSpeaking = () => {
    setShowStartSpeakingPrompt(false);
    // Add local tracks to peers and ensure audio playback starts
    addLocalTracksToPeers();
    const audioElement = audioElements.current[userDetails._id];
    if (audioElement) {
      audioElement.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  };

  const handleReturnAudience = () => {
    // Mute local audio tracks
    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach((track) => {
        track.enabled = false;
      });
    }

    // Remove the user's hand raise request
    setHandRaiseRequests((requests) =>
      requests.filter((req) => req.userId !== userDetails._id)
    );

    // Display toast message
    toast("You have been moved back to the audience.");
  };

  // Helper function to add local tracks to all peer connections
  const addLocalTracksToPeers = () => {
    if (localMediaStream.current) {
      Object.values(connections.current).forEach(({ connection }) => {
        localMediaStream.current.getTracks().forEach((track) => {
          console.log("Adding track to connection:", track);
          connection.addTrack(track, localMediaStream.current);
        });
      });
    }
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
    }, 300);
  };

  const getAudioLevel = async () => {
    let audioLevel = 0.0;
    const promises = Object.values(connections.current).map(async (pc) => {
      const stats = await pc.connection.getStats();
      stats.forEach((report) => {
        if (report.type === "media-source" && report.kind === "audio") {
          audioLevel = report.audioLevel || 0.0;
        }
      });
    });
    await Promise.all(promises);
    return audioLevel;
  };

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

  const returnAudienceSpeak = (userId) => {
    console.log(`return audience ${userId}`);
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
    approveSpeakRequest,
    rejectSpeakRequest,
    messages,
    sendMessage,
    returnAudienceSpeak,
    handleStartSpeaking,
    showStartSpeakingPrompt,
  };
};
