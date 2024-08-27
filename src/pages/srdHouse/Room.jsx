import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useNavigate, useParams } from "react-router-dom";
import hand from "../../assets/hand.svg";

import {
  LogoutOutlined,
  MicOffOutlined,
  MicOutlined,
  MoreVert,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useGetAllRoomsQuery, useGetRoomQuery } from "../../store/srdClubSlice";
import { useSelector } from "react-redux";
import { ContentCopyOutlined } from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import upArrow from "../../assets/up-arrow.svg";
import downArrow from "../../assets/down-arrow.svg";
import ChatRoom from "../../components/ChatRoom";
import commentIcon from "../../assets/commentimg.png";

const Room = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigSecreen = useMediaQuery("(min-width: 1800px)");

  const userDetails = useSelector((state) => state.user.userDetails);

  const {
    data: room,
    isError: roomError,
    isLoading: roomLoading,
  } = useGetRoomQuery(roomId);
  const { refetch } = useGetAllRoomsQuery({
    key: "value",
  });

  const {
    clients,
    provideRef,
    handleMute,
    endRoom,
    blockUser,
    raiseHand,
    handRaiseRequests,
    rejectSpeakRequest,
    messages,
    sendMessage,
    returnAudienceSpeak,
    handleApproveSpeak,
  } = useWebRTC(roomId, userDetails);

  const currentUser = clients.find((client) => client._id === userDetails._id);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAudience, setIsAudience] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isCurtainClose, setIsCurtainClose] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      setIsAdmin(true);
    }
  }, [clients, userDetails]);

  useEffect(() => {
    if (currentUser && currentUser.role === "audience") {
      setIsAudience(true);
      setIsSpeaker(false);
    }
    if (currentUser && currentUser.role === "speaker") {
      setIsSpeaker(true);
      setIsAudience(false);
    }
  }, [clients, userDetails]);

  useEffect(() => {
    const handRaised = handRaiseRequests.some(
      (request) => request.userId === userDetails?._id
    );
    setIsHandRaised(handRaised);
  }, [handRaiseRequests, userDetails?._id]);

  const [isMuted, setMuted] = useState(true);

  // console.log(clients);

  useEffect(() => {
    handleMute(isMuted, userDetails?._id);
  }, [isMuted, handleMute, userDetails?._id]);

  const handManualLeave = () => {
    navigate("/srdhouse");
    refetch();
  };

  const handleEndRoom = async () => {
    handleClose();
    await endRoom();
    refetch();
  };

  const handleMuteClick = useCallback(
    (clientId) => {
      if (clientId !== userDetails?._id) {
        return;
      }
      setMuted((prev) => !prev);
    },
    [userDetails?._id]
  );

  // room sitting

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // audience sittings

  const [anchorElAud, setAnchorElAud] = useState(null);
  const openAud = Boolean(anchorElAud);
  const handleClickAud = (event, clientId) => {
    setAnchorElAud({ anchor: event.currentTarget, clientId });
  };
  const handleCloseAud = () => {
    setAnchorElAud(null);
  };

  // raise hand sittings

  const [raiseHandDialogOpen, setRaiseHandDialogOpen] = useState(false);

  const handleRaiseHandDialogOpen = () => {
    setRaiseHandDialogOpen(true);
  };
  const handleRaiseHandDialogClose = () => {
    setRaiseHandDialogOpen(false);
  };

  const onApproveClick = (userId) => {
    handleApproveSpeak({ roomId, userId });
  };

  // share sittings
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleShareDialogOpen = () => {
    handleClose();
    setShareDialogOpen(true);
  };
  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const urlToShare = window.location.href;

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
        toast.error("Failed to copy URL");
      });
  };

  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        minHeight: isMobile ? "" : "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : "90%",
          padding: isMobile ? "" : "1rem 0.5rem",
          m: isMobile ? "0rem auto" : "5.5rem auto 2rem",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: isBigSecreen ? "800px" : isMobile ? "850px" : "700px",
            borderRadius: isMobile ? "0" : "50px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "2px 4px 7px #707070",
            p: "2rem 2.5rem",
          }}
        >
          <ChatRoom
            reverse={true}
            messages={messages}
            sendMessage={sendMessage}
            currentUserId={currentUser}
            setIsCurtainClose={setIsCurtainClose}
            isCurtainClose={isCurtainClose}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : undefined,
            }}
          >
            {/** the topic of the room */}
            {room && (
              <Typography
                sx={{
                  color: "#707070",
                  fontSize: "18px",
                  fontWeight: "bold",
                  mb: isMobile ? "20px" : undefined,
                  textAlign: isMobile ? "center" : undefined,
                }}
              >
                {room.topic}
              </Typography>
            )}

            {/** */}
          </Box>
          <Box
            sx={{
              position: "relative",
              marginTop: "2rem",
              display: "flex",
              justifyContent: isMobile ? "center" : undefined,
              alignItems: "center",
              flexWrap: "wrap",
              gap: "30px",
              padding: "10px",
              maxHeight: "130px", // Set the maximum height for scrollable content
              overflowY: "auto", // Enable vertical scrolling
              scrollbarWidth: "none", // Hide the default scrollbar on webkit browsers
              "&::-webkit-scrollbar": {
                display: "none", // Hide the scrollbar on webkit browsers
              },
            }}
          >
            {/** here the andmin and speker */}
            {clients.map((client) => (
              <Box
                sx={{
                  display:
                    client.role === "admin" || client.role === "speaker"
                      ? "flex"
                      : "none",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  width: "130px",
                }}
                key={client?._id}
              >
                <Box
                  sx={{
                    width: "75px",
                    height: "75px",
                    borderRadius: "50%",
                    border:
                      client.role === "admin"
                        ? "3px solid #ffc500"
                        : "3px solid #c0c0c0",
                    position: " relative",
                    "&::before": {
                      borderColor: client.speaking ? "#eb7635" : "#eee",
                    },
                  }}
                  className={`speaking-avatar ${
                    client.speaking ? "speaking" : ""
                  }`}
                >
                  <Avatar
                    src={client.profile}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      backgroundColor: "#ddd",
                    }}
                  />

                  <audio
                    ref={(instance) => {
                      provideRef(instance, client?._id);
                    }}
                  />
                  {client.muted && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        width: "25px",
                        height: "25px",
                        zIndex: "99",
                        boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <MicOffOutlined sx={{ fontSize: "18px" }} />
                    </Box>
                  )}
                  {client.role === "speaker" && isAdmin && !isAudience && (
                    <IconButton
                      id="fade-button"
                      aria-controls={openAud ? "fade-menu-aud" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openAud ? "true" : undefined}
                      onClick={(event) => handleClickAud(event, client._id)}
                      sx={{
                        position: "absolute",
                        right: "-40px",
                        top: "-10px",
                      }}
                    >
                      <MoreVert sx={{ color: "#f25f0c", cursor: "pointer" }} />
                    </IconButton>
                  )}
                  <Menu
                    id="fade-menu-aud"
                    MenuListProps={{
                      "aria-labelledby": "fade-button",
                    }}
                    anchorEl={anchorElAud?.anchor || null}
                    open={openAud}
                    onClose={handleCloseAud}
                    TransitionComponent={Fade}
                    sx={{ ml: "-8px", mt: "5px" }}
                  >
                    {isAdmin && anchorElAud && (
                      <>
                        {/* Admin can block user */}
                        <MenuItem
                          sx={{ color: "red" }}
                          onClick={() => {
                            blockUser(anchorElAud.clientId);
                            handleCloseAud();
                          }}
                        >
                          Block the user
                        </MenuItem>

                        {/* Admin can return user to audience */}
                        <MenuItem
                          onClick={() => {
                            returnAudienceSpeak(anchorElAud.clientId);
                            handleCloseAud();
                          }}
                        >
                          Return to audience
                        </MenuItem>
                      </>
                    )}

                    {/* Speaker can only return user to audience */}
                    {isSpeaker &&
                      !isAdmin &&
                      client.role === "speaker" &&
                      anchorElAud && (
                        <MenuItem
                          onClick={() => {
                            returnAudienceSpeak(anchorElAud.clientId);
                            handleCloseAud();
                          }}
                        >
                          Return to audience
                        </MenuItem>
                      )}
                  </Menu>
                </Box>
                <Typography
                  sx={{
                    marginTop: "0.5rem",
                    fontSize: "15px",
                    color: "#000",
                  }}
                >
                  {client.username}
                </Typography>
              </Box>
            ))}
          </Box>
          <hr style={{ marginTop: "25px", marginBottom: "25px" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-start",
                gap: "30px",
                padding: "10px",
                maxHeight: isBigSecreen
                  ? "calc(100vh - 400px)"
                  : isMobile
                  ? "calc(100vh - 200px)"
                  : "calc(100vh - 280px)", // Adjust based on the second box height
                overflowY: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {clients.map((client) => (
                <Box
                  sx={{
                    display: client.role === "audience" ? "flex" : "none",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "130px",
                  }}
                  key={client?._id}
                >
                  <Box
                    sx={{
                      width: "75px",
                      height: "75px",
                      borderRadius: "50%",
                      border: "3px solid #f25f0c",
                      position: "relative",
                    }}
                  >
                    <Avatar
                      src={client.profile}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#ddd",
                      }}
                    />
                    <audio
                      ref={(instance) => {
                        provideRef(instance, client?._id);
                      }}
                    />
                    {client.muted && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                          position: "absolute",
                          bottom: "-2px",
                          right: "-2px",
                          width: "25px",
                          height: "25px",
                          zIndex: "99",
                          boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <MicOffOutlined sx={{ fontSize: "18px" }} />
                      </Box>
                    )}

                    {isAdmin && (
                      <IconButton
                        id="fade-button"
                        aria-controls={openAud ? "fade-menu-aud" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openAud ? "true" : undefined}
                        onClick={(event) => handleClickAud(event, client._id)}
                        sx={{
                          position: "absolute",
                          right: "-40px",
                          top: "-10px",
                        }}
                      >
                        <MoreVert
                          sx={{ color: "#f25f0c", cursor: "pointer" }}
                        />
                      </IconButton>
                    )}
                    {isAdmin && (
                      <Menu
                        id="fade-menu-aud"
                        MenuListProps={{
                          "aria-labelledby": "fade-button",
                        }}
                        anchorEl={anchorElAud?.anchor || null}
                        open={openAud}
                        onClose={handleCloseAud}
                        TransitionComponent={Fade}
                        sx={{ ml: "-8px", mt: "5px" }}
                      >
                        {anchorElAud && (
                          <MenuItem
                            sx={{ color: "red" }}
                            onClick={() => {
                              blockUser(anchorElAud.clientId);
                              handleCloseAud();
                            }}
                          >
                            Block the user
                          </MenuItem>
                        )}
                      </Menu>
                    )}
                    <audio
                      autoPlay
                      ref={(instance) => {
                        provideRef(instance, client?._id);
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      marginTop: "0.5rem",
                      fontSize: "15px",
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    {client.username}
                  </Typography>
                </Box>
              ))}
            </Box>
            <>
              <Box
                sx={{
                  width: isMobile ? "100%" : "60%",
                  borderRadius: isOpen ? "40px 40px 0 0" : "40px",
                  boxShadow: isOpen ? "2px 3px 10px 3px #707070" : "",
                  position: "absolute",
                  backgroundColor: "#fff",
                  bottom: 0,
                  left: "50%",
                  padding: !isOpen
                    ? ""
                    : isMobile
                    ? "1rem 1rem 0.8rem"
                    : "0.8rem 4rem 0.4rem",
                  transform: "translateX(-50%)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "height 0.1s ease-in-out",
                  height: isOpen ? "auto" : "0",
                }}
              >
                <IconButton
                  onClick={toggleAccordion}
                  sx={{
                    padding: "15px",
                    cursor: "pointer",
                    position: "absolute",
                    top: isOpen ? "-30px" : "-60px",
                    right: "5px",
                  }}
                >
                  <img
                    alt="arrow"
                    src={isOpen ? downArrow : upArrow}
                    style={{ width: "30px" }}
                  />
                </IconButton>

                {isOpen && (
                  <>
                    <IconButton
                      onClick={handManualLeave}
                      sx={{ backgroundColor: "#f5f5f5", padding: "0.7rem" }}
                    >
                      <LogoutOutlined
                        sx={{ fontSize: "24px", color: "#f25f0c" }}
                      />
                    </IconButton>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "5px",
                      }}
                    >
                      <IconButton
                        onClick={() => setIsCurtainClose((priv) => !priv)}
                      >
                        <img
                          alt="commentIcon"
                          src={commentIcon}
                          style={{
                            width: "28px",
                            height: "28px",
                            objectFit: "cover",
                          }}
                        />
                      </IconButton>

                      {(isAdmin || isSpeaker) && (
                        <IconButton
                          onClick={() => handleMuteClick(currentUser?._id)}
                        >
                          <MicOutlined sx={{ fontSize: "28px" }} />
                        </IconButton>
                      )}
                      {isAdmin && (
                        <Button
                          variant="outlined"
                          sx={{
                            background: "#f5f5f5",
                            outline: "none",
                            display: "flex",
                            alignItems: "center",
                            padding: "0.5rem 0.8rem",
                            border: "none",
                            borderRadius: "20px",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              border: "none",
                            },
                          }}
                          onClick={handleRaiseHandDialogOpen}
                        >
                          <img
                            alt="hand"
                            src={hand}
                            style={{ width: "28px" }}
                          />
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              ml: "7px",
                              fontSize: "12px",
                            }}
                          >
                            {t("Requests")}
                          </Typography>
                        </Button>
                      )}

                      {isAudience && !isAdmin && (
                        <Button
                          variant="outlined"
                          sx={{
                            background: isHandRaised ? "#eb7635" : "#f5f5f5",
                            outline: "none",
                            display: "flex",
                            minWidth: "20px",
                            alignItems: "center",
                            padding: "0.5rem 0.7rem",
                            border: "none",
                            borderRadius: "20px",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              border: "none",
                            },
                            "&.Mui-disabled": {
                              border: "none",
                            },
                          }}
                          disabled={isHandRaised}
                          onClick={raiseHand}
                        >
                          <img
                            alt="hand"
                            src={hand}
                            style={{ width: "28px" }}
                          />
                        </Button>
                      )}

                      <IconButton
                        id="fade-button"
                        aria-controls={open ? "fade-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <MoreVert
                          sx={{ color: "#f25f0c", cursor: "pointer" }}
                        />
                      </IconButton>

                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          "aria-labelledby": "fade-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        sx={{ mt: "-8px" }}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem onClick={handleShareDialogOpen}>
                          Invite
                        </MenuItem>
                        {isAdmin && (
                          <MenuItem
                            sx={{ color: "red" }}
                            onClick={handleEndRoom}
                          >
                            End Room
                          </MenuItem>
                        )}
                      </Menu>
                    </Box>
                  </>
                )}
              </Box>
            </>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={raiseHandDialogOpen}
        onClose={handleRaiseHandDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Raise Hand Requests"}
        </DialogTitle>
        <DialogContent>
          <List>
            {handRaiseRequests.map(({ peerId, userId, username, profile }) => (
              <ListItem key={peerId}>
                <Avatar
                  src={profile}
                  alt={username}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <ListItemText primary={`User: ${username}`} />
                <Button onClick={() => onApproveClick(userId)} color="primary">
                  Approve
                </Button>
                <Button
                  onClick={() => rejectSpeakRequest(peerId, userId)}
                  color="secondary"
                >
                  Reject
                </Button>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRaiseHandDialogClose}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={shareDialogOpen}
        onClose={handleShareDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              columnGap: "15px",
              alignItems: "center",
              padding: "5px 8px",
              borderRadius: "30px",
            }}
          >
            <div className="Demo__some-network">
              <FacebookShareButton
                url={urlToShare}
                quote={"Visit us through this link"}
                hashtag="#muo"
                style={{ display: "flex" }}
                title="join to our room through this link"
              >
                <FacebookIcon size={45} round />
              </FacebookShareButton>

              <div>
                <FacebookShareCount url={urlToShare}>
                  {(count) => count}
                </FacebookShareCount>
              </div>
            </div>

            <div className="Demo__some-network">
              <TwitterShareButton
                url={urlToShare}
                quote={"Visit us through this link"}
                hashtag="#muo"
                style={{ display: "flex" }}
                title="join to our room through this link"
                className="Demo__some-network__share-button"
              >
                <XIcon size={45} round />
              </TwitterShareButton>
            </div>

            <div className="Demo__some-network">
              <TelegramShareButton
                url={urlToShare}
                quote={"Visit us through this link"}
                hashtag="#muo"
                style={{ display: "flex" }}
                title="join to our room through this link"
                className="Demo__some-network__share-button"
              >
                <TelegramIcon size={45} round />
              </TelegramShareButton>
            </div>

            <div className="Demo__some-network">
              <WhatsappShareButton
                url={urlToShare}
                quote={"Visit us through this link"}
                hashtag="#muo"
                style={{ display: "flex" }}
                title="join to our room through this link"
                separator=":: "
                className="Demo__some-network__share-button"
              >
                <WhatsappIcon size={45} round />
              </WhatsappShareButton>
            </div>

            <ContentCopyOutlined
              sx={{ cursor: "pointer", color: "#000", fontSize: "40px" }}
              onClick={copyURL}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Room;
