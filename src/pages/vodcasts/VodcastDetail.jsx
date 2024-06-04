import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import video1 from "../../assets/data/pdcast&vodcast/what if/تجارب/ماذا لو أجريت مسحًا ضوئيًا لمرآة.mp4";
import video2 from "../../assets/data/pdcast&vodcast/what if/تجارب/ماذا لو بنينا ناطحة سحاب بمليار طابق.mp4";
import video3 from "../../assets/data/pdcast&vodcast/what if/تجارب/ماذا لو تحولت الصحراء الكبرى إلى بحار.mp4";
import video4 from "../../assets/data/pdcast&vodcast/what if/تجارب/ماذا لو سقطت  داخل إعصار.mp4";
import video5 from "../../assets/data/pdcast&vodcast/what if/تجارب/ماذا لو قمنا بتفجير قنبلة نووية داخل اعصار.mp4";
import video6 from "../../assets/data/pdcast&vodcast/what if/تجارب/ماذا لو كنت ترى بالأشعة فوق البنفسجية ... مذهل.mp4";
import video7 from "../../assets/data/pdcast&vodcast/what if/تجارب/ماذا لو نزفت بالقرب من سمك قرش.mp4";
import avatar from "../../assets/data/pdcast&vodcast/what if/unnamed.jpg";

