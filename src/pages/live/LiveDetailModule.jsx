import React, { useState } from "react";
// import { createLive as create } from "../../http"
import { useNavigate } from "react-router-dom";
import socialImg from "../../assets/social.png";
import {
  Box,
  Button,
  IconButton,
  Input,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
const AddLiveModal = ({ onClose }) => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();

  //   async function createBroadcast() {
  //     try {
  //       if (!topic) {
  //         toast.error("Topic is required");
  //         return;
  //       }

  //       const { data } = await create({ topic });
  //       navigate(`/allbroadcasts/broadcast/${data.id}`);
  //     } catch (err) {
  //       console.log(err.message);
  //       toast.error("An error occurred");
  //     }
  //   }

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(0 0 0 / 65%)",
        zIndex: "1000",
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Box
        sx={{
          width: isMobile ? "90%" : "50%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "20px",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: " absolute",
            right: "5px",
            top: "8px",
            background: "none",
          }}
          onClick={onClose}
        >
          <Close />
        </IconButton>
        <Box sx={{ padding: "30px" }}>
          <Typography
            sx={{
              fontSize: isMobile ? "17px" : "18px",
              fontWeight: "bold",
              my: "10px",
              color: "#707070",
              textAlign: "center",
            }}
          >
            {t("Enter a title for your live stream")}
          </Typography>
          <Input
            placeholder={t("Title")}
            sx={{
              width: "100%",
              padding: "5px 15px",
              fontSize: "16px",
              borderRadius: "20px",
              color: "#707070",
              mb: "10px",
              border: "none",
              boxShadow: "1px 3px 6px 0px #707070",
              outline: "none",
              "&::before, &::after": {
                border: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                border: "none",
              },
            }}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Typography
            sx={{
              fontSize: "18px",
              margin: "10px 0",
              fontWeight: "bold",
              color: "#707070",
              textAlign: isMobile ? "center" : undefined,
            }}
          >
            {t("Live stream type")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "30px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                flex: "1 1 50%",
                backgroundColor: "#f7f7f7",
              }}
            >
              <img src={socialImg} alt="public" />
              <Typography sx={{ color: "#707070" }}>{t("Public")}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ padding: "15px 30px 30px 30px", textAlign: "center" }}>
          <Button
            // onClick={createBroadcast}
            sx={{
              background: "#f25f0c",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              width: isMobile ? "90%" : "200px",
              justifyContent: "center",
              padding: " 7px 10px",
              borderRadius: "20px",
              margin: "0 auto",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "#fabf9e",
              },
            }}
          >
            <Typography sx={{ marginLeft: "5px", fontWeight: "bold" }}>
              {t("Let's go")}
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddLiveModal;
