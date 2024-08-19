import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  useMediaQuery,
  Input,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { Add, EmojiEmotionsOutlined, Send, Share } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import ChatRoom from "../../components/ChatRoom";
import { SharePopup } from "../../components/SharePopup";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRoomQuery } from "../../store/srdClubSlice";
import { useWebRTCVideo } from "../../hooks/useWebRTCVideo";
import { useSelector } from "react-redux";

const GoLive = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user.userDetails);
  const [streamerId, setStreamerId] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAudience, setIsAudience] = useState(false);
  const [isMuted, setMuted] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentReactions, setCommentReactions] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerComment, setShowPickerComment] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isNonMobile = useMediaQuery("(min-width: 1200px)");
  const isBigScreen = useMediaQuery("(min-width: 1800px)");

  const commentBoxRef = useRef(null);

  const {
    data: room,
    isError: roomError,
    isLoading: roomLoading,
  } = useGetRoomQuery(roomId);

  const { clients, provideRef, handleMute, endRoom, blockUser } =
    useWebRTCVideo(roomId, userDetails);
  const currentUser = clients.find((client) => client._id === userDetails._id);
  console.log("Clients list:", clients);

  // Effect to determine if the user is an admin or audience
  useEffect(() => {
    if (clients.length > 0) {
      const firstAdmin = clients.find((client) => client.role === "admin");
      console.log("Admin details:", firstAdmin);
      if (firstAdmin) {
        setStreamerId(firstAdmin._id);
        setIsAdmin(true);
      }

      const currentUserRole = clients.find(
        (client) => client._id === userDetails._id
      )?.role;
      if (currentUserRole === "audience") setIsAudience(true);
    }
  }, [clients, userDetails._id]);
  // Effect to mute/unmute the user
  useEffect(() => {
    handleMute(isMuted, userDetails?._id);
  }, [isMuted, handleMute, userDetails?._id]);

  // Scroll to the bottom of the comments when a new comment is added
  useEffect(() => {
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
    }
  }, [comments]);

  const handleMuteClick = useCallback(() => {
    if (isAdmin && currentUser) {
      setMuted((prev) => !prev);
    }
  }, [isAdmin, currentUser]);

  const handleEndRoom = async () => {
    await endRoom();
    navigate("/srdhouse");
  };

  const videoRef = (instance) => {
    console.log("Video ref instance:", instance);
    if (instance && currentUser?._id === streamerId) {
      provideRef(instance, currentUser._id);
    }
  };

  // const handleCommentChange = (event) => {
  //   if (isAdmin) {
  //     setNewComment(event.target.value);
  //     setShowPicker(false);
  //   }
  // };

  // const handleAddComment = () => {
  //   if (isAdmin && newComment) {
  //     const commentId = Date.now(); // Unique comment ID
  //     setComments((prevComments) => [
  //       ...prevComments,
  //       { id: commentId, comment: newComment },
  //     ]);
  //     setNewComment("");
  //     setCommentReactions((prevReactions) => ({
  //       ...prevReactions,
  //       [commentId]: {},
  //     }));
  //   }
  // };

  // const onEmojiClick = (event) => {
  //   setNewComment((prevComment) => prevComment + event.emoji);
  // };

  // const handleReactionSelect = (commentId, emojiObject) => {
  //   setCommentReactions((prevReactions) => {
  //     if (prevReactions[commentId]?.emoji === emojiObject.emoji) {
  //       const updatedReactions = { ...prevReactions };
  //       delete updatedReactions[commentId];
  //       return updatedReactions;
  //     }
  //     return {
  //       ...prevReactions,
  //       [commentId]: emojiObject,
  //     };
  //   });
  //   setShowPickerComment(false);
  // };

  const handleShareClick = () => {
    setShowSharePopup((prev) => !prev);
  };

  // const reversedComments = [...comments].reverse();

  console.log("Current user:", userDetails);
  console.log("Clients list:", clients);
  console.log("Streamer ID:", streamerId);

  return (
    <Box sx={{ minHeight: "calc(100vh - 56px)" }}>
      <Toaster position="top-center" reverseOrder={false} />
      <Box
        sx={{
          width: "90%",
          m: isMobile ? "6rem auto 3rem" : "4.5rem auto 1.5rem",
          padding: "1rem",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: isBigScreen ? "950px" : "700px",
            borderRadius: "50px",
            overflow: "hidden",
          }}
        >
          <video
            alt="goliveimg"
            ref={videoRef}
            autoPlay
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              height: "100%",
              borderRadius: "50px",
            }}
          />
          {/**
           
          { isNonMobile ? (
            <ChatRoom
              comments={comments}
              setComments={setComments}
              setNewComment={setNewComment}
              newComment={newComment}
              commentReactions={commentReactions}
              setCommentReactions={setCommentReactions}
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                bottom: "0",
                left: "0",
                height: "275px",
                width: "100%",
                backgroundImage:
                  "linear-gradient(to top, rgb(0 0 0 / 81%), rgb(0 0 0 / 3%))",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  height: "100%",
                  padding: "1rem",
                  position: "relative",
                }}
              >
                <Box
                  ref={commentBoxRef}
                  sx={{
                    display: "flex",
                    height: "calc(100% - 100px)",
                    overflowY: "scroll",
                    marginBottom: "1rem",
                    flexDirection: "column-reverse",
                  }}
                >
                  {reversedComments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{
                        backgroundColor: "#0c0c0c54",
                        width: "fit-content",
                        padding: "10px 15px",
                        borderRadius: "30px",
                        maxWidth: "250px",
                        wordWrap: "break-word",
                        position: "relative",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        columnGap: "13px",
                      }}
                    >
                      <Avatar src={comment.avatar} alt="User Avatar" />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          color: "#F7f7f7",
                          maxWidth: "150px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: "#FFF" }}
                        >
                          {comment.username}
                        </Typography>
                        {comment.comment}
                      </Box>
                      <Box
                        sx={{
                          cursor: "pointer",
                          position: "absolute",
                          right: "-25px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          display: "flex",
                        }}
                        onClick={() => setShowPickerComment(comment.id)}
                      >
                        <Add sx={{ color: "#f25f0c" }} />
                      </Box>
                      {showPickerComment === comment.id && (
                        <EmojiPicker
                          searchDisabled
                          emojiStyle="facebook"
                          className="emoji-picker"
                          style={{
                            position: "absolute",
                            top: "-50px",
                            left: "5px",
                            zIndex: "9999",
                            backgroundColor: "#0c0c0c54",
                            border: "none",
                          }}
                          previewConfig={{
                            showPreview: false,
                          }}
                          onEmojiClick={(emojiObject) =>
                            handleReactionSelect(comment.id, emojiObject)
                          }
                        />
                      )}
                      {comment.id in commentReactions && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-20px",
                            fontSize: "21px",
                            right: "5px",
                          }}
                        >
                          {commentReactions[comment.id].emoji}
                        </span>
                      )}
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    alignSelf: "flex-end",
                    mb: "10px",
                  }}
                >
                  <IconButton onClick={handleShareClick}>
                    <Share sx={{ fontSize: "35px", color: "#f25f0c" }} />
                  </IconButton>
                  {showSharePopup && <SharePopup title={""} left={"-150px"} />}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    columnGap: "5px",
                    alignItems: "center",
                  }}
                >
                  {<Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0c0c0c54",
                      borderRadius: "30px",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Input
                        type="text"
                        placeholder="Write a comment"
                        sx={{
                          color: "#fff",
                          width: "100%",
                          padding: "10px 35px 10px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          backgroundColor: "#0c0c0c54",
                          "&::before, &::after": { border: "none" },
                        }}
                        value={newComment}
                        onChange={handleCommentChange}
                      />
                      <EmojiEmotionsOutlined
                        sx={{ cursor: "pointer", color: "#707070" }}
                        onClick={() => setShowPicker((prev) => !prev)}
                      />
                    </Box>
                    {showPicker && (
                      <Fragment>
                        <EmojiPicker
                          searchDisabled
                          emojiStyle="facebook"
                          style={{
                            height: "250px",
                            width: "300px",
                            position: "absolute",
                            bottom: "70px",
                          }}
                          previewConfig={{ showPreview: false }}
                          onEmojiClick={onEmojiClick}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "42px",
                            width: "0",
                            height: "0",
                            right: "80px",
                            borderTop: "15px solid white",
                            borderBottom: "15px solid transparent",
                            borderRight: "15px solid transparent",
                            borderLeft: "15px solid transparent",
                          }}
                        />
                      </Fragment>
                    )}
                    <IconButton
                      onClick={handleAddComment}
                      sx={{ width: "50px", height: "50px" }}
                    >
                      <Send sx={{ fontSize: "25px", color: "#f25f0c" }} />
                    </IconButton>
                  </Box>}
                </Box>
              </Box>
            </Box>
          )}

           */}
        </Box>
      </Box>
    </Box>
  );
};

export default GoLive;
