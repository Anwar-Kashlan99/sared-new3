import { EmojiEmotionsOutlined, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Input,
  Typography,
  useMediaQuery,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const CommentContainer = ({ willComment }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentReactions, setCommentReactions] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);

  const [showPickerComment, setShowPickerComment] = useState("");
  const [reply, setReply] = useState("");
  const [replyingTo, setReplyingTo] = useState("");
  const [showReplyPicker, setShowReplyPicker] = useState({});
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width: 1800px)");
  const { t } = useTranslation();

  // style

  const commentBoxStyle = {
    backgroundColor: "#fff",
    width: "fit-content",
    padding: "10px 15px",
    borderRadius: "20px",
    maxWidth: isMobile ? "250px" : "375px",
    wordWrap: "break-word",
    position: "relative",
    marginBottom: "2.3rem",
    "&:hover button": {
      opacity: "1",
    },
  };

  const reactionButtonStyle = {
    position: "absolute",
    right: "-40px",
    top: "50%",
    width: "36px",
    height: "36px",
    transform: "translateY(-50%)",
    transition: "all 0.3s ease-in-out",
    display: "flex",
    opacity: "0",
  };

  const reactionStyle = {
    position: "absolute",
    bottom: "-32px",
    fontSize: "21px",
    right: "-30px",
  };

  const replyTextStyle = {
    position: "absolute",
    bottom: "-25px",
    fontSize: "12px",
    left: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  ///

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
    setShowPicker(false);
  };

  const handleAddComment = () => {
    if (newComment) {
      const commentId = Date.now(); // Generate a unique comment ID
      const updatedComments = [
        ...comments,
        { id: commentId, comment: newComment, replies: [] },
      ];
      setComments(updatedComments);
      setNewComment("");
      setCommentReactions((prevReactions) => ({
        ...prevReactions,
        [commentId]: {},
      }));
    }
  };

  const handleAddReply = (commentId) => {
    const newReply = {
      id: Date.now(),
      username: "John Doe", // replace with the actual username
      avatar: "https://example.com/avatar.jpg", // replace with the actual avatar URL
      comment: reply,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = [
          ...(comment.replies || []),
          { ...newReply, reactions: {} },
        ];
        return {
          ...comment,
          replies: updatedReplies,
        };
      }
      return comment;
    });

    setComments(updatedComments);

    setReply("");
    setReplyingTo("");
  };

  const reversedComments = [...comments].reverse();

  const onEmojiClick = (event) => {
    const { emoji } = event;
    console.log(emoji);
    setNewComment((prevComment) => prevComment + emoji);
  };

  const handleReactionSelect = (commentId, emojiObject) => {
    setShowPickerComment(""); // Close the reaction picker
    // Check if the comment already has the same reaction
    if (commentReactions[commentId]?.emoji === emojiObject.emoji) {
      // Remove the reaction if it already exists
      const updatedReactions = { ...commentReactions };
      delete updatedReactions[commentId];
      setCommentReactions(updatedReactions);
    } else {
      // Add or update the reaction
      const updatedReactions = {
        ...commentReactions,
        [commentId]: emojiObject,
      };
      setCommentReactions(updatedReactions);
    }
  };

  const handleReplyReactionSelect = (commentId, replyId, emojiObject) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            if (
              reply.reactions &&
              reply.reactions[replyId]?.emoji === emojiObject.emoji
            ) {
              delete reply.reactions[replyId];
            } else {
              if (!reply.reactions) {
                reply.reactions = {};
              }
              reply.reactions[replyId] = emojiObject;
            }
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setComments(updatedComments);
    setShowReplyPicker((prev) => ({
      ...prev,
      [replyId]: false, // Close the reply picker
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {willComment && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            columnGap: "5px",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "30px",
            mt: "10px",
            mb: "30px",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Input
              type="text"
              placeholder="Write a comment"
              sx={{
                width: isMobile ? "100%" : "400px",
                padding: "10px 35px 10px 20px",
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
              value={newComment}
              onChange={handleCommentChange}
            />

            <EmojiEmotionsOutlined
              sx={{
                position: "absolute",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPicker((prev) => !prev)}
            />
          </Box>
          <IconButton
            onClick={handleAddComment}
            sx={{ width: "50px", height: "50px" }}
          >
            <Send sx={{ fontSize: "25px", color: "#f25f0c" }} />
          </IconButton>
          {showPicker && (
            <Box sx={{ position: "relative" }}>
              <EmojiPicker
                searchDisabled
                emojiStyle="facebook"
                style={{
                  position: "absolute",
                  bottom: "45px",
                  height: "250px",
                  width: "300px",
                  right: "0",
                }}
                previewConfig={{
                  showPreview: false,
                }}
                onEmojiClick={onEmojiClick}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: "17px",
                  width: "0",
                  height: "0",
                  right: "65px",
                  borderTop: "15px solid white",
                  borderBottom: "15px solid transparent",
                  borderRight: "15px solid transparent",
                  borderLeft: "15px solid transparent",
                }}
              />
            </Box>
          )}
        </Box>
      )}
      <Box
        sx={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {reversedComments.map((comment, index) => {
          if (index >= visibleComments) return null; // Exit loop early if index exceeds visible comment count
          return (
            <Fragment key={comment.id}>
              <Box
                sx={{
                  ...commentBoxStyle,
                  marginLeft: comment.replies ? "55px" : "0", // Adjust marginLeft for replies
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {comment.username}
                </Typography>
                <Avatar
                  sx={{
                    position: "absolute",
                    left: "-50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  src={comment.avatar}
                  alt="User Avatar"
                />
                {comment.comment}
                <IconButton
                  sx={{
                    ...reactionButtonStyle,
                  }}
                  onClick={() => setShowPickerComment(comment.id)}
                >
                  <EmojiEmotionsOutlined sx={{ color: "#f25f0c" }} />
                </IconButton>
                {showPickerComment === comment.id && (
                  <EmojiPicker
                    searchDisabled
                    emojiStyle="facebook"
                    className="emoji-picker"
                    style={{
                      position: "absolute",
                      top: "-55px",
                      left: isBigScreen ? "0px" : "-50px",
                      zIndex: "9999",
                    }}
                    previewConfig={{ showPreview: false }}
                    reactionsDefaultOpen
                    onEmojiClick={(emojiObject) =>
                      handleReactionSelect(comment.id, emojiObject)
                    }
                  />
                )}
                {comment.id in commentReactions && (
                  <span style={reactionStyle}>
                    {commentReactions[comment.id].emoji}
                  </span>
                )}
                <Typography
                  sx={{
                    ...replyTextStyle,
                  }}
                  onClick={() => setReplyingTo(comment.id)}
                >
                  {t("Reply")}
                </Typography>
              </Box>

              {comment.replies && (
                <Fragment>
                  {comment.replies.slice(-1).map(
                    (
                      reply // Selecting the last reply
                    ) => (
                      <Box
                        key={reply.id}
                        sx={{
                          ...commentBoxStyle,
                          marginLeft: "100px",
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {reply.username}
                        </Typography>
                        <Avatar
                          sx={{
                            position: "absolute",
                            left: "-50px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                          src={reply.avatar}
                          alt="User Avatar"
                        />
                        {reply.comment}
                        <IconButton
                          sx={{
                            ...reactionButtonStyle,
                          }}
                          onClick={() =>
                            setShowReplyPicker((prev) => ({
                              ...prev,
                              [reply.id]: !prev[reply.id],
                            }))
                          }
                        >
                          <EmojiEmotionsOutlined sx={{ color: "#f25f0c" }} />
                        </IconButton>
                        {showReplyPicker[reply.id] && (
                          <EmojiPicker
                            searchDisabled
                            emojiStyle="facebook"
                            className="emoji-picker"
                            style={{
                              position: "absolute",
                              top: "-55px",
                              left: isBigScreen ? "0px" : "-50px",
                              zIndex: "9999",
                            }}
                            previewConfig={{ showPreview: false }}
                            reactionsDefaultOpen
                            onEmojiClick={(emojiObject) =>
                              handleReplyReactionSelect(
                                comment.id,
                                reply.id,
                                emojiObject
                              )
                            }
                          />
                        )}
                        {reply.reactions &&
                          Object.keys(reply.reactions).map((reactionId) => (
                            <span
                              key={reactionId}
                              style={{
                                ...reactionStyle,
                              }}
                            >
                              {reply.reactions[reactionId].emoji}
                            </span>
                          ))}
                        {reply.id in commentReactions && (
                          <span
                            style={{
                              ...reactionStyle,
                            }}
                          >
                            {commentReactions[reply.id].emoji}
                          </span>
                        )}
                      </Box>
                    )
                  )}

                  {comment.replies.length > 1 && (
                    <Typography
                      sx={{
                        color: "#f25f0c",
                        cursor: "pointer",
                        mb: "15px",
                        mt: "-15px",
                        ml: "75px",
                      }}
                      onClick={() =>
                        setComments((prevComments) =>
                          prevComments.map((prevComment) =>
                            prevComment.id === comment.id
                              ? {
                                  ...prevComment,
                                  showMoreReplies: !prevComment.showMoreReplies,
                                }
                              : prevComment
                          )
                        )
                      }
                    >
                      {comment.showMoreReplies ? "" : t("Show more...")}
                    </Typography>
                  )}

                  {comment.showMoreReplies &&
                    comment.replies.slice(0, -1).map(
                      (
                        reply // Selecting all replies except the last one
                      ) => (
                        <Box
                          key={reply.id}
                          sx={{
                            ...commentBoxStyle,
                            marginLeft: "100px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {reply.username}
                          </Typography>
                          <Avatar
                            sx={{
                              position: "absolute",
                              left: "-50px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                            src={reply.avatar}
                            alt="User Avatar"
                          />
                          {reply.comment}
                          <IconButton
                            sx={{
                              ...reactionButtonStyle,
                            }}
                            onClick={() =>
                              setShowReplyPicker((prev) => ({
                                ...prev,
                                [reply.id]: !prev[reply.id],
                              }))
                            }
                          >
                            <EmojiEmotionsOutlined sx={{ color: "#f25f0c" }} />
                          </IconButton>
                          {showReplyPicker[reply.id] && (
                            <EmojiPicker
                              searchDisabled
                              emojiStyle="facebook"
                              className="emoji-picker"
                              style={{
                                position: "absolute",
                                top: "-55px",
                                left: isBigScreen ? "0px" : "-50px",
                                zIndex: "9999",
                              }}
                              previewConfig={{ showPreview: false }}
                              reactionsDefaultOpen
                              onEmojiClick={(emojiObject) =>
                                handleReplyReactionSelect(
                                  comment.id,
                                  reply.id,
                                  emojiObject
                                )
                              }
                            />
                          )}
                          {reply.reactions &&
                            Object.keys(reply.reactions).map((reactionId) => (
                              <span
                                key={reactionId}
                                style={{
                                  ...reactionStyle,
                                }}
                              >
                                {reply.reactions[reactionId].emoji}
                              </span>
                            ))}
                          {reply.id in commentReactions && (
                            <span
                              style={{
                                ...reactionStyle,
                              }}
                            >
                              {commentReactions[reply.id].emoji}
                            </span>
                          )}
                        </Box>
                      )
                    )}
                </Fragment>
              )}

              {replyingTo === comment.id && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                    width: "fit-content",
                    columnGap: "5px",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: "30px",
                    mt: "10px",
                    mb: "30px",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Input
                      type="text"
                      placeholder="Write a comment"
                      sx={{
                        width: isMobile ? "100%" : "400px",
                        padding: "10px 35px 10px 20px",
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
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />

                    <EmojiEmotionsOutlined
                      sx={{
                        position: "absolute",
                        right: "5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setShowReplyPicker((prev) => ({
                          ...prev,
                          [comment.id]: !prev[comment.id],
                        }))
                      }
                    />
                  </Box>
                  <IconButton
                    onClick={() => handleAddReply(comment.id)}
                    sx={{ width: "50px", height: "50px" }}
                  >
                    <Send sx={{ fontSize: "25px", color: "#f25f0c" }} />
                  </IconButton>
                  {showReplyPicker[comment.id] && (
                    <Box sx={{ position: "relative" }}>
                      <EmojiPicker
                        searchDisabled
                        emojiStyle="facebook"
                        style={{
                          position: "absolute",
                          bottom: "45px",
                          height: "250px",
                          width: "300px",
                          right: "0",
                        }}
                        previewConfig={{
                          showPreview: false,
                        }}
                        onEmojiClick={(emojiObject) =>
                          setReply((prev) => prev + emojiObject.emoji)
                        }
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "17px",
                          width: "0",
                          height: "0",
                          right: "65px",
                          borderTop: "15px solid white",
                          borderBottom: "15px solid transparent",
                          borderRight: "15px solid transparent",
                          borderLeft: "15px solid transparent",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Fragment>
          );
        })}
      </Box>
      {visibleComments < reversedComments.length && (
        <Typography
          sx={{ color: "#f25f0c", cursor: "pointer" }}
          onClick={() => setVisibleComments(visibleComments + 4)}
        >
          {t("Show more")}...
        </Typography>
      )}
    </Box>
  );
};

export default CommentContainer;
