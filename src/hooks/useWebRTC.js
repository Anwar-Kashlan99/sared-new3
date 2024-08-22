import { useEffect, useRef, useCallback, useState } from "react";
import socketInit from "../socket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import freeice from "freeice";
import { ACTIONS } from "../actionsSrdHouse";
import { useStateWithCallback } from "./useStateWithCallback";

export const useWebRTC = (roomId, userDetails) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const navigate = useNavigate();
  const [handRaiseRequests, setHandRaiseRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStartSpeakingPrompt, setShowStartSpeakingPrompt] = useState(false);
  const monitoringInterval = useRef(null);

  const addNewClient = useCallback(
    (newClient) => {
      setClients((existingClients) => {
        const existing = existingClients.find(
          (client) => client._id === newClient._id
        );
        if (!existing) {
          return [...existingClients, newClient];
        }
        return existingClients;
      });
    },
    [setClients]
  );

  useEffect(() => {
    const initChat = async () => {
      socket.current = socketInit();

      if (!socket.current) {
        console.error("Socket initialization failed");
        return;
      }

      socket.current.on(ACTIONS.JOIN, ({ user, isAdmin }) => {
        const updatedUserDetails = { ...user, isAdmin };
        addNewClient(updatedUserDetails);
      });

      await captureMedia();

      socket.current.emit(ACTIONS.JOIN, { roomId, user: userDetails });

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

      startMonitoringAudioLevels();
    };

    initChat();

    return () => {
      cleanupConnections();
    };
  }, [roomId, userDetails, addNewClient]);

  const cleanupConnections = () => {
    for (let peerId in connections.current) {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
        delete connections.current[peerId];
      }
    }

    for (let userId in audioElements.current) {
      delete audioElements.current[userId];
    }

    if (socket.current) {
      socket.current.disconnect();
    }

    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
  };

  const captureMedia = async () => {
    try {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Handle audio tracks
      localMediaStream.current.getTracks().forEach((track) => {
        for (const connection of Object.values(connections.current)) {
          connection.addTrack(track, localMediaStream.current);
        }
      });
    } catch (error) {
      console.error("Error capturing media:", error);
      toast.error(
        "Error capturing media. Please ensure your browser has permission to access the microphone."
      );
    }
  };

  const handleNewPeer = async ({ peerId, createOffer, user }) => {
    if (connections.current[peerId]) return;

    const iceServers = freeice();
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

    connection.ontrack = ({ streams: [remoteStream] }) => {
      addNewClient({ ...user, muted: true });
      audioElements.current[user._id].srcObject = remoteStream;
    };

    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach((track) => {
        connection.addTrack(track, localMediaStream.current);
      });
    }

    if (createOffer) {
      console.log("createOffer:", createOffer);
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socket.current.emit(ACTIONS.RELAY_SDP, {
        peerId,
        sessionDescription: offer,
      });
    }
  };

  const setRemoteMedia = async ({ peerId, sessionDescription }) => {
    const connection = connections.current[peerId];
    if (!connection) return;

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
  };

  const handleIceCandidate = async ({ peerId, icecandidate }) => {
    const connection = connections.current[peerId];
    if (connection) {
      await connection.addIceCandidate(new RTCIceCandidate(icecandidate));
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
      socket.current.emit(ACTIONS.TALK, {
        userId,
        roomId,
        isTalk: !mute && isSpeaking,
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

    if (userId === userDetails._id) {
      setShowStartSpeakingPrompt(true);
    }
  };

  const handleStartSpeaking = () => {
    setShowStartSpeakingPrompt(false);
    // Add local tracks to peers and ensure audio playback starts
    addLocalTracksToPeers();
    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = true;
        }
      });
    }

    const audioElement = audioElements.current[userDetails._id];
    if (audioElement) {
      audioElement.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  };

  const handleReturnAudience = () => {
    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach((track) => {
        track.enabled = false;
      });
    }
    toast("You have been moved back to the audience.");
  };

  const addLocalTracksToPeers = () => {
    if (localMediaStream.current) {
      Object.keys(connections.current).forEach((peerId) => {
        const connection = connections.current[peerId];
        console.log(
          `Peer connection state for ${peerId}: ${connection.connectionState}`
        );

        if (connection) {
          const senders = connection.getSenders();

          localMediaStream.current.getTracks().forEach((track) => {
            const trackAlreadyAdded = senders.some(
              (sender) => sender.track === track
            );

            if (!trackAlreadyAdded) {
              console.log(
                `Adding track to connection for peer ${peerId}:`,
                track
              );
              try {
                connection.addTrack(track, localMediaStream.current);
              } catch (error) {
                console.error(`Failed to add track to peer ${peerId}:`, error);
              }
            } else {
              console.log(
                `Track already added to connection for peer ${peerId}`
              );
            }
          });
        } else {
          console.error(`No connection found for peer ${peerId}`);
        }
      });
    } else {
      console.error("Local media stream not available");
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
      if (audioLevel > 0.1) {
        if (
          !isSpeaking &&
          !clients.find((client) => client._id === userDetails._id)?.muted
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
    if (connections.current[userDetails._id]) {
      const stats = await connections.current[userDetails._id].getStats();
      stats.forEach((report) => {
        if (report.type === "media-source" && report.kind === "audio") {
          audioLevel = report.audioLevel || 0.0;
        }
      });
    }
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
    approveSpeakRequest,
    rejectSpeakRequest,
    messages,
    sendMessage,
    returnAudienceSpeak,
    handleStartSpeaking,
    showStartSpeakingPrompt,
  };
};
