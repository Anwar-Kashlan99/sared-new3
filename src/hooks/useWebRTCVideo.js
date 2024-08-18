// import { useEffect, useRef, useCallback } from "react";
// import { ACTIONS } from "../actionsLive";
// import socketInit from "../socket";
// import { useStateWithCallback } from "./useStateWithCallback";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import freeice from "freeice";

// export const useWebRTC = (roomId, userDetails) => {
//   const [clients, setClients] = useStateWithCallback([]);
//   const mediaElements = useRef({}); // Ref for both audio and video elements
//   const connections = useRef({});
//   const socket = useRef(null);
//   const localMediaStream = useRef(null);
//   const clientsRef = useRef([]);
//   const navigate = useNavigate();

//   // Memoized function to avoid unnecessary re-renders
//   const addNewClient = useCallback(
//     (newClient, cb) => {
//       setClients((existingClients) => {
//         const existing = existingClients.find(
//           (client) => client._id === newClient._id
//         );
//         if (!existing) {
//           return [...existingClients, newClient];
//         }
//         return existingClients;
//       }, cb);
//     },
//     [setClients]
//   );

//   useEffect(() => {
//     clientsRef.current = clients;
//   }, [clients]);

//   useEffect(() => {
//     const initChat = async () => {
//       if (socket.current) {
//         cleanupConnections();
//       }

//       socket.current = socketInit();

//       if (!socket.current) {
//         toast.error("Unable to connect. Retrying...");
//         setTimeout(initChat, 3000);
//         return;
//       }

//       setupSocketEventHandlers();

//       try {
//         await captureMedia();

//         if (userDetails && userDetails._id) {
//           addNewClient({ ...userDetails, muted: true }, () => {
//             const localElement = mediaElements.current[userDetails._id];
//             if (localElement) {
//               localElement.srcObject = localMediaStream.current;
//             }

//             socket.current.emit(ACTIONS.JOIN_LIVE, {
//               roomId,
//               user: userDetails,
//             });
//           });

//           socket.current.on(ACTIONS.JOIN_LIVE, ({ user, isAdmin }) => {
//             const updatedUserDetails = { ...user, isAdmin };
//             addNewClient(updatedUserDetails, () => {
//               const existingClient = clientsRef.current.find(
//                 (client) => client._id === user._id
//               );
//               if (!existingClient) {
//                 console.log(
//                   `User ${user._id} joined as ${isAdmin ? "admin" : "audience"}`
//                 );
//               }
//             });
//           });
//         } else {
//           console.error("Invalid userDetails");
//         }
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//       }
//     };

//     initChat();

//     return () => {
//       if (localMediaStream.current) {
//         localMediaStream.current.getTracks().forEach((track) => track.stop());
//         localMediaStream.current = null; // Explicitly clear the media stream reference
//       }
//       cleanupConnections();
//     };
//   }, [userDetails, addNewClient, setClients, navigate]);

//   const setupSocketEventHandlers = () => {
//     socket.current.on(ACTIONS.MUTE_INFO_LIVE, ({ userId, isMute }) =>
//       handleSetMute(isMute, userId)
//     );
//     socket.current.on(ACTIONS.ADD_PEER_LIVE, handleNewPeer);
//     socket.current.on(ACTIONS.REMOVE_PEER_LIVE, handleRemovePeer);
//     socket.current.on(ACTIONS.ICE_CANDIDATE_LIVE, handleIceCandidate);
//     socket.current.on(ACTIONS.SESSION_DESCRIPTION_LIVE, setRemoteMedia);
//     socket.current.on(ACTIONS.MUTE_LIVE, ({ userId }) =>
//       handleSetMute(true, userId)
//     );
//     socket.current.on(ACTIONS.UNMUTE_LIVE, ({ userId }) =>
//       handleSetMute(false, userId)
//     );
//     socket.current.on(ACTIONS.LIVE_CLIENTS, ({ roomId, clients }) => {
//       console.log("LIVE_CLIENTS event received:", { roomId, clients });
//       setClients(clients);
//     });
//     socket.current.on("LIVE_ENDED_REDIRECT", handleRoomEnded);
//     socket.current.on(ACTIONS.ERROR_LIVE, handleErrorRoom);
//   };

//   const cleanupConnections = useCallback(() => {
//     Object.keys(connections.current).forEach((peerId) => {
//       connections.current[peerId].connection.close();
//       delete connections.current[peerId];
//     });
//     Object.keys(mediaElements.current).forEach((userId) => {
//       delete mediaElements.current[userId];
//     });

//     if (socket.current) {
//       Object.values(ACTIONS).forEach((action) => socket.current.off(action));
//       socket.current.emit(ACTIONS.LEAVE_LIVE, { roomId });
//       socket.current = null;
//       console.log("All socket listeners removed and cleanup complete.");
//     }
//   }, [roomId]);

//   const captureMedia = async () => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       toast.error(
//         "Your browser does not support WebRTC. Please use a modern browser such as Chrome, Firefox, or Edge."
//       );
//       return;
//     }

