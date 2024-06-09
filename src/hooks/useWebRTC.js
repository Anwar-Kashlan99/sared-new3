import { useEffect, useRef, useCallback } from "react";
import { ACTIONS } from "../actions";
import socketInit from "../socket";
import { useStateWithCallback } from "./useStateWithCallback";
import freeice from "freeice";

export const useWebRTC = (roomId, userDetails) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const clientsRef = useRef(null);

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

      await captureMedia();

      addNewClient({ ...userDetails, muted: true }, () => {
        const localElement = audioElements.current[userDetails._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });

      console.log("Emitting JOIN event:", { roomId, user: userDetails });
      socket.current.emit(ACTIONS.JOIN, {
        roomId,
        user: userDetails,
      });
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

      const connection = new RTCPeerConnection({ iceServers: freeice() });

      connections.current[peerId] = connection;

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
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

      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          connections.current[peerId].addTrack(track, localMediaStream.current);
        });
      } else {
        console.warn("Local media stream is not available.");
      }

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
        delete connections.current[peerId];
      }

      if (audioElements.current[peerId]) {
        delete audioElements.current[peerId];
      }

      setClients((list) => list.filter((c) => c._id !== userId));
    };

    const handleIceCandidate = async ({ peerId, icecandidate }) => {
      if (icecandidate) {
        const connection = connections.current[peerId];
        if (connection) {
          await connection.addIceCandidate(icecandidate);
        }
      }
    };

    const setRemoteMedia = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      const connection = connections.current[peerId];
      if (connection) {
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
        } catch (error) {
          console.error("Error setting remote description: ", error);
        }
      }
    };

    const handleSetMute = (mute, userId) => {
      const clientIdx = clientsRef.current.findIndex(
        (client) => client._id === userId
      );
      const allConnectedClients = JSON.parse(
        JSON.stringify(clientsRef.current)
      );
      if (clientIdx > -1) {
        allConnectedClients[clientIdx].muted = mute;
        setClients(allConnectedClients);
      }
    };

    initChat();

    return () => {
      console.log("Cleaning up...");
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      }
      cleanupConnections();
    };
  }, [roomId, userDetails]);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const handleMute = (isMute, userId) => {
    if (userId === userDetails._id) {
      const interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          socket.current.emit(isMute ? ACTIONS.MUTE : ACTIONS.UNMUTE, {
            roomId,
            userId: userDetails._id,
          });
          clearInterval(interval);
        }
      }, 200);
    }
  };

  return {
    clients,
    provideRef,
    handleMute,
  };
};
