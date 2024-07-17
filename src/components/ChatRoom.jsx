import {
  DragIndicatorOutlined,
  EmojiEmotionsOutlined,
  Send,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Input,
  Typography,
  useMediaQuery,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import React, { Fragment, useEffect, useRef, useState } from "react";

const ChatRoom = ({ reverse, sendMessage, messages, currentUserId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isCurtainClose, setIsCurtainClose] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerComment, setShowPickerComment] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigSecreen = useMediaQuery("(min-width: 1800px)");

  const handleMouseDown = (event) => {
    setDragStartX(event.clientX);
  };

  const handleMouseUp = (event) => {
    const dragDistance = event.clientX - dragStartX;
    if (dragDistance > 100) {
      setIsCurtainClose(true);
      setShowPicker(false);
    } else if (dragDistance < -100) {
      setIsCurtainClose(false);
      setShowPicker(false);
    }
  };

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
    setShowPicker(false);
  };

  const handleSendMessage = () => {
    setShowPicker(false);
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    const { emoji } = emojiObject;
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const commentBoxRef = useRef(null);

  useEffect(() => {
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
    }
  }, [messages]);

  console.log(messages);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "0",
        right: "0",
        background: reverse ? "#00000020" : "#ffffff33",
        backdropFilter: "blur(10px)",
        height: isMobile ? "99%" : "100%",
        width: isCurtainClose ? "0" : isBigSecreen ? "450px" : "350px",
        borderRadius: isMobile ? "30px 0px 0px 30px" : "30px 50px 50px 30px",
        transition: "width 0.5s ease",
        zIndex: "998",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <DragIndicatorOutlined
        sx={{
          position: "absolute",
          top: "50%",
          left: "-23px",
          transform: "translateY(-50%)",
          fontSize: "30px",
          color: reverse ? "#707070" : "#fff",
          cursor: "pointer",
        }}
        onClick={() => {
          setIsCurtainClose((prev) => !prev);
          setShowPicker(false);
        }}
      />
      {!isCurtainClose && (
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
              height: "calc(100% - 100px)",
              overflowY: "scroll",
              marginBottom: "1rem",
              display: isCurtainClose ? "none" : "flex",
              flexDirection: "column-reverse",
            }}
            className="no-scrollbar"
          >
            {[...messages].reverse().map((message, index) => {
              const isCurrentUser = message.userId === currentUserId;
              return (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: isCurrentUser ? "#f25f0cc9" : "#fff",
                    color: isCurrentUser ? "#fff" : "#000",
                    width: "fit-content",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    maxWidth: "240px",
                    marginLeft: isCurrentUser ? "auto" : "55px",
                    marginRight: isCurrentUser ? "55px" : "auto",
                    wordWrap: "break-word",
                    position: "relative",
                    marginBottom: "1rem",
                    "&:hover button": {
                      opacity: "1",
                    },
                  }}
                >
                  {!isCurrentUser && (
                    <>
                      {" "}
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", fontSize: "14px" }}
                      >
                        {message.username}
                      </Typography>
                      <Avatar
                        sx={{
                          position: "absolute",
                          left: isCurrentUser ? "auto" : "-50px",
                          right: isCurrentUser ? "-50px" : "auto",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        src={message.avatar}
                        alt="User Avatar"
                      />
                    </>
                  )}

                  {message.message}
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              display: isCurtainClose ? "none" : "flex",
              justifyContent: "space-between",
              position: "relative",
              columnGap: "5px",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "30px",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Input
                type="text"
                placeholder="Write a comment"
                sx={{
                  width: isBigSecreen ? "330px" : "230px",
                  padding: "10px 20px 10px 20px",
                  fontSize: "16px",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: "#fff",
                  position: "relative",
                  outline: "none",
                  "&::before, &::after": {
                    border: "none",
                  },
                  "&:hover:not(.Mui-disabled):before": {
                    border: "none",
                  },
                }}
                value={newMessage}
                onChange={handleMessageChange}
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
                    right: "10px",
                  }}
                  previewConfig={{
                    showPreview: false,
                  }}
                  onEmojiClick={onEmojiClick}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "41px",
                    width: "0",
                    height: "0",
                    right: "55px",
                    borderTop: "15px solid white",
                    borderBottom: "15px solid transparent",
                    borderRight: "15px solid transparent",
                    borderLeft: "15px solid transparent",
                  }}
                />
              </Fragment>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "5px",
              }}
            >
              <EmojiEmotionsOutlined
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowPicker((prev) => !prev);
                  setShowPickerComment(false);
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                sx={{
                  width: "50px",
                  height: "50px",
                }}
              >
                <Send sx={{ fontSize: "25px", color: "#f25f0c" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatRoom;
