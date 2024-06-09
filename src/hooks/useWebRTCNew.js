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
  const clientsRef = useRef(null);
  const navigate = useNavigate();
  const [handRaiseRequests, setHandRaiseRequests] = useState([]); // To track hand raise requests

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

      socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
        handleSetMute(isMute, userId);
      });

      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
      socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
        handleSetMute(true, userId);
      });
      socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
        handleSetMute(false, userId);
      });

      // Handle the ROOM_CLIENTS event
      socket.current.on(ACTIONS.ROOM_CLIENTS, ({ roomId, clients }) => {
        console.log(`Updated clients for room ${roomId}:`, clients);

        setClients(clients);
      });

      // Listen for ROOM_ENDED_REDIRECT event
      socket.current.on("ROOM_ENDED_REDIRECT", () => {
        console.log("Room ended, redirecting to /srdhouse");
        toast("Room ended", {
          icon: "⚠️",
        });
        navigate("/srdhouse");
      });

      socket.current.on(
        ACTIONS.RAISE_HAND,
        ({ peerId, userId, username, profile }) => {
          setHandRaiseRequests((requests) => [
            ...requests,
            { peerId, userId, username, profile },
          ]);
          toast(`User ${userId} has raised their hand.`);
        }
      );

      socket.current.on(ACTIONS.APPROVE_SPEAK, ({ userId }) => {
        toast(`User ${userId} has been approved to speak.`);
        // Remove from hand raise requests
        setHandRaiseRequests((requests) =>
          requests.filter((req) => req.userId !== userId)
        );
      });

      socket.current.on(ACTIONS.REJECT_SPEAK, ({ userId }) => {
        toast(`User ${userId} has been rejected to speak.`);
        // Remove from hand raise requests
        setHandRaiseRequests((requests) =>
          requests.filter((req) => req.userId !== userId)
        );
      });

      socket.current.on(ACTIONS.RAISE_HAND_DUPLICATE, ({ message }) => {
        toast(message);
      });

      await captureMedia();

      // Add the current user as the first client
      addNewClient({ ...userDetails, muted: true }, () => {
        const localElement = audioElements.current[userDetails._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }

        console.log("Emitting JOIN event:", { roomId, user: userDetails });
        socket.current.emit(ACTIONS.JOIN, {
          roomId,
          user: userDetails,
        });
      });

      socket.current.on(
        ACTIONS.JOIN,
        ({ roomId, user, isAdmin, adminUser }) => {
          const updatedUserDetails = { ...user, isAdmin };
          addNewClient(updatedUserDetails);
          console.log(
            `User ${user._id} joined as ${isAdmin ? "admin" : "audience"}`
          );
        }
      );
    };

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
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            latency: 0,
          },
        });
        console.log("Media captured");
      } catch (error) {
        console.error("Error capturing media: ", error);
        alert(
          "Error capturing media. Please ensure your browser has permission to access the microphone."
        );
      }
    };

    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (connections.current[peerId]) {
        return console.warn(`You are already connected with ${peerId}`);
      }

      console.log(`Adding new peer: ${peerId}`);

      const connectionConstraints = {
        optional: [{ DtlsSrtpKeyAgreement: true }, { RtpDataChannels: true }],
      };

      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
        ...connectionConstraints,
      });

      connections.current[peerId].onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.ICE_CANDIDATE, {
            peerId,
            iceCandidate: event.candidate,
          });
        }
      };

      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser._id]) {
            audioElements.current[remoteUser._id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser._id]) {
                audioElements.current[remoteUser._id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 300);
          }
        });
      };

      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);
        socket.current.emit(ACTIONS.SESSION_DESCRIPTION, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    const handleRemovePeer = ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }

      delete connections.current[peerId];
      delete audioElements.current[userId];

      setClients((list) => list.filter((c) => c._id !== userId));
    };

    const handleIceCandidate = async ({ peerId, iceCandidate }) => {
      if (connections.current[peerId]) {
        await connections.current[peerId].addIceCandidate(
          new RTCIceCandidate(iceCandidate)
        );
      }
    };

    const setRemoteMedia = async ({
      peerId,
      sessionDescription: remoteDescription,
    }) => {
      await connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === "offer") {
        const answer = await connections.current[peerId].createAnswer();
        await connections.current[peerId].setLocalDescription(answer);
        socket.current.emit(ACTIONS.SESSION_DESCRIPTION, {
          peerId,
          sessionDescription: answer,
        });
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

    initChat();

    return () => cleanupConnections();
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
    handRaiseRequests, // Add this to return the requests
    approveSpeakRequest,
    rejectSpeakRequest,
  };
};
