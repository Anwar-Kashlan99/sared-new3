import { SearchOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Input,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LiveDetailModule from "./LiveDetailModule";
import { motion, useAnimation } from "framer-motion";
import useIntersectionObserver from "@react-hook/intersection-observer";
import { useNavigate } from "react-router-dom";
import { useGetAllRoomsQuery } from "../../store/srdClubSlice";
import avatar from "../../assets/avatar.svg";

// const liveCard = [
//   {
//     id: "1",
//     vid: require("../../assets/data/live/live6.mp4"),
//     title: "هل مهارة حل المشكلات مهمة للفرونت اند ديفيلوبر",
//     views: "10.4k",
//     userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
//     username: "Osama Mohamed",
//   },
//   {
//     id: "2",
//     vid: require("../../assets/data/live/live1.mp4"),
//     title: "الخوف من الذكاء الإصطناعي",
//     views: "20.4k",
//     userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
//     username: "Osama Mohamed",
//   },
//   {
//     id: "3",
//     vid: require("../../assets/data/live/live2.mp4"),
//     title: "بخصوص مسار التأسيس البرمجي",
//     views: "25.2k",
//     userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
//     username: "Osama Mohamed",
//   },

//   {
//     id: "4",
//     vid: require("../../assets/data/live/live3.mp4"),
//     title: "هل المفروض اتعلم عدة لغات برمجة",
//     views: "2.8k",
//     userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
//     username: "Osama Mohamed",
//   },
//   {
//     id: "5",
//     vid: require("../../assets/data/live/live4.mp4"),
//     title: "هل مجال الفرونت اند هينتهي بعد سنتين",
//     views: "200.6k",
//     userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
//     username: "Osama Mohamed",
//   },
//   {
//     id: "6",
//     vid: require("../../assets/data/live/live5.mp4"),
//     title: "هل محتاج أتأسس لو هتعلم مجال علوم البيانات",
//     views: "60.8k",
//     userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
//     username: "Osama Mohamed",
//   },
// ];

const AllBroadcasts = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showModule, setShowModule] = useState(false);
  const isTabScreen = useMediaQuery("(min-width:769px) and (max-width:1600px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width:1601px)");
  const { t } = useTranslation();
  const cardRef = useRef();
  const controls = useAnimation();
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useGetAllRoomsQuery({
    key: "value",
  });

  // useEffect(() => {
  //   controls.start({
  //     opacity: 1,
  //     x: 0,
  //     transition: { duration: 0.6 },
  //   });
  // }, [controls]);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredLives = data
    ?.filter((card) => {
      return (
        searchValue === "" ||
        card.topic.toLowerCase().includes(searchValue.toLowerCase()) ||
        card._id.toLowerCase().includes(searchValue.toLowerCase())
      );
    })
    .reverse();

  const handleModuleOpen = () => {
    setShowModule(true);
  };

  const handleModuleClose = () => {
    setShowModule(false);
  };

  const cardStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardContainerStyles = (isMobile, isTabScreen, isBigScreen) => ({
    boxShadow: "0 4px 6px #707070",
    margin: isMobile ? "0 15px" : "0px",
    borderRadius: "25px",
    backgroundColor: "#fff",
    position: "relative",
    cursor: "pointer",
    maxHeight: isMobile
      ? "350px"
      : isTabScreen
      ? "400px"
      : isBigScreen
      ? "438px"
      : "",
    width: isMobile
      ? "300px"
      : isTabScreen
      ? "350px"
      : isBigScreen
      ? "375px"
      : "",
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "90%",
          m: isMobile ? "5rem auto 3rem" : "5rem auto 2rem",
          padding: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            sx={{
              order: isMobile ? "2" : "1",
              backgroundColor: "#f25f0c",
              color: "white",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "#fff",
                color: "#f25f0c",
              },
            }}
            variant="outlined"
            onClick={handleModuleOpen}
          >
            {t("Go Live")}
          </Button>
          <Box
            sx={{
              marginBottom: "15px",
              position: "relative",
              order: isMobile ? "1" : "2",
            }}
          >
            <Input
              type="text"
              placeholder={t("Search")}
              value={searchValue}
              sx={{
                width: isMobile ? "300px" : "500px",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "20px",
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
                fontSize: "30px",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
            transition: "opacity 0.5s ease",
            opacity: filteredLives?.length > 0 ? 1 : 0, // Fade in/out effect
          }}
        >
          {filteredLives?.map((card, index) => {
            return (
              <motion.div
                ref={cardRef}
                key={index}
                initial={{
                  opacity: 0,
                  x: isMobile ? 35 : index % 2 === 0 ? 50 : 100,
                }}
                animate={controls}
              >
                <Box sx={cardStyles}>
                  <Card
                    sx={cardContainerStyles(isMobile, isTabScreen, isBigScreen)}
                    onClick={() => navigate(`/live/room/${card._id}`)}
                  >
                    <Box
                      sx={{
                        backgroundColor: "red",
                        color: "#fff",
                        position: "absolute",
                        left: "20px",
                        top: "15px",
                        padding: "2px 17px",
                        borderRadius: "20px",
                      }}
                    >
                      {t("live")}
                    </Box>
                    <Box
                      sx={{
                        color: "#fff",
                        position: "absolute",
                        left: "93px",
                        top: "15px",
                        padding: "2px 10px",
                        borderRadius: "20px",
                        backgroundColor: "#000000b0",
                      }}
                    >
                      {/*card.views*/} 11
                    </Box>
                    <Box sx={{ width: "100%", height: "440px" }}>
                      {/** <video
                        alt={`blog-${card.title}-${index}`}
                        src={card.vid}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          height: "100%",
                        }}
                        muted
                        autoPlay
                      /> */}
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "10px",
                        left: "5px",
                        padding: "10px",
                        textAlign: "start",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontSize: "18px",
                          mb: "3px",
                          fontWeight: "bold",
                          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.8)",
                          letterSpacing: "1.5px",
                        }}
                      >
                        {card.topic}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={avatar}
                          alt={`carousel-${index}`}
                          sx={{
                            marginRight: "25px",
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{ color: "#fff", fontWeight: "bold" }}
                          >
                            sss
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Box>
      {showModule && <LiveDetailModule onClose={handleModuleClose} />}
    </Box>
  );
};

export default AllBroadcasts;