//     try {
//       localMediaStream.current = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//         video: true, // Capture video stream
//       });

//       // Add local tracks to all existing peer connections
//       addLocalTracksToPeers();
//     } catch (error) {
//       toast.error(
//         "Error capturing media. Please ensure your browser has permission to access the microphone."
//       );
//       console.error("Error capturing media:", error);
//       throw error; // Rethrow to be caught in initChat
//     }
//   };

//   const handleErrorRoom = () => {
//     toast("You are blocked from this live room");
//     setTimeout(() => navigate("/allbroadcasts"), 3000);
//   };

//   const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
//     if (connections.current[peerId]) {
//       return;
//     }

//     const iceServers = freeice();
//     const connection = new RTCPeerConnection({ iceServers });

//     connections.current[peerId] = { connection, iceCandidatesQueue: [] };

//     connection.onicecandidate = (event) => {
//       console.log("ICE candidate event:", event);
//       if (event.candidate) {
//         socket.current.emit(ACTIONS.RELAY_ICE_LIVE, {
//           peerId,
//           icecandidate: event.candidate,
//         });
//       }
//     };

//     connection.ontrack = ({ streams: [remoteStream] }) => {
//       console.log("Track event:", remoteStream);
//       addNewClient({ ...remoteUser, muted: true }, () => {
//         const mediaElement = mediaElements.current[remoteUser._id];
//         if (mediaElement) {
//           mediaElement.srcObject = remoteStream;
//         } else {
//           const observer = new MutationObserver(() => {
//             const element = mediaElements.current[remoteUser._id];
//             if (element) {
//               element.srcObject = remoteStream;
//               observer.disconnect(); // Stop observing once element is found
//             }
//           });
//           observer.observe(document.body, { childList: true, subtree: true });
//         }
//       });
//     };

//     if (localMediaStream.current) {
//       localMediaStream.current.getTracks().forEach((track) => {
//         connection.addTrack(track, localMediaStream.current);
//       });
//     }
//     console.log(createOffer);
//     if (createOffer) {
//       try {
//         const offer = await connection.createOffer();
//         await connection.setLocalDescription(offer);
//         socket.current.emit(ACTIONS.RELAY_SDP_LIVE, {
//           peerId,
//           sessionDescription: offer,
//         });
//       } catch (error) {
//         console.error("Error creating offer: ", error);
//       }
//     }
//   };

//   const handleRemovePeer = ({ peerId, userId }) => {
//     if (connections.current[peerId]) {
//       connections.current[peerId].connection.close();
//     }

//     delete connections.current[peerId];
//     delete mediaElements.current[userId];

//     setClients((list) => list.filter((c) => c._id !== userId));
//   };

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
//           socket.current.emit(ACTIONS.RELAY_SDP_LIVE, {
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

//   const handleSetMute = (mute, userId) => {
//     setClients((prevClients) =>
//       prevClients.map((client) =>
//         client._id === userId ? { ...client, muted: mute } : client
//       )
//     );
//   };

//   const handleRoomEnded = () => {
//     toast("Room ended", { icon: "⚠️" });
//     setTimeout(() => navigate("/allbroadcasts"), 3000);
//   };

//   // Helper function to add local tracks to all peer connections
//   const addLocalTracksToPeers = () => {
//     if (localMediaStream.current) {
//       Object.values(connections.current).forEach(({ connection }) => {
//         localMediaStream.current.getTracks().forEach((track) => {
//           console.log("Adding track to connection:", track);
//           connection.addTrack(track, localMediaStream.current);
//         });
//       });
//     }
//   };

//   const provideRef = (instance, userId) => {
//     mediaElements.current[userId] = instance;
//   };

//   const handleMute = (isMute, userId) => {
//     let settled = false;
//     let interval = null;

//     const setMute = () => {
//       if (localMediaStream.current) {
//         localMediaStream.current.getTracks().forEach((track) => {
//           if (track.kind === "audio") {
//             track.enabled = !isMute;
//             if (!settled) {
//               socket.current.emit(
//                 isMute ? ACTIONS.MUTE_LIVE : ACTIONS.UNMUTE_LIVE,
//                 {
//                   roomId,
//                   userId,
//                 }
//               );
//               settled = true;
//             }
//           }
//         });
//       }
//     };

//     if (localMediaStream.current) {
//       setMute();
//     } else {
//       interval = setInterval(() => {
//         if (localMediaStream.current) {
//           setMute();
//           clearInterval(interval);
//         }
//       }, 200);
//     }
//   };

//   const endRoom = () => {
//     if (socket.current) {
//       socket.current.emit(ACTIONS.END_LIVE, roomId);
//     }
//   };

//   const blockUser = (userId) => {
//     if (socket.current) {
//       socket.current.emit(ACTIONS.BLOCK_USER_LIVE, { roomId, userId });
//     }
//   };

//   return {
//     clients,
//     provideRef,
//     handleMute,
//     endRoom,
//     blockUser,
//   };
// };
