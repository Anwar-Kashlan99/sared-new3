import { useTheme } from "@emotion/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import QR from "../../assets/QR.png";
import googlestore from "../../assets/googlestore.png";
import { useTranslation } from "react-i18next";

const Qr = ({ setIsQr }) => {
  const { palette } = useTheme();
  const isMobile = useMediaQuery("(max-width: 620px)");
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(0 0 0 / 65%)",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "1000",
      }}
    >
      <Box
        bgcolor={palette.neutral.main}
        sx={{
          width: isMobile
            ? "80%"
            : { xs: "70%", sm: "60%", md: "45%", lg: "32%" },
          borderRadius: isMobile ? "60px" : { xs: "80px", md: "90px" },
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          color="#707070"
          variant="h4"
          fontWeight="bold"
          onClick={() => setIsQr(false)}
          sx={{
            transition: "0.5s",
            mb: "25px",
            "&:hover": {
              cursor: "pointer",
              color: "#e7e7e7",
            },
          }}
        >
          {t("skip")}
        </Typography>
        <img
          alt="qr"
          src={QR}
          style={{
            width: isNotMobile ? "250px" : "200px",
          }}
        />
        <hr
          style={{
            width: isNotMobile ? "200px" : "175px",
            marginTop: "25px",
            height: "2px",
            backgroundColor: "#707070",
          }}
        />
        <Box
          width={isNotMobile ? "52px" : "42px"}
          height={isNotMobile ? "52px" : "42px"}
          my="20px"
        >
          <img
            alt="googlestore"
            src={googlestore}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        <Typography
          sx={{
            color: palette.primary.main,
            marginTop: "15px",
            fontSize: isNotMobile ? "32px" : "25px",
          }}
        >
          {t("Scan to download")}
        </Typography>
      </Box>
    </Box>
  );
};

export default Qr;
