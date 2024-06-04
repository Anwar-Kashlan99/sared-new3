import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import errorImg from "../assets/errorImg.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ErrorPage = ({ errorMsg }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          margin: "auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <img alt="errorImg" src={errorImg} style={{ width: "700px" }} />
        </Box>
        <Box
          sx={{
            flex: "1 1 49%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: isMobile ? "30px" : "50px",
          }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "18px" : "25px",
              fontWeight: "bold",
              color: "#707070",
              mb: "20px",
              maxWidth: isMobile ? "250px" : "700px",
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {errorMsg} <br /> {t("Why not try this page instead")}
          </Typography>
          <Button
            variant="contained"
            sx={{
              p: isMobile ? "8px 15px" : "10px 20px",
              fontSize: isMobile ? "14px" : "16px",
              color: "#fff",
            }}
            onClick={() => navigate("/home")}
          >
            {t("Go Back Home")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ErrorPage;
