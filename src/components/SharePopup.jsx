import { ContentCopyOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

export const SharePopup = ({ title, left }) => {
  const urlToShare = window.location.href;

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
        toast.error("Failed to copy URL");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "10px",
        alignItems: "center",
        position: "absolute",
        top: "-50px",
        left: `${left}`,
        backgroundColor: "#0000005c",
        padding: "7px 12px",
        borderRadius: "30px",
      }}
    >
      <div className="Demo__some-network">
        <FacebookShareButton
          url={urlToShare}
          quote={"Visit us through this link"}
          hashtag="#muo"
          style={{ display: "flex" }}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <div>
          <FacebookShareCount url={urlToShare}>
            {(count) => count}
          </FacebookShareCount>
        </div>
      </div>

      <div className="Demo__some-network">
        <TwitterShareButton
          url={urlToShare}
          quote={"Visit us through this link"}
          hashtag="#muo"
          style={{ display: "flex" }}
          title={title}
          className="Demo__some-network__share-button"
        >
          <XIcon size={32} round />
        </TwitterShareButton>
      </div>

      <div className="Demo__some-network">
        <TelegramShareButton
          url={urlToShare}
          quote={"Visit us through this link"}
          hashtag="#muo"
          style={{ display: "flex" }}
          title={title}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </div>

      <div className="Demo__some-network">
        <WhatsappShareButton
          url={urlToShare}
          quote={"Visit us through this link"}
          hashtag="#muo"
          style={{ display: "flex" }}
          title={title}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>

      <ContentCopyOutlined
        sx={{ cursor: "pointer", color: "#f7f7f7" }}
        onClick={copyURL}
      />
    </Box>
  );
};
