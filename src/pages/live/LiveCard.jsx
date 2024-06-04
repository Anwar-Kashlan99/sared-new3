import { Avatar, Box, Card, Typography, useMediaQuery } from "@mui/material";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import useIntersectionObserver from "@react-hook/intersection-observer";
import { useNavigate } from "react-router-dom";

const LiveCard = ({ card, index }) => {
  const isTabScreen = useMediaQuery("(min-width:769px) and (max-width:1600px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width:1601px)");
  const navigate = useNavigate();

  const cardRef = useRef();
  const controls = useAnimation();

  const { isIntersecting } = useIntersectionObserver(cardRef, {
    threshold: 0.1,
  });
  useEffect(() => {
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
    justifyContent: "center",
    margin: "12px",
  };

  const cardContainerStyles = {
    boxShadow: "0 4px 6px #707070",
    margin: isMobile ? "0 15px" : "0px",
    borderRadius: "25px",
    backgroundColor: "#fff",
    position: "relative",
    cursor: "pointer",
    width: isMobile
      ? "300px"
      : isTabScreen
      ? "350px"
      : isBigScreen
      ? "375px"
      : "",
  };

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
        <Card sx={cardContainerStyles} onClick={() => navigate("/golive")}>
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
            live
          </Box>
          <Box
            sx={{
              color: "#fff",
              position: "absolute",
              left: "85px",
              top: "15px",
              padding: "2px 10px",
              borderRadius: "20px",
              backgroundColor: "#000000b0",
            }}
          >
            {card.views}
          </Box>
          <Box sx={{ width: "100%", height: "440px" }}>
            <video
              alt={`blog-${card.title}-${index}`}
              src={card.vid}
              style={{
                width: "100%",
                objectFit: "cover",
                height: "100%",
              }}
              muted
              autoPlay
            />
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
              {card.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={card.userImg}
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
                <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
                  {card.username}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </motion.div>
  );
};

export default LiveCard;