import {
  Bookmark,
  BookmarkBorder,
  Chat,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Share,
} from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { SharePopup } from "../../components/SharePopup";
import CommentContainer from "../../components/CommentContainer";
import { useTranslation } from "react-i18next";
const videos = [
  {
    id: 1,
    title: "ماذا لو أجريت مسحًا ضوئيًا لمرآة ",
    date: "30 day ago",
    likes: "200K",
    url: video1,
    information:
      "هل سمعتم يومًا أسئلةً بدت على جانبٍ من الغرابة بالنسبة لكم؟ من قبيل ماذا لو أجريت مسحًا ضوئيًا لمرآة ؟ أو ما الذي سيحدث إن متّ في الفضاء؟ أو ماذا لو لم ينقرض الميجالودون ، لكن ورغم ذلك، إن العثور على إجابات لتلك الأسئلة أمر سهل. واليوم سنجيب على أكثر الأسئلة إثارة وخروجًا عن المألوف.... فلننطلق",
    comments: ["Comment 1", "Comment 2", "Comment 3"],
  },
  {
    id: 2,
    title: "ماذا لو بنينا ناطحة سحاب بمليار طابق",
    date: "20 day ago",
    likes: "50K",
    url: video2,
    information:
      "تخيل بناءً تُفتح شبابيكه في الفضاء، حيث سيبدو القمر أقرب من مركز التسوق المجاور لهذا البناء. وربما يمكننا المضي أبعد بقليل..... تخيل ناطحة سحاب بمليار طابق. كيف للمرء أن يترجم مثل هذه الفكرة المجنونة على أرض الواقع العملي؟",
    comments: ["Comment 4", "Comment 5", "Comment 6"],
  },
  {
    id: 3,
    title: "ماذا لو تحولت الصحراء الكبرى إلى بحار",
    date: "10 day ago",
    likes: "90K",
    url: video3,
    information: "ماذا لو تحولت الصحراء الكبرى إلى بحار !!",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
  {
    id: 4,
    title: "ماذا لو سقطت داخل إعصار",
    date: "25 day ago",
    likes: "200K",
    url: video4,
    information:
      "عادة حين يضرب الإعصار تبحث عن مخبأ لتحتمي فيه أو ستحاول الهرب منه، لكن لدينا خيارٌ مختلفٌ في هذا الفيديو ،، سنقفز داخل الإعصار من الأعلى.ما الذي ستراه داخل إعصار؟",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
  {
    id: 5,
    title: "ماذا لو قمنا بتفجير قنبلة نووية داخل اعصار",
    date: "23 day ag",
    likes: "600K",
    url: video5,
    information:
      "هناك الكثير من النظريات التي تم اقتراحها عبر التاريخ عن طرق تدمير الإعصار قبل أن يصل فعليًا إلى اليابسة ويسبب أي ضرر ، ربما أكثر فكرة غريبة كانت هي إطلاق الأسلحة النووية تجاه الإعصار! هل فعلا سيؤدي ذلك الى ايقافها...تابعونا",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
  {
    id: 6,
    title: "ماذا لو كنت ترى بالأشعة فوق البنفسجية ",
    date: "3 day ago",
    likes: "200",
    url: video6,
    information: "ماذا لو كنت ترى بالأشعة فوق البنفسجية مذهل !!",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
  {
    id: 7,
    title: "ماذا لو نزفت بالقرب من سمك قرش",
    date: "28 day ago",
    likes: "200K",
    url: video7,
    information: "ماذا لو نزفت بالقرب من سمك قرش !!",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
];

const VodcastDetail = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleVideos, setVisibleVideos] = useState(6);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallSecreen = useMediaQuery("(max-width: 476px)");
  const isBigSecreen = useMediaQuery("(min-width: 1540px)");
  const { t } = useTranslation();

  useEffect(() => {
    if (!selectedVideo && videos.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [selectedVideo, videos]);

  const handleVideoClick = (video, index) => {
    setSelectedVideoIndex(index);
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // handle comments
  const [willComment, setWillComment] = useState(false);

  const commentPodcast = () => {
    setWillComment((prev) => !prev);
  };

  // Save vodcast

  const [isSaved, setIsSaved] = useState(false);

  const saveVodcast = () => {
    setIsSaved((prev) => !prev);
  };

  // Handle Like

  const [isLiked, setIsLiked] = useState(false);

  const likedVodcast = () => {
    setIsLiked((prev) => !prev);
  };

  // for Sharing
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleShareClick = () => {
    setShowSharePopup(!showSharePopup);
  };

  // for info show more and less
  const [showMore, setShowMore] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    // Check for text overflow after component renders
    if (textRef.current) {
      const textElement = textRef.current;
      const hasOverflow = textElement.scrollHeight > textElement.clientHeight;
      setShowMore(hasOverflow);
    }
  }, []);

  if (!selectedVideo || !selectedVideo.information) {
    return null; // or display a fallback UI if necessary
  }

  const truncatedText =
    selectedVideo.information.length > 215
      ? selectedVideo.information.slice(0, 215) + "..."
      : selectedVideo.information;

  const showButtons = selectedVideo.information.length > 215;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          width: "90%",
          m: isMobile ? "5rem auto 3rem" : "4.5rem auto 2rem",
        }}
      >
        <Grid item xs={12} xl={8.5}>
          <Box>
            {selectedVideo && (
              <video
                width="100%"
                height="100%"
                src={selectedVideo.url}
                title={selectedVideo.title}
                controls
                controlsList="nodownload"
                style={{
                  borderRadius: "30px",
                }}
              />
            )}
          </Box>
          {selectedVideo && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: "20px" }}>
                {selectedVideo.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: "10px",
                  justifyContent: "space-between",
                  flexDirection: isMobile ? "column" : undefined,
                  mb: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "20px",
                    mt: isMobile ? "8px" : undefined,
                    mb: isMobile ? "15px" : undefined,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "15px",
                    }}
                  >
                    <Avatar src={avatar} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <Typography>ماذا لو</Typography>
                      <Typography>400M followers</Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" sx={{ padding: "3px 10px" }}>
                    {t("follow")}
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <IconButton onClick={commentPodcast}>
                      <Chat
                        sx={{
                          fontSize: "35px",
                          color: "#f25f0c",
                        }}
                      />
                    </IconButton>

                    <IconButton onClick={handleShareClick}>
                      <Share
                        sx={{
                          fontSize: "35px",
                          color: "#f25f0c",
                        }}
                      />
                    </IconButton>

                    {showSharePopup && (
                      <SharePopup title={""} left={"-120px"} />
                    )}
                  </Box>
                  <IconButton onClick={saveVodcast}>
                    {isSaved ? (
                      <Bookmark
                        sx={{
                          fontSize: "40px",
                          color: "#f25f0c",
                        }}
                      />
                    ) : (
                      <BookmarkBorder
                        sx={{
                          fontSize: "40px",
                          color: "#f25f0c",
                        }}
                      />
                    )}
                  </IconButton>

                  <IconButton onClick={likedVodcast}>
                    {isLiked ? (
                      <FavoriteOutlined
                        sx={{ fontSize: "40px", color: "#F74B4B" }}
                      />
                    ) : (
                      <FavoriteBorderOutlined
                        sx={{ fontSize: "40px", color: "#F74B4B" }}
                      />
                    )}
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  background: "#0000001f",
                  borderRadius: "20px",
                  padding: "1rem 1.5rem",
                  overflow: "hidden",
                  textOverflow: showMore ? "unset" : "ellipsis",
                  WebkitLineClamp: showMore ? "unset" : "2",
                  WebkitBoxOrient: "vertical",
                  mb: "25px",
                }}
                ref={textRef}
              >
                <Typography variant="body1">
                  {showMore ? selectedVideo.information : truncatedText}
                  {showButtons && (
                    <span
                      onClick={() => setShowMore((prev) => !prev)}
                      style={{
                        color: "#f25f0c",
                        cursor: "pointer",
                        display: "inline-block",
                        marginLeft: "5px",
                        mt: "3px",
                        fontSize: "16px",
                      }}
                    >
                      {showMore ? "Show less" : "more"}
                    </span>
                  )}
                </Typography>
              </Box>

              <CommentContainer willComment={willComment} />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} xl={3.5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              rowGap: "0.5rem",
              minHeight: "900px",
              "&::-webkit-scrollbar": {
                width: "0",
              },
            }}
          >
            {videos.slice(0, visibleVideos).map((video, index) => (
              <Box
                key={video.id}
                onClick={() => handleVideoClick(video, index)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  padding: "15px 20px",
                  borderRadius: "20px",
                  columnGap: "20px",
                  backgroundColor:
                    selectedVideoIndex === index ? "#eee" : undefined,
                  mb: isSmallSecreen ? "15px" : undefined,
                }}
              >
                <Box
                  sx={{
                    borderRadius: "20px",
                    flex: isBigSecreen ? "1 1 54%" : "1 1 30%",
                    mb: isSmallSecreen ? "15px" : undefined,
                  }}
                >
                  <video
                    src={video.url}
                    title={video.title}
                    controlsList="nodownload"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: isBigSecreen ? "1 1 40%" : "1 1 65%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: isSmallSecreen ? "center" : undefined,
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: isSmallSecreen ? "center" : undefined,
                      mb: isSmallSecreen ? "8px" : undefined,
                    }}
                  >
                    {video.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: isBigSecreen
                        ? "space-between"
                        : "flex-start",
                      columnGap: !isBigSecreen ? "25px" : undefined,
                      alignItems: "center",
                      color: "#707070",
                    }}
                  >
                    <Typography sx={{ fontSize: "14px" }}>
                      {video.date}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      {video.likes}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            {visibleVideos < videos.length && (
              <Typography
                sx={{ color: "#f25f0c", cursor: "pointer" }}
                onClick={() => setVisibleVideos(visibleVideos + 4)}
              >
                {t("Show more")}...
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VodcastDetail;
