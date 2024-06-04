import {
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

import {
  ArrowBackIosNewOutlined,
  BackHand,
  LogoutOutlined,
  MicOffOutlined,
  MicOutlined,
  MoreVert,
} from "@mui/icons-material";
import ChatRoom from "../../components/ChatRoom";
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
    approveSpeakRequest,
    rejectSpeakRequest,
  } = useWebRTC(roomId, userDetails);
  const [isAdmin, setIsAdmin] = useState(false);
  const currentUser = clients.find((client) => client._id === userDetails._id);

  const [isAudience, setIsAudience] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      setIsAdmin(true);
    }
  }, [clients, userDetails]);

  useEffect(() => {
    if (currentUser && currentUser.role === "audience") {
      setIsAudience(true);
    }
  }, [clients, userDetails]);

  const admins = clients.filter((client) => client.role === "admin");
  const audience = clients.filter((client) => client.role === "audience");
  const speaker = clients.filter((client) => client.role === "speaker");
  const [isMuted, setMuted] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentReactions, setCommentReactions] = useState({});
  console.log(clients);

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

  // rais hand sittings

  const [raiseHandDialogOpen, setRaiseHandDialogOpen] = useState(false);

  const handleRaiseHandDialogOpen = () => {
    setRaiseHandDialogOpen(true);
  };
  const handleRaiseHandDialogClose = () => {
    setRaiseHandDialogOpen(false);
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

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : "90%",
          padding: "1rem 0.5rem",
          m: isMobile ? "0rem auto" : "5.5rem auto 2rem",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: isBigSecreen ? "800px" : "700px",
            borderRadius: "50px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "2px 4px 7px #707070",
            p: "2rem 2.5rem",
          }}
        >
          {/**
        <ChatRoom
            comments={comments}
            setComments={setComments}
            newComment={newComment}
            setNewComment={setNewComment}
            commentReactions={commentReactions}
            setCommentReactions={setCommentReactions}
            reverse={true}
          />
    */}
          {!isMobile && (
            <Box
              sx={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                height: "40px",
                zIndex: "99",
                backdropFilter: "blur(13px)",
                backgroundImage: "linear-gradient(to top, transparent, #fff)",
              }}
            />
          )}

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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "10px",
              }}
            >
              {/** RaiseHand btn */}

              {isAdmin && (
                <Button
                  variant="outlined"
                  sx={{
                    background: "#f25f0c",
                    outline: "none",
                    display: "flex",
                    alignItems: "center",
                    padding: "0.7rem 1rem",
                    borderRadius: "20px",
                    color: "#fff",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      background: "#fff",
                      color: "#f25f0c",
                    },
                  }}
                  onClick={handleRaiseHandDialogOpen}
                >
                  <BackHand sx={{ fontSize: "24px" }} />
                  <Typography
                    sx={{ fontWeight: "bold", ml: "10px", fontSize: "13px" }}
                  >
                    {t("Requests")}
                  </Typography>
                </Button>
              )}

              {isAudience && (
                <Button
                  variant="outlined"
                  sx={{
                    background: "#f25f0c",
                    outline: "none",
                    marginLeft: "2rem",
                    display: "flex",
                    alignItems: "center",
                    padding: "0.7rem ",
                    borderRadius: "20px",
                    color: "#fff",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      background: "#fff",
                      color: "#f25f0c",
                    },
                  }}
                  onClick={raiseHand}
                >
                  <BackHand sx={{ fontSize: "24px" }} />
                </Button>
              )}

              <Button
                variant="outlined"
                sx={{
                  background: "#f25f0c",
                  outline: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.7rem 0rem",
                  borderRadius: "20px",
                  color: "#fff",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    background: "#fff",
                    color: "#f25f0c",
                  },
                }}
                onClick={handManualLeave}
              >
                <LogoutOutlined sx={{ fontSize: "22px" }} />
              </Button>

              <IconButton
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreVert sx={{ color: "#f25f0c", cursor: "pointer" }} />
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
                sx={{ ml: "-8px", mt: "5px" }}
              >
                <MenuItem onClick={handleShareDialogOpen}>Invite</MenuItem>
                {isAdmin && (
                  <MenuItem sx={{ color: "red" }} onClick={handleEndRoom}>
                    EndRoom
                  </MenuItem>
                )}
              </Menu>
            </Box>
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
              maxHeight: "130px", // Set the maximum height for scrollable content
              overflowY: "auto", // Enable vertical scrolling
              scrollbarWidth: "none", // Hide the default scrollbar on webkit browsers
              "&::-webkit-scrollbar": {
                display: "none", // Hide the scrollbar on webkit browsers
              },
            }}
          >
            {/** here the andmin and speker */}
            {admins.map((client) => (
              <Box
                sx={{
                  display: "flex",
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
                    border: "3px solid #ffc500",
                    position: " relative",
                  }}
                >
                  <img
                    src={client.avatar}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />

                  <audio
                    autoPlay
                    ref={(instance) => {
                      provideRef(instance, client?._id);
                    }}
                  />
                  <IconButton
                    onClick={() => handleMuteClick(client?._id)}
                    sx={{
                      backgroundColor: "#fff",
                      position: "absolute",
                      bottom: "0px",
                      right: "0px",
                      width: "30px",
                      height: "30px",
                      padding: "5px",
                      zIndex: "1111",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {client.muted ? <MicOffOutlined /> : <MicOutlined />}
                  </IconButton>
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

            {speaker.map((client) => (
              <Box
                sx={{
                  display: "flex",
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
                    border: "3px solid #c0c0c0",
                    position: " relative",
                  }}
                >
                  <img
                    src={client.avatar}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                  <audio
                    autoPlay
                    ref={(instance) => {
                      provideRef(instance, client?._id);
                    }}
                  />
                  <IconButton
                    onClick={() => handleMuteClick(client?._id)}
                    sx={{
                      backgroundColor: "#fff",
                      position: "absolute",
                      bottom: "0px",
                      right: "0px",
                      width: "30px",
                      height: "30px",
                      padding: "5px",
                      zIndex: "1111",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {client.muted ? <MicOffOutlined /> : <MicOutlined />}
                  </IconButton>
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
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : undefined,
              gap: "30px",
              maxHeight: "500px", // Set the maximum height for scrollable content
              overflowY: "auto", // Enable vertical scrolling
              scrollbarWidth: "none", // Hide the default scrollbar on webkit browsers
              "&::-webkit-scrollbar": {
                display: "none", // Hide the scrollbar on webkit browsers
              },
            }}
          >
            {/** here the audience */}

            {audience.map((client) => (
              <Box
                sx={{
                  display: "flex",
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
                    position: " relative",
                  }}
                >
                  <img
                    src={client.avatar}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
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
            {handRaiseRequests.map(({ peerId, userId }) => (
              <ListItem key={peerId}>
                <ListItemText primary={`User ID: ${userId}`} />
                <Button
                  onClick={() => approveSpeakRequest(peerId, userId)}
                  color="primary"
                >
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
