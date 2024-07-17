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

const ChatRoom = ({ reverse, sendMessage, messages }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isCurtainClose, setIsCurtainClose] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerComment, setShowPickerComment] = useState(false);
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
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    const { emoji } = event;
    console.log(emojiObject);
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
        top: "0",
        right: "0",
        background: reverse ? "#00000020" : "#ffffff33",
        backdropFilter: "blur(10px)",
        height: "100%",
        width: isCurtainClose ? "0" : isBigSecreen ? "450px" : "350px",
        borderRadius: "30px 50px 50px 30px",
        transition: "width 0.5s ease",
        zIndex: "999",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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

        <Box
          ref={commentBoxRef}
          sx={{
            height: "calc(100% - 100px)",
            overflowY: "scroll",
            marginBottom: "1rem",
            display: isCurtainClose ? "none" : "flex",
            flexDirection: "column-reverse",
          }}
        >
          {[...messages].reverse().map((message, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#fff",
                width: "fit-content",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "293px",
                marginLeft: "55px",
                wordWrap: "break-word",
                position: "relative",
                marginBottom: "1rem",

                "&:hover button": {
                  opacity: "1",
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {message.username}
              </Typography>
              <Avatar
                sx={{
                  position: "absolute",
                  left: "-50px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                src={message.avatar}
                alt="User Avatar"
              />
              {message.message}
            </Box>
          ))}
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
    </Box>
  );
};

export default ChatRoom;
