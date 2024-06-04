import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import { Fragment, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const importAll = (require) =>
  require.keys().reduce((acc, next) => {
    acc[next.replace("./", "")] = require(next);
    return acc;
  }, {});

const images = importAll(
  require.context("../../assets/sliderImg", false, /\.(png|jpe?g|svg)$/)
);

const MainCarousel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sliderRef = useRef(null);
  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const settings = {
    infinite: true,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: 1,
    centerSlidePercentage: 100,
    autoplay: true,
    autoplaySpeed: 13000,
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Slider ref={sliderRef} {...settings}>
        {Object.values(images).map((image, index) => (
          <Box key={`carousel-image-${index}`}>
            <img
              src={image}
              alt={`carousel-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Slider>
      <IconButton
        onClick={goToPrevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: isMobile ? "0px" : "25px",
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
          right: isMobile ? "0px" : "25px",
          color: "white",
          padding: "5px",
          zIndex: "10",
          transform: "translateY(-50%)",
        }}
      >
        <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
      </IconButton>
      <Box
        sx={{
          position: "absolute",
          bottom: "-1270px",
          width: "100%",
          height: "1250px",
          left: "0",
          backgroundColor: "#D9DCE3",
        }}
      />
      <Box
        sx={{
          width: "100%",
          height: "136px",
          position: "absolute",
          bottom: "-1273px",
          left: "0",
          backgroundSize: "auto",
          backgroundRepeat: "repeat no-repeat",
          backgroundPosition: "35vw bottom",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1200 113' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0 1C19.5523 3 32.2291 4 51.5 7C104.5 16 200 36 300 56C400 75 500 94 600 86C700 79 800 45 900 25C987.526 4 1085.36 -1 1150 0C1169.54 -1 1180.49 0 1200 1V113H1150C1100 113 1000 113 900 113C800 113 700 113 600 113C500 113 400 113 300 113C200 113 100 113 50 113H0V1.98128Z' fill='%23707070'/></svg>")`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-2535px",
          width: "100%",
          height: "1265px",
          left: "0",
          backgroundColor: "#707070",
        }}
      />
    </Box>
  );
};

export default MainCarousel;
