import { Box, useMediaQuery } from "@mui/material";
import contactImg from "../../assets/contact.png";
import ContactForm from "./ContactForm";

const Contact = () => {
  const isMobile = useMediaQuery("(max-width: 620px)");
  const isTabScreen = useMediaQuery("(max-width:1060px)");
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${contactImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isTabScreen ? "center" : "space-between",
          alignItems: "center",
          columnGap: "10px",
          width: isMobile ? "90%" : { xs: "80%", sm: "60%", md: undefined },
        }}
      >
        <Box
          sx={{
            flex: isTabScreen ? "" : "1 1 40%",
            width: isTabScreen ? "100%" : "",
          }}
        >
          <ContactForm />
        </Box>
        {!isMobile && (
          <Box
            sx={{
              flex: "1 1 50%",
            }}
          ></Box>
        )}
      </Box>
    </Box>
  );
};

export default Contact;
