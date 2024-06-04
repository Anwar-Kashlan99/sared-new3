import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import MainCarousel from "./MainCarousel";
import Ads from "./Ads";
import { useTranslation } from "react-i18next";
import Latest from "./Latest";
import OnFire from "./OnFire";
import solB from "../../assets/solB.png";
import solS from "../../assets/solS.png";

const importAll = (require) =>
  require.keys().reduce((acc, next) => {
    acc[next.replace("./", "")] = require(next);
    return acc;
  }, {});

const adsSlider1 = importAll(
  require.context("../../assets/ads/1", false, /\.(png|jpe?g|svg)$/)
);

const Home = () => {
  const [intervalz1, setIntervalz1] = useState(7000);
  const { t } = useTranslation();

  const isTabScreen = useMediaQuery("(min-width:769px) and (max-width:1600px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width:1601px)");

  const onChange1 = (index, item) => {
    setIntervalz1(item.props["data-interval"]);
  };

  return (
    <Box
      width="100%"
      sx={{
        minHeight: "calc(100vh - 56px)",
        backgroundColor: "#f7f7f7",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <MainCarousel />
        <Box sx={{ width: isMobile ? "95%" : "100%", m: "0 auto" }}>
          <Box
            sx={{
              position: isMobile ? undefined : "absolute",
              left: "50%",
              transform: isMobile ? undefined : "translateX(-50%)",
              bottom: "-40px",
              mt: isMobile ? "10px" : undefined,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2.5rem 6rem",
                position: "relative",
                backgroundColor: isMobile ? "#777" : "#e1e1e16b",
                backdropFilter: " blur(24px)",
                width: "fit-content",
                mx: "auto",
                color: isMobile ? "#fff" : "#000",
                borderRadius: "25px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: isMobile
                    ? "18px"
                    : { sm: "20px", md: "22px", lg: "25px" },
                  mb: "5px",
                }}
              >
                {t("From Podcast newbie to professional podcaster")}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: isMobile
                    ? "16px"
                    : { sm: "18px", md: "20px", lg: "23px" },
                }}
              >
                {t("From blogger newbie to professional blogger")}
              </Typography>
              <img
                alt="solB"
                src={solB}
                style={{
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                  width: " 90px ",
                }}
              />
              <img
                alt="solS"
                src={solS}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "15px",
                  width: "50px",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        width={isMobile ? "97%" : { sm: "95%", md: "93%", lg: "90%" }}
        m={isMobile ? "4.5rem auto 2rem" : "4rem auto 2rem"}
        p={isMobile ? "0.5rem" : { sm: "1rem", md: "1.5rem", lg: "2rem" }}
      >
        <Box
          m={isMobile ? "0.5rem auto" : "1.5rem auto"}
          sx={{ userSelect: "none" }}
        >
          <Ads adsSlider={adsSlider1} intervalz={intervalz1} />
        </Box>
      </Box>
      <Latest />
      <OnFire />
    </Box>
  );
};

export default Home;
