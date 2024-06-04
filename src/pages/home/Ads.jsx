import { Box, useMediaQuery } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Ads = ({ adsSlider, intervalz }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    swipe: false, // Disable swipe functionality
    centerMode: true,
    centerPadding: "0",
    slidesToShow: 1,
    centerSlidePercentage: 100,
    autoplay: true,
    autoplaySpeed: intervalz || 5000,
    speed: 1000, // Animation speed for slide transitions
  };

  return (
    <Slider {...settings}>
      {Object.values(adsSlider).map((image, index) => (
        <Box
          key={`carousel-image-${index}`}
          sx={{ height: isMobile ? "80px" : undefined }}
        >
          <img
            src={image}
            alt={`carousel-${index}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: isMobile ? "fill" : "cover",
              backgroundAttachment: "fixed",
            }}
          />
        </Box>
      ))}
    </Slider>
  );
};

export default Ads;
