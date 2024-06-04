import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Box,
  useMediaQuery,
  Input,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import goliveimg from "../../assets/goliveimg.jpg";
import EmojiPicker from "emoji-picker-react";
import { Add, EmojiEmotionsOutlined, Send, Share } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import ChatRoom from "../../components/ChatRoom";
import { SharePopup } from "../../components/SharePopup";
import vid from "../../assets/data/live/live1.mp4";

const GoLive = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentReactions, setCommentReactions] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isNonMobile = useMediaQuery("(min-width: 1200px)");
  const [showPickerComment, setShowPickerComment] = useState(false);

  const isBigSecreen = useMediaQuery("(min-width: 1800px)");

  // for the comment

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
    setShowPicker(false);
  };

  const handleAddComment = () => {
    if (newComment) {
      const commentId = Date.now(); // Generate a unique comment ID
      const updatedComments = [
        ...comments,
        { id: commentId, comment: newComment },
      ];
      setComments(updatedComments);
      setNewComment("");
      setCommentReactions((prevReactions) => ({
        ...prevReactions,
        [commentId]: {},
      }));
    }
  };
  const reversedComments = [...comments].reverse();

  const commentBoxRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the comment box when a new comment is added
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
    }
  }, [comments]);

  // for the Emoji

  const onEmojiClick = (event) => {
    const { emoji } = event;
    setNewComment((prevComment) => prevComment + emoji);
  };
  const handleReactionSelect = (commentId, emojiObject) => {
    // Check if the comment already has the same reaction
    if (commentReactions[commentId]?.emoji === emojiObject.emoji) {
      // Remove the reaction if it already exists
      const updatedReactions = { ...commentReactions };
      delete updatedReactions[commentId];
      setCommentReactions(updatedReactions);
      setShowPickerComment(false);
    } else {
      // Add or update the reaction
      const updatedReactions = {
        ...commentReactions,
        [commentId]: emojiObject,
      };
      setCommentReactions(updatedReactions);
      setShowPickerComment(false);
    }
  };

  // for Sharing

  const [showSharePopup, setShowSharePopup] = useState(false);
  const handleShareClick = () => {
    setShowSharePopup(!showSharePopup);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
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
            height: isBigSecreen ? "950px" : "700px",
            borderRadius: "50px",
            overflow: "hidden",
          }}
        >
          <video
            alt="goliveimg"
            src={vid}
            controls
            autoPlay
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              height: "100%",
              borderRadius: "50px",
            }}
          />
          {isNonMobile ? (
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
                  " linear-gradient(to top, rgb(0 0 0 / 81%), rgb(0 0 0 / 3%))",
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
                    height: "calc(100% - 100px)", // Set the height of the scrollable container
                    overflowY: "scroll", // Enable vertical scrolling
                    marginBottom: "1rem", // Add some spacing at the bottom
                    flexDirection: "column-reverse", // Reverse the order of the comments
                  }}
                >
                  {reversedComments.map((comment, index) => (
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
                      <Avatar sx={{}} src={comment.avatar} alt="User Avatar" />
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
                          reactionsDefaultOpen
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
                    <Share
                      sx={{
                        fontSize: "35px",
                        color: "#f25f0c",
                      }}
                    />
                  </IconButton>

                  {showSharePopup && <SharePopup title={""} left={"-150px"} />}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                    columnGap: "5px",
                    alignItems: "center",
                  }}
                >
                  <Box
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
                          border: "none",
                          backgroundColor: "#0c0c0c54",
                          position: "relative",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&:hover:not(.Mui-disabled):before": {
                            border: "none",
                          },
                        }}
                        value={newComment}
                        onChange={handleCommentChange}
                      />
                      <EmojiEmotionsOutlined
                        sx={{
                          cursor: "pointer",
                          color: "#707070",
                        }}
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
                          previewConfig={{
                            showPreview: false,
                          }}
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
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GoLive;
