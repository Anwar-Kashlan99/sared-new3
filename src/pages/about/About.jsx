import { Box, Typography, useMediaQuery } from "@mui/material";
import aboutImg from "../../assets/about.png";
import { useTranslation } from "react-i18next";

const About = () => {
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${aboutImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        sx={{
          borderRadius: "20px",
          background: "#ffffff12",
          backdropFilter: "blur(13px)",
          padding: "1rem 0",
          position: "absolute",
          bottom: "75px",
          zIndex: "10",
        }}
      >
        <Typography
          align="center"
          sx={{
            maxWidth: "925px",
            padding: "20px",
            color: "#fff",
            fontSize: isMobile ? "17px" : "20px",
          }}
        >
          {t(
            "Our mission is to persistently break new ground in Arab broadcasting by: inspiring people to assume their responsibilities as citizens through positive action."
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default About;
