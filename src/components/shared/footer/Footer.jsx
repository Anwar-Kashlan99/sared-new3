import { useTheme } from "@emotion/react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import whatsapp from "../../../assets/whatsapp.png";
import gmail from "../../../assets/gmail.png";
import facebook from "../../../assets/facebook.png";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { XIcon } from "react-share";

const Footer = () => {
  const isTabScreen = useMediaQuery("(max-width:1060px)");
  const isMobile = useMediaQuery("(max-width: 620px)");
  const { t } = useTranslation();

  const { palette } = useTheme();
  return (
    <Box
      width="100%"
      bgcolor={"#545454"}
      padding="8px 15px 2px"
      sx={{ position: "relative", zIndex: "2" }}
    >
      <Box
        display="flex"
        sx={{
          flexDirection: "column",
        }}
      >
        <Box
          display="flex"
          flexDirection={isTabScreen ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          // mt="10px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ order: isTabScreen ? "2" : "1" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection={isMobile ? "column" : "row"}
            >
              <Box>
                <IconButton
                  sx={{
                    width: "46px",
                    height: "46px",
                  }}
                >
                  <a
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <XIcon size={32} round />
                  </a>
                </IconButton>
                <IconButton
                  sx={{
                    width: "46px",
                    height: "46px",
                  }}
                >
                  <a
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="facebook"
                      src={facebook}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                </IconButton>
                <IconButton
                  sx={{
                    width: "46px",
                    height: "46px",
                  }}
                >
                  <a
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="whatsapp"
                      src={whatsapp}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                </IconButton>
                <IconButton
                  sx={{
                    width: "46px",
                    height: "46px",
                  }}
                >
                  <a
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="gmail"
                      src={gmail}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                </IconButton>
              </Box>
              <Box>
                <Typography variant="h4" color="#fff">
                  info@sared.online
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              columnGap: "25px",
              order: isTabScreen ? "1" : "2",
              mb: isTabScreen ? "10px" : undefined,
            }}
          >
            <NavLink to={"/contact"}>
              <Typography component="h4" variant={"h4"}>
                {t("Contact Us")}
              </Typography>
            </NavLink>
            <NavLink to={"/about"}>
              <Typography component="h4" variant={"h4"}>
                {t("About Us")}
              </Typography>
            </NavLink>
          </Box>
          <Typography
            variant={isTabScreen ? "h5" : "h4"}
            color="#fff"
            sx={{
              mb: isTabScreen ? "8px" : "",
              order: "3",
            }}
          >
            {t("This website is made by")}{" "}
            <span style={{ color: palette.primary.main }}>
              {t("focus trading company")}
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
