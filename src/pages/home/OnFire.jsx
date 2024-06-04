import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRef, useState } from "react";
import { styled } from "@mui/system";
import { IconButton, useMediaQuery } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import LiveCard from "../live/LiveCard";
import RoomsCard from "../srdHouse/RoomsCard";

const srdHouse = [
  {
    id: 1,
    topic: "Which framework best for frontend ?",
    speakers: [
      {
        id: 1,
        name: "John Doe",
        avatar: require("../../assets/podcast-1.png"),
      },
      {
        id: 2,
        name: "Jane Does asd asdas  asdsad asas",
        avatar: require("../../assets/podcast-2.png"),
      },
      {
        id: 3,
        name: "Jane Does asd asdas  asdsad asas",
        avatar: require("../../assets/podcast-2.png"),
      },
      {
        id: 4,
        name: "Jane Does asd asdas  asdsad asas",
        avatar: require("../../assets/podcast-2.png"),
      },
    ],
    totalPeople: 40,
  },
  {
    id: 2,
    topic: "What’s new in machine learning?",
    speakers: [
      {
        id: 1,
        name: "John Doe",
        avatar: require("../../assets/podcast-1.png"),
      },
      {
        id: 2,
        name: "Jane Doe",
        avatar: require("../../assets/podcast-2.png"),
      },
    ],
    totalPeople: 40,
  },
  {
    id: 3,
    topic: "Why people use stack overflow?",
    speakers: [
      {
        id: 1,
        name: "John Doe",
        avatar: require("../../assets/podcast-1.png"),
      },
      {
        id: 2,
        name: "Jane Doe",
        avatar: require("../../assets/podcast-2.png"),
      },
    ],
    totalPeople: 40,
  },
  {
    id: 4,
    topic: "Artificial inteligence is the future?",
    speakers: [
      {
        id: 1,
        name: "John Doe",
        avatar: require("../../assets/podcast-1.png"),
      },
      {
        id: 2,
        name: "Jane Doe",
        avatar: require("../../assets/podcast-2.png"),
      },
    ],
    totalPeople: 40,
  },
];

const live = [
  {
    id: "1",
    vid: require("../../assets/data/live/live1.mp4"),
    title: "الخوف من الذكاء الإصطناعي",
    views: "20.4k",
    userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    username: "Osama Mohamed",
  },
  {
    id: "2",
    vid: require("../../assets/data/live/live2.mp4"),
    title: "بخصوص مسار التأسيس البرمجي",
    views: "25.2k",
    userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    username: "Osama Mohamed",
  },
  {
    id: "3",
    vid: require("../../assets/data/live/live5.mp4"),
    title: "هل محتاج أتأسس لو هتعلم مجال علوم البيانات",
    views: "60.8k",
    userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    username: "Osama Mohamed",
  },
  {
    id: "4",
    vid: require("../../assets/data/live/live3.mp4"),
    title: "هل المفروض اتعلم عدة لغات برمجة",
    views: "2.8k",
    userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    username: "Osama Mohamed",
  },
  {
    id: "5",
    vid: require("../../assets/data/live/live4.mp4"),
    title: "هل مجال الفرونت اند هينتهي بعد سنتين",
    views: "200.6k",
    userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    username: "Osama Mohamed",
  },
  {
    id: "6",
    vid: require("../../assets/data/live/live6.mp4"),
    title: "هل مهارة حل المشكلات مهمة للفرونت اند ديفيلوبر",
    views: "10.4k",
    userImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    username: "Osama Mohamed",
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const OnFire = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isTabScreen = useMediaQuery("(min-width:769px) and (max-width:1060px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sliderRef = useRef(null);
  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const slider2Ref = useRef(null);
  const goToNextSlide2 = () => {
    slider2Ref.current.slickNext();
  };

  const goToPrevSlide2 = () => {
    slider2Ref.current.slickPrev();
  };

  let centerSlidePercentage2 = isMobile ? 100 : isTabScreen ? 50 : 33.33;
  const settings = {
    infinite: true,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: isMobile ? 1 : isTabScreen ? 2 : 3,
    centerSlidePercentage: centerSlidePercentage2,
    autoplay: false,
  };

  const StyledTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .Mui-selected": {
      backgroundColor: "#EB7635",
      color: "#fff",
      borderRadius: value === 0 ? "25px 25px 0 0" : "0 0 25px 25px", // Border radius based on selected tab
    },
    "& .MuiTab-root": {
      borderRadius: value === 0 ? "25px 0 0 25px" : "0 25px 25px 0", // Default border radius for non-selected tabs
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box p="1rem" sx={{ transform: "translateY(-125px)" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            my: "0.5rem",
            padding: "1rem",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textTransform: "uppercase",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: "1.5px",
              textShadow: "0px 0px 3px #f7f7f7",
            }}
          >
            {t("on fire")}
          </Typography>
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "90%" }}>
          <Box sx={{ marginBottom: "50px" }}>
            <AppBar
              position="static"
              sx={{
                borderRadius: "25px",
                backgroundColor: "#fff",
                color: "black",
                width: isMobile ? "100%" : "80%",
                m: "0 auto",
              }}
            >
              <StyledTabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("Live")}
                    </Typography>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("Srd Club")}
                    </Typography>
                  }
                  {...a11yProps(1)}
                />
              </StyledTabs>
            </AppBar>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              backgroundColor: "transparent",
              borderRadius: "20px",
              width: isMobile ? "100%" : "95%",
              margin: "0 auto",
            }}
          >
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Box>
                  <Slider ref={sliderRef} {...settings}>
                    {live.map((card, index) => (
                      <LiveCard
                        key={`carousel-live-card-${index}`}
                        card={card}
                      />
                    ))}
                  </Slider>
                  <IconButton
                    onClick={goToPrevSlide}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: isMobile ? "-15px" : "0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateBefore sx={{ fontSize: "40px", color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    onClick={goToNextSlide}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: isMobile ? "-15px" : "0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      flexGrow: 1,
                      transition: "0.5s",
                      "&:hover": {
                        cursor: "pointer",
                      },
                      "&:hover > p": {
                        color: "#fabf9e",
                      },
                    }}
                    onClick={() => navigate("/allbroadcasts")}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        transition: "0.5s",
                        color: "#EB7635",
                        mt: "15px",
                      }}
                    >
                      {t("MORE")}...
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Box
                  sx={{
                    position: "relative",
                    "& .slick-list": {
                      py: "15px !important",
                    },
                  }}
                >
                  <Slider ref={slider2Ref} {...settings}>
                    {srdHouse.map((card, index) => (
                      <RoomsCard
                        card={card}
                        key={`carousel-live-card-${index}`}
                      />
                    ))}
                  </Slider>

                  <IconButton
                    onClick={goToPrevSlide2}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: isMobile ? "-10px" : "-20px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateBefore sx={{ fontSize: "40px", color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    onClick={goToNextSlide2}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: isMobile ? "-10px" : "-20px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      flexGrow: 1,
                      transition: "0.5s",
                      "&:hover": {
                        cursor: "pointer",
                      },
                      "&:hover > p": {
                        color: "#fabf9e",
                      },
                    }}
                    onClick={() => navigate("/srdhouse")}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        transition: "0.5s",
                        color: "#EB7635",
                        mt: "15px",
                      }}
                    >
                      {t("MORE")}...
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>
            </SwipeableViews>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default OnFire;
