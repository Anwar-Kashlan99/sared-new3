import { Avatar, Box, Card, Typography, useMediaQuery } from "@mui/material";
import React, { useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";
import useIntersectionObserver from "@react-hook/intersection-observer";
import { useNavigate } from "react-router-dom";

const BlogCard = React.memo(({ card, index }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t, i18n } = useTranslation();
  const cardRef = useRef();
  const controls = useAnimation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const { isIntersecting } = useIntersectionObserver(cardRef, {
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (isIntersecting) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.6 },
      });
    }
  }, [isIntersecting, controls]);

  const cardStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardContainerStyles = {
    boxShadow: "0 4px 6px #707070",
    margin: isMobile ? "0 15px" : "0px",
    borderRadius: "20px",
    backgroundColor: "#fff",
    position: "relative",
    width: isMobile ? "90%" : "350px",
    cursor: "pointer",
  };

  const imageContainerStyles = {
    height: "250px",
    padding: "10px",
    backgroundColor: "#f3f3f3",
  };

  const imageStyles = {
    width: "100%",
    objectFit: "cover",
    height: "100%",
    borderRadius: "15px",
  };

  const infoContainerStyles = {
    padding: "3px 15px 10px ",
    backgroundColor: "#f3f3f3",
  };

  const avatarStyles = {
    marginRight: "25px",
    width: "60px",
    height: "60px",
    my: isMobile ? "10px" : "0",
  };

  const titleStyles = {
    fontWeight: "bold",
    fontSize: "17px",
    mb: "7px",
    textAlign: isArabic ? "right" : "left",
  };

  const descriptionStyles = {
    textAlign: isMobile ? "center" : "start",
    mb: isMobile ? "5px" : "20px",
    fontSize: isMobile ? "15px" : "16px",
    textAlign: isArabic ? "right" : "left",
  };

  const footerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  };

  const truncatedText =
    card.blogDescription.length > 150
      ? card.blogDescription.slice(0, 150) + "..."
      : card.blogDescription;

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
        <Card sx={cardContainerStyles} onClick={() => navigate("/blog")}>
          <Box
            sx={{
              position: "absolute",
              left: "25px",
              top: "20px",
              padding: "3px 18px",
              backgroundColor: "#f25f0c",
              borderRadius: "20px",
            }}
          >
            <Typography sx={{ color: "#fff", fontSize: "15px" }}>
              {card.Categories}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={imageContainerStyles}>
              <img
                alt={`blog-${card.blogName}-${index}`}
                src={card.blogImg}
                style={imageStyles}
                loading="lazy"
              />
            </Box>
            <Box sx={infoContainerStyles}>
              <Box sx={{ display: "flex", alignItems: "center", mb: "10px" }}>
                <Avatar
                  src={card.porfileImg}
                  alt={`carousel-${index}`}
                  sx={avatarStyles}
                />
                <Typography
                  sx={{
                    mb: "3px",
                    textAlign: isMobile ? "center" : "start",
                    fontSize: "16px",
                  }}
                >
                  {card.userName}
                </Typography>
              </Box>
              <Box>
                <Typography sx={titleStyles}>{card.blogTitle}</Typography>
                <Typography sx={descriptionStyles}>{truncatedText}</Typography>
              </Box>

              <Box sx={footerStyles}>
                <Typography sx={{ color: "#707070", fontSize: "14px" }}>
                  {card.date}
                </Typography>
                <Typography sx={{ color: "#707070", fontSize: "14px" }}>
                  {card.likes} {t("likes")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </motion.div>
  );
});

export default BlogCard;
