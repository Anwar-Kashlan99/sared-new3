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
import img from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/channels4_profile.jpg";
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
import defultImg from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/channels4_profile (4).jpg";

import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useTranslation } from "react-i18next";
import audio1 from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/الجبان - من الأدب الفرنسي - من كتاب قصص فرنسية - رواية وبودكاست riwaya & podcast.mp3";
import audio2 from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/الجواهر الكاذبة - من الأدب الفرنسي - من كتاب قصص فرنسية - رواية وبودكاست riwaya & podcast.mp3";
import audio3 from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/الحب و الموت - من الأدب الفرنسي - من كتاب قصص فرنسية - رواية وبودكاست riwaya & podcast.mp3";
import audio4 from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/الشيطان - من الأدب الفرنسي - من كتاب قصص فرنسية - رواية وبودكاست riwaya & podcast.mp3";
import audio5 from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/غموض الاميرة المقنعة  - من هي  - غرام فاضح رواية وبودكاست riwaya  podcast قصة غموض.mp3";
import audio6 from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/قصة والد سيمون - من الأدب الفرنسي - من كتاب قصص فرنسية - رواية وبودكاست riwaya & podcast.mp3";

const audios = [
  {
    id: 1,
    title: "الجبان - من الأدب الفرنسي - من كتاب قصص فرنسية ",
    date: "3 day ago",
    likes: "200K",
    coverUrl: defultImg,
    url: audio1,
    information: "الجبان وهي قصة من كتاب قصص فرنسية وهو كتاب من الادب الفرنسي ",
    comments: ["Comment 1", "Comment 2", "Comment 3"],
  },
  {
    id: 2,
    title: "الجواهر الكاذبة - من الأدب الفرنسي - من كتاب قصص فرنسية",
    date: "10 day ago",
    likes: "100K",
    coverUrl: defultImg,
    url: audio2,
    information:
      "الجواهر الكاذبة وهي قصة من كتاب قصص فرنسية وهو كتاب من الادب الفرنسي تحكي احداث هذه القصة عن رجل يدعى السيد لانتيل يتزوج بفتاة ذائعة الصيت في جمالها وكانت هذا الفتاة مولعة بالمجوهرات لدرجة الجنون لكن المسيو لانتيل كان رجلا لا يملك من المال ما يكفي لاشباع ولع زوجته من المجوهرات فما كان منها الا ان تقتني المجوهرات المزيفة لارضاء ذاتهاتمر الايام وتمرض زوجته مرضاً شديدا ويتوفاها الله فيدخل زوجها في حالة حزن شديد ويفقد ماله الى ان يصاب بالفقر المدقع فيفكر في بيع مجوهرات زوجته المتوفاة المزيفة ياخذ مسيو لانتيل عقدا لبيعه فإذ به يتفاجأ بأن العقد وباقي مجوهرات زوجته كانت حقيقية !!!!!",
    comments: ["Comment 1", "Comment 2", "Comment 3"],
  },
  {
    id: 3,
    title: "الحب و الموت - من الأدب الفرنسي - من كتاب قصص فرنسية",
    date: "16 day ago",
    likes: "90K",
    coverUrl: defultImg,
    url: audio3,
    information:
      "الحب والموت وهي قصة من كتاب قصص فرنسية وهو كتاب من الادب الفرنسي ",
    comments: ["Comment 1", "Comment 2", "Comment 3"],
  },
  {
    id: 4,
    title: "الشيطان - من الأدب الفرنسي - من كتاب قصص فرنسية ",
    date: "20 day ago",
    likes: "80K",
    coverUrl: defultImg,
    url: audio4,
    information: "الشيطان وهي قصة من كتاب قصص فرنسية وهو كتاب من الادب الفرنسي",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
  {
    id: 5,
    title: "غموض الاميرة المقنعة 🎭👑 - من هي !!؟🧐 - غرام فاضح 😨",
    date: "25 day ago",
    likes: "60K",
    coverUrl: defultImg,
    url: audio5,
    information:
      "الاميرة المقنعة 🎭👑 -غرام فاضح 😨 وهي قصة من كتاب قصص فرنسية وهو كتاب من الادب الفرنسي ",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
  {
    id: 6,
    title: "قصة والد سيمون - من الأدب الفرنسي - من كتاب قصص فرنسية",
    date: "30 day ago",
    likes: "50K",
    coverUrl: defultImg,
    url: audio6,
    information:
      "والد سيمون وهي قصة من كتاب قصص فرنسية وهو كتاب من الادب الفرنسي ",
    comments: ["Comment 7", "Comment 8", "Comment 9"],
  },
];

const PodcastDetail = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [visibleAudios, setVisibleAudios] = useState(6);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallSecreen = useMediaQuery("(max-width: 476px)");
  const isBigSecreen = useMediaQuery("(min-width: 1540px)");
  const { t } = useTranslation();

  useEffect(() => {
    if (!selectedAudio && audios.length > 0) {
      setSelectedAudio(audios[0]);
    }
  }, [selectedAudio, audios]);

  const handleVideoClick = (audio, index) => {
    setSelectedAudioIndex(index);
    setSelectedAudio(audio);
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

  if (!selectedAudio || !selectedAudio.information) {
    return null; // or display a fallback UI if necessary
  }

  const truncatedText =
    selectedAudio.information.length > 215
      ? selectedAudio.information.slice(0, 215) + "..."
      : selectedAudio.information;

  const showButtons = selectedAudio.information.length > 215;

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
            {selectedAudio && (
              <Box sx={{ width: "95%", position: "relative" }}>
                <img
                  alt={selectedAudio.title}
                  src={defultImg}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "30px",
                  }}
                />
                <ReactAudioPlayer
                  src={selectedAudio.url}
                  title={selectedAudio.title}
                  autoPlay={false}
                  autoPlayAfterSrcChange={true}
                  controls
                  volume={0.7}
                  loop={false}
                  style={{
                    borderRadius: "30px",
                    position: "absolute",
                    bottom: isMobile ? "15px" : "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isMobile ? "90%" : "70%",
                    height: isMobile ? "80px" : "110px", // Set the desired height here
                    background: "rgb(255 255 255 / 21%)",
                    backdropFilter: "blur(9px)",
                  }}
                />
              </Box>
            )}
          </Box>
          {selectedAudio && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: "20px" }}>
                {selectedAudio.title}
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
                    <Avatar src={img} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <Typography>Riwaya&Podcast</Typography>
                      <Typography>300M followers</Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" sx={{ padding: "3px 10px" }}>
                    follow
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
                  {showMore ? selectedAudio.information : truncatedText}
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
            {audios.slice(0, visibleAudios).map((audio, index) => (
              <Box
                key={audio.id}
                onClick={() => handleVideoClick(audio, index)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  padding: "15px 20px",
                  borderRadius: "20px",
                  columnGap: "20px",
                  backgroundColor:
                    selectedAudioIndex === index ? "#eee" : undefined,
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
                  <img
                    alt={audio.title}
                    src={defultImg}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "30px",
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
                    {audio.title}
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
                      {audio.date}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      {audio.likes}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            {visibleAudios < audios.length && (
              <Typography
                sx={{ color: "#f25f0c", cursor: "pointer" }}
                onClick={() => setVisibleAudios(visibleAudios + 4)}
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

export default PodcastDetail;
