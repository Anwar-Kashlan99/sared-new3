import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import React, { useRef } from "react";
import Slider from "react-slick";
import BlogCard from "../blogs/BlogCard";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

const bolgCards = [
  {
    id: "1",
    Categories: "technology",
    porfileImg: require("../../assets/podcast-1.png"),
    blogImg: require("../../assets/impressionism.jpg"),
    userName: "Blog test",
    likes: "400",
    date: "2/12/2023",
    blogTitle: "Blog test fake name",
    blogDescription: "Lorem ipsum dolor sit amet, consectetur adip incididid ",
  },
  {
    id: "2",
    Categories: "technology",
    date: "2/12/2023",
    porfileImg: require("../../assets/podcast-1.png"),
    blogImg: require("../../assets/impressionism.jpg"),
    userName: "Blog test",
    likes: "400",
    blogTitle: "Blog test fake name",
    blogDescription: "Lorem ipsum dolor sit amet, consectetur adip incididid ",
  },
  {
    id: "3",
    Categories: "art",
    date: "2/12/2023",
    porfileImg: require("../../assets/podcast-1.png"),
    blogImg: require("../../assets/impressionism.jpg"),
    userName: "Blog test",
    likes: "400",
    blogTitle: "Blog test fake name",
    blogDescription: "Lorem ipsum dolor sit amet, consectetur adip incididid ",
  },
  {
    id: "4",
    Categories: "physical",
    date: "2/12/2023",
    porfileImg: require("../../assets/podcast-1.png"),
    blogImg: require("../../assets/impressionism.jpg"),
    userName: "Blog test",
    likes: "400",
    blogTitle: "Blog test fake name",
    blogDescription: "Lorem ipsum dolor sit amet, consectetur adip incididid ",
  },
];

const podcasterCards = [
  {
    id: "1",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "2",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "3",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "4",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "5",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "6",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "7",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "8",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
];

const vodcasterCards = [
  {
    id: "1",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "2",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "3",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "4",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "5",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "6",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "7",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "8",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
];

const Favorite = () => {
  const isMobile = useMediaQuery("(max-width: 825px)");
  const isTabScreen = useMediaQuery("(min-width:826px) and (max-width:1060px)");
  const isBigScreen = useMediaQuery("(min-width:1600px)");
  const { t } = useTranslation();
  const sliderRef = useRef(null);
  const slider2Ref = useRef(null);
  const slider3Ref = useRef(null);

  const handleCoverEdit = () => {};

  const handleFollow = () => {};

  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const goToNextSlide2 = () => {
    slider2Ref.current.slickNext();
  };

  const goToPrevSlide2 = () => {
    slider2Ref.current.slickPrev();
  };

  const goToNextSlide3 = () => {
    slider3Ref.current.slickNext();
  };

  const goToPrevSlide3 = () => {
    slider3Ref.current.slickPrev();
  };

  let centerSlidePercentage = isMobile
    ? 100
    : isTabScreen
    ? 50
    : !isBigScreen
    ? 33.33
    : 25;

  const settings = {
    infinite: true,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: isMobile ? 1 : isTabScreen ? 2 : !isBigScreen ? 3 : 4,
    centerSlidePercentage: centerSlidePercentage,
    autoplay: false,
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ m: isMobile ? "6rem 0 0" : "5.5rem 0 0" }}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#7B7775",
            borderRadius: "20px",
          }}
        >
          <Box
            sx={{
              width: "90%",
              m: "0 auto",
              p: "10px 5px 25px 0",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                color: "#fff",
                mb: "10px",
                ml: "20px",
                fontWeight: "bold",
              }}
            >
              {t("Blogs")}
            </Typography>
            <Slider ref={sliderRef} {...settings}>
              {bolgCards.map((card, index) => (
                <div key={`${card.userName}-${card.id}`}>
                  <BlogCard card={card} index={index} />
                </div>
              ))}
            </Slider>
            <IconButton
              onClick={goToPrevSlide}
              sx={{
                position: "absolute",
                top: "50%",
                left: "-30px",
                color: "white",
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
                right: "-30px",
                color: "white",
                padding: "5px",
                zIndex: "10",
                transform: "translateY(-50%)",
              }}
            >
              <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "90%",
              m: "0 auto",
              p: "25px 5px",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                color: "#707070",
                mb: "20px",
                ml: "20px",
                fontWeight: "bold",
              }}
            >
              {t("Podcasts")}
            </Typography>
            <Slider ref={slider2Ref} {...settings}>
              {podcasterCards.map((podcaster) => (
                <div key={`${podcaster.userName}-${podcaster.id}`}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "350px",
                        height: "275px",
                        marginBottom: "5px",
                        borderRadius: "20px",
                        border: "8px solid #EB7635",
                        position: "relative",
                      }}
                    >
                      <img
                        alt={`${podcaster.name}-${podcaster.id}`}
                        src={podcaster.img}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {podcaster.name}
                    </Typography>
                    <Typography sx={{ maxWidth: "250px", textAlign: "center" }}>
                      {podcaster.title}
                    </Typography>
                  </Box>
                </div>
              ))}
            </Slider>
            <IconButton
              onClick={goToPrevSlide2}
              sx={{
                position: "absolute",
                top: "50%",
                left: "-30px",
                color: "white",
                padding: "5px",
                zIndex: "10",
                transform: "translateY(-50%)",
              }}
            >
              <NavigateBefore sx={{ fontSize: "40px", color: "#EB7635" }} />
            </IconButton>
            <IconButton
              onClick={goToNextSlide2}
              sx={{
                position: "absolute",
                top: "50%",
                right: "-30px",
                color: "white",
                padding: "5px",
                zIndex: "10",
                transform: "translateY(-50%)",
              }}
            >
              <NavigateNext sx={{ fontSize: "40px", color: "#EB7635" }} />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#EB7635",
            borderRadius: "20px 20px 0px 0px",
          }}
        >
          <Box
            sx={{
              width: "90%",
              m: "0 auto",
              p: "25px 5px",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                color: "#fff",
                mb: "20px",
                ml: "20px",
                fontWeight: "bold",
              }}
            >
              {t("Vodcasts")}
            </Typography>
            <Slider ref={slider3Ref} {...settings}>
              {vodcasterCards.map((vodcaster) => (
                <div key={`${vodcaster.userName}-${vodcaster.id}`}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "350px",
                        height: "275px",
                        marginBottom: "5px",
                        borderRadius: "20px",
                        border: "8px solid #fff",
                        position: "relative",
                      }}
                    >
                      <img
                        alt={`${vodcaster.name}-${vodcaster.id}`}
                        src={vodcaster.img}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: "#f7f7f7",
                      }}
                    >
                      {vodcaster.name}
                    </Typography>
                    <Typography
                      sx={{
                        maxWidth: "250px",
                        textAlign: "center",
                        color: "#f7f7f7",
                      }}
                    >
                      {vodcaster.title}
                    </Typography>
                  </Box>
                </div>
              ))}
            </Slider>
            <IconButton
              onClick={goToPrevSlide3}
              sx={{
                position: "absolute",
                top: "50%",
                left: "-30px",
                color: "white",
                padding: "5px",
                zIndex: "10",
                transform: "translateY(-50%)",
              }}
            >
              <NavigateBefore sx={{ fontSize: "40px", color: "#fff" }} />
            </IconButton>
            <IconButton
              onClick={goToNextSlide3}
              sx={{
                position: "absolute",
                top: "50%",
                right: "-30px",
                color: "white",
                padding: "5px",
                zIndex: "10",
                transform: "translateY(-50%)",
              }}
            >
              <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Favorite;
