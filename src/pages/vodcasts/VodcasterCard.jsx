import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import useIntersectionObserver from "@react-hook/intersection-observer";
import { useNavigate } from "react-router-dom";

const VodcasterCard = React.memo(({ vodcaster, index }) => {
  const cardRef = useRef();
  const controls = useAnimation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
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

  return (
    <motion.div
      ref={cardRef}
      key={`${vodcaster.name}-${vodcaster.id}`}
      initial={{
        opacity: 0,
        x: isMobile ? 35 : index % 2 === 0 ? 50 : 100,
      }}
      animate={controls}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "230px",
          height: "230px",
          marginBottom: "5px",
          borderRadius: "20px",
          border: "8px solid #f25f0c",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={() => navigate("/vodcaster/playlists")}
      >
        <img
          alt={`${vodcaster.name}-${vodcaster.id}`}
          src={vodcaster.img}
          style={{
            width: "100%",
            height: "100%",
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
        {vodcaster.name}
      </Typography>
      <Typography sx={{ maxWidth: "250px", textAlign: "center" }}>
        {vodcaster.title}
      </Typography>
    </motion.div>
  );
});

export default VodcasterCard;
