import { useTheme } from "@emotion/react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React, { Fragment, useState } from "react";
import solB from "../../assets/solB.png";
import solS from "../../assets/solS.png";
import Qr from "./Qr";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import authImg from "../../assets/authImg.png";
import { ArrowForwardIosOutlined } from "@mui/icons-material";

const Intro = () => {
  const [isQr, setIsQr] = useState(false);
  const { palette } = useTheme();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const isMobile = useMediaQuery("(max-width: 620px)");
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${authImg})`,
        backgroundSize: isMobile ? "cover" : "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          zIndex: "1",
          backgroundColor: "#00000026",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          zIndex: "10",
        }}
      >
        <Box
          sx={{
            padding: "2.5rem 2rem 1rem",
            borderRadius: "20px",
            background: "#ffffff12",
            backdropFilter: "blur(13px)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: "2",
            }}
          >
            <Typography
              color="#fff"
              sx={{
                textAlign: "center",
                padding: "20px",
                fontSize: isMobile
                  ? "22px"
                  : { xs: "28", sm: "30px", md: "32px", lg: "36px" },
              }}
            >
              {t("Hang out with friends, meet new ones")},
              <br /> {t("and talk about anything")}.
            </Typography>
            {isNotMobile && (
              <Fragment>
                <img
                  alt="solB"
                  src={solB}
                  style={{
                    position: "absolute",
                    right: "35px",
                    top: "75px",
                    width: " 90px ",
                  }}
                />
                <img
                  alt="solS"
                  src={solS}
                  style={{
                    position: "absolute",
                    right: "25px",
                    top: "-25px",
                    width: "50px",
                  }}
                />
              </Fragment>
            )}
          </Box>
        </Box>
        <Button
          size="large"
          sx={{
            backgroundColor: "#fff",
            color: palette.primary.main,
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "25px",
            p: "8px 30px",
            mt: "35px",
            mb: "7px",
            "&:hover": {
              backgroundColor: "#ddd",
            },
          }}
          onClick={() => setIsQr(true)}
        >
          {t("GET SRD")}
        </Button>
        <Typography
          color="#fff"
          mt="15px"
          variant="h4"
          fontWeight="bold"
          sx={{
            transition: "0.5s",
            "&:hover": {
              cursor: "pointer",
              color: "#e7e7e7",
            },
          }}
          onClick={() => navigate("/login")}
        >
          {t("skip")}
        </Typography>
      </Box>
      {isQr && <Qr setIsQr={setIsQr} />}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: "75px",
          right: "20px",
          zIndex: "10",
          columnGap: "5px",
          "&:hover": {
            cursor: "pointer",
            color: "#e7e7e7",
          },
        }}
        onClick={() => navigate("/login")}
      >
        <Typography
          color="#fff"
          variant="h4"
          fontWeight="bold"
          sx={{
            transition: "0.5s",
          }}
        >
          {t("Continue")}
        </Typography>
        <ArrowForwardIosOutlined sx={{ color: "#fff" }} />
      </Box>
    </Box>
  );
};

export default Intro;
