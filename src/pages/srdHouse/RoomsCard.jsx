import { Avatar, Box, Card, Typography, useMediaQuery } from "@mui/material";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PeopleOutlined, Home } from "@mui/icons-material";
import avatar from "../../assets/avatar.svg";
import useIntersectionObserver from "@react-hook/intersection-observer";

const RoomsCard = ({ card, index }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

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

  return (
    <motion.div
      ref={cardRef}
      key={index}
      initial={{
        opacity: 0,
        x: isMobile ? 35 : index % 2 === 0 ? 50 : 100,
      }}
      animate={controls}
      onClick={() => {
        navigate(`/srdhouse/room/${card._id}`);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Card
        sx={{
          boxShadow: "0 4px 6px #707070",
          margin: isMobile ? "0 15px" : "0px",
          borderRadius: "50px",
          padding: "25px",
          width: isMobile ? "280px" : "350px",
          height: "250px",
          backgroundColor: "#fff",
        }}
      >
        <Box
          display="flex"
          sx={{
            flexDirection: "column",
            alignItems: isMobile || isArabic ? "center" : "start",
            marginBottom: "15px",
          }}
        >
          <Box
            dir={isArabic ? "rtl" : "ltr"}
            display="flex"
            alignItems="center"
            sx={{ marginBottom: "5px" }}
          >
            <Typography
              sx={{
                color: "#707070",
                fontWeight: "bold",
                marginRight: isArabic ? undefined : "3px",
                marginLeft: isArabic ? "3px" : undefined,
                textTransform: "uppercase",
              }}
            >
              {t("Boardroom")}
            </Typography>
            <Home sx={{ color: "#0f9b0f", fontSize: "18px" }} />
          </Box>
          <Typography
            dir={isArabic ? "rtl" : "ltr"}
            sx={{
              textAlign: isMobile ? "center" : "left",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            {t("Title")}: {card.topic}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            columnGap: "10px",
          }}
        >
          <Box
            sx={{
              flex: "1 1 30%",
              "& img": {
                width: "40px",
                height: "40px",
                p: "4px",
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "#eee",
                border: "2px solid #20bd5f",
                position: card.speakers.length === 1 ? "initial" : "absolute",
                top: "0",
                left: "0",
              },
              "& img:last-child": {
                top: "20px",
                left: "20px",
              },
            }}
          >
            {card.speakers.map((speaker) => (
              <img key={speaker._id} src={avatar} alt="speaker-avatar" />
            ))}
          </Box>

          <Box display="flex" flexDirection="column" sx={{ flex: "1 1 65%" }}>
            {card.speakers.slice(0, 2).map((speakers, index) => (
              <Box
                key={`participant-${speakers._id}-${index}`}
                sx={{ maxWidth: "200px", wordBreak: "break-word" }}
              >
                <Typography>{speakers.username}</Typography>
              </Box>
            ))}
            {card.speakers.length > 2 && (
              <Box
                sx={{ maxWidth: "200px", wordBreak: "break-word" }}
                title={card.speakers
                  .slice(3)
                  .map((speaker) => speaker.username)
                  .join(", ")}
              >
                <Typography>...</Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center" marginRight="8px">
                <Typography
                  sx={{
                    color: "#707070",
                    fontWeight: "bold",
                    marginRight: "3px",
                  }}
                >
                  {card.totalPeople}
                </Typography>
                <PeopleOutlined sx={{ color: "#707070", fontSize: "18px" }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default RoomsCard;
