import {
  EmojiEmotionsOutlined,
  MenuOutlined,
  SearchOutlined,
  Send,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Input,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EmojiPicker from "emoji-picker-react";

const ChatRoomPage = () => {
  const [searchValue, setSearchValue] = useState();
  const [sidbarClosed, setSidbarClosed] = useState(false);
  const [conversations, setConversations] = useState([]); // State for conversation list
  const [selectedConversation, setSelectedConversation] = useState(null); // State for selected conversation
  const [showPicker, setShowPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const commentBoxRef = useRef(null);

  useEffect(() => {
    // Fetch conversations from the server or initialize
    // For example purposes, we simulate it with static data
    setConversations([
      {
        id: 1,
        name: "Conversation 1",
        profile: "",
        lastmassege: "lorem ipsom sdds",
      },
      {
        id: 2,
        name: "Conversation 2",
        profile: "",
        lastmassege: "lorem ipsom sdds",
      },
    ]);

    // // Listen for incoming messages
    // socket.on('message', (message) => {
    //   if (selectedConversation && message.conversationId === selectedConversation.id) {
    //     setMessages((prevMessages) => [...prevMessages, message.text]);
    //   }
    // });

    // // Cleanup on component unmount
    // return () => {
    //   socket.off('message');
    // };
  }, [selectedConversation]);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };
  const handleSidbarToggle = () => {
    setSidbarClosed((priv) => !priv);
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]); // Clear existing messages when selecting a new conversation
  };

  const handleSendMessage = () => {
    // if (currentMessage.trim() && selectedConversation) {
    //   const message = {
    //     conversationId: selectedConversation.id,
    //     text: currentMessage
    //   };
    //   socket.emit('sendMessage', message);
    //   setCurrentMessage('');
    // }
  };

  const handleMessageChange = (event) => {
    setCurrentMessage(event.target.value);
    setShowPicker(false);
  };

  const onEmojiClick = (event) => {
    const { emoji } = event;
    setCurrentMessage((prevMessage) => prevMessage + emoji);
  };

  useEffect(() => {
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ minHeight: "calc(100vh - 56px)", display: "flex" }}>
      {/**sidbar */}
      <Box
        sx={{
          position: "sticky",
          left: "0",
          top: "0",
          width: "fit-content",
          minHeight: "calc(100vh - 56px)",
          backgroundColor: "#ECE9E9",
          pt: isMobile ? "0.5rem" : "5.5rem",
          px: isMobile ? "0.3rem" : "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            columnGap: "10px",
            marginBottom: "25px",
          }}
        >
          <IconButton
            sx={{ display: isMobile ? "none" : "block" }}
            onClick={handleSidbarToggle}
          >
            <MenuOutlined sx={{ color: "#707070", fontSize: "28px" }} />
          </IconButton>
          <Box
            sx={{
              position: "relative",
              display: sidbarClosed ? "none" : "block",
            }}
          >
            <Input
              type="text"
              placeholder={t("Search")}
              value={searchValue}
              sx={{
                width: "300px",
                padding: "5px 40px 5px 15px",
                fontSize: "16px",
                borderRadius: "15px",
                background: "#f7f7f7",
                border: "none",
                boxShadow: "1px 4px 7px 0px #707070",
                outline: "none",
                "&::before, &::after": {
                  border: "none",
                },
                "&:hover:not(.Mui-disabled):before": {
                  border: "none",
                },
              }}
              onChange={handleSearch}
            />

            <SearchOutlined
              sx={{
                position: "absolute",
                fontSize: "25px",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </Box>
        </Box>

        {/** Ongoing chat */}

        <Box sx={{ flexGrow: 1, overflowY: "auto", width: "100%" }}>
          {conversations.map((conv) => (
            <Box
              key={conv.id}
              sx={{
                padding: "12px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                columnGap: "15px",
                borderRadius: "35px",
                backgroundColor:
                  selectedConversation?.id === conv.id ? "#ddd" : "",
              }}
              onClick={() => handleConversationSelect(conv)}
            >
              <Avatar
                src={conv.profile}
                sx={{ ml: sidbarClosed ? "" : "12px" }}
              />
              <Box sx={{ display: sidbarClosed ? "none" : "block" }}>
                <Typography
                  sx={{ fontSize: "18px", fontWeight: "bold", mb: "2px" }}
                >
                  {conv.name}
                </Typography>
                <Typography>{conv.lastmassege}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/** chat */}
      <Box
        sx={{
          display: "flex",
          minHeight: "calc(100vh - 56px)",
          flex: "1 1 0%",
          pt: "5rem",
          px: "2rem",
          overflowY: "auto",
          width: "100%",
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
              height: "calc(100% - 100px)",
              overflowY: "scroll",
              marginBottom: "1rem",
              flexDirection: "column-reverse",
            }}
          >
            {[...messages].reverse().map((message, index) => {
              const isCurrentUser = message.userId;
              // === currentUserId._id;
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
                    marginRight: isCurrentUser ? "13px" : "auto",
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
              display: "flex",
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
                placeholder="Write a massage"
                sx={{
                  width: "330px",
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
                // value={newMessage}
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
    </Box>
  );
};

export default ChatRoomPage;
