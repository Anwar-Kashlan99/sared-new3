import { useEffect, useRef, useCallback } from "react";
import socketInit from "../socket";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import freeice from "freeice";
import { useStateWithCallback } from "./useStateWithCallback";
import { ACTIONS } from "../actionsLive";

export const useWebRTC = (roomId, userDetails) => {
  const [clients, setClients] = useStateWithCallback([]);

  const mediaElements = useRef({});
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
        socket.current.on(ACTIONS.JOIN_LIVE, handleJoin);
        socket.current.on(ACTIONS.ADD_PEER_LIVE, handleNewPeer);
        socket.current.on(ACTIONS.SESSION_DESCRIPTION_LIVE, setRemoteMedia);
        socket.current.on(ACTIONS.ICE_CANDIDATE_LIVE, handleIceCandidate);
        socket.current.on(ACTIONS.REMOVE_PEER_LIVE, handleRemovePeer);
        socket.current.on(ACTIONS.MUTE_LIVE, ({ userId }) =>
          handleSetMute(true, userId)
        );
        socket.current.on(ACTIONS.UNMUTE_LIVE, ({ userId }) =>
          handleSetMute(false, userId)
        );
        socket.current.on(
          ACTIONS.LIVE_CLIENTS_CLIENTS,
          ({ roomId, clients }) => {
            setClients(clients);
          }
        );
        socket.current.on(ACTIONS.ERROR_LIVE, handleErrorRoom);
        socket.current.on("LIVE_ENDED_REDIRECT", handleRoomEnded);

        if (userDetails.role === "admin") {
          await captureMedia(); // Only admin captures media
        }

        socket.current.emit(ACTIONS.JOIN_LIVE, { roomId, user: userDetails });
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
      socket.current.emit(ACTIONS.LEAVE_LIVE, { roomId });
      socket.current.disconnect(); // Ensure this is called once
      socket.current = null;
    }

    for (let userId in mediaElements.current) {
      delete mediaElements.current[userId];
    }

    console.log("All socket listeners removed and cleanup complete.");
  }, [roomId]);

  const captureMedia = async () => {
    if (userDetails.role !== "admin") return; // Only admin captures media
    try {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: true,
      });
      // Make sure the track is enabled right after capture
      localMediaStream.current.getTracks().forEach((track) => {
        track.enabled = true;
        console.log(
          `Captured track kind: ${track.kind}, enabled: ${track.enabled}`
        );
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

  const handleJoin = ({ user }) => {
    addNewClient({ ...user });
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
          socket.current.emit(ACTIONS.RELAY_ICE_LIVE, {
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
        const mediaElement = mediaElements.current[user._id];
        if (mediaElement) {
          mediaElement.srcObject = remoteStream;
          mediaElement.play().catch(console.error);
        }
      };

      // If current user is admin, send media tracks to new peer
      if (userDetails.role === "admin" && localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          connection.addTrack(track, localMediaStream.current);
        });
      }
      if (createOffer) {
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        socket.current.emit(ACTIONS.RELAY_SDP_LIVE, {
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
        socket.current.emit(ACTIONS.RELAY_SDP_LIVE, {
          peerId,
          sessionDescription: answer,
        });
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

    delete mediaElements.current[userId];
    setClients((list) => list.filter((client) => client._id !== userId));
  };

  const handleSetMute = (mute, userId) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === userId ? { ...client, muted: mute } : client
      )
    );

    if (userId === userDetails._id) {
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

  const handleRoomEnded = () => {
    toast("live ended", { icon: "⚠️" });
    navigate("/allbroadcasts");
  };

  const handleErrorRoom = () => {
    toast("You are blocked from this live");
    navigate("/allbroadcasts");
  };

  const provideRef = (instance, userId) => {
    mediaElements.current[userId] = instance;
  };

  const handleMute = (isMute, userId) => {
    let settled = false;

    const setMute = () => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          if (track.kind === "audio") {
            track.enabled = !isMute;
            if (!settled) {
              socket.current.emit(
                isMute ? ACTIONS.MUTE_LIVE : ACTIONS.UNMUTE_LIVE,
                {
                  roomId,
                  userId,
                }
              );
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
      socket.current.emit(ACTIONS.END_LIVE, roomId);
    }
  };

  const blockUser = (userId) => {
    if (socket.current) {
      socket.current.emit(ACTIONS.BLOCK_USER_LIVE, { roomId, userId });
    }
  };

  return {
    clients,
    provideRef,
    handleMute,
    endRoom,
    blockUser,
  };
};
