import React, { useCallback, useState } from "react";
import {
  AddLink,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  LinkOff,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  toggleButtonGroupClasses,
  useMediaQuery,
  Backdrop,
  TextField,
  Button,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.3),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: "1px solid transparent",
    },
}));

const LinkInputDialog = ({ open, handleClose, handleSave }) => {
  const [url, setUrl] = useState("");

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSaveClick = () => {
    handleSave(url);
    handleClose();
  };
  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "3" }}>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "fit-content",
          padding: "20px",
        }}
        onClick={handleClick}
      >
        <TextField
          label="URL"
          variant="outlined"
          fullWidth
          value={url}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button
          sx={{
            padding: "5px 15px",
            backgroundColor: "#f25f0c",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              background: "#fff",
              color: "#f25f0c",
            },
          }}
          variant="outlined"
          onClick={handleSaveClick}
        >
          Save
        </Button>
      </Paper>
    </Backdrop>
  );
};

const EditorMenuBar = ({ editor }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const handleLinkDialogOpen = () => {
    setLinkDialogOpen(true);
  };

  const handleLinkDialogClose = () => {
    setLinkDialogOpen(false);
  };

  const setLink = useCallback(
    (url) => {
      if (!url) {
        toast.error("Please enter a valid URL.");

        return;
      }

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        toast.error(
          "Please enter a valid external URL starting with 'http://' or 'https://'."
        );
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: "10px",
        width: "fit-content",
        borderRadius: "8px",
        mx: "auto",
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: "wrap",
        }}
      >
        <StyledToggleButtonGroup size="small" aria-label="text formatting">
          <ToggleButton
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            aria-label="left"
            value="left"
          >
            <FormatAlignLeft sx={{ fontSize: isMobile ? "17px" : undefined }} />
          </ToggleButton>
          <ToggleButton
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            aria-label="left"
            value="left"
          >
            <FormatAlignCenter
              sx={{ fontSize: isMobile ? "17px" : undefined }}
            />
          </ToggleButton>
          <ToggleButton
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            aria-label="left"
            value="left"
          >
            <FormatAlignRight
              sx={{ fontSize: isMobile ? "17px" : undefined }}
            />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

        <StyledToggleButtonGroup size="small" aria-label="text formatting">
          <ToggleButton
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            aria-label="bold"
            value="blod"
          >
            <FormatBold sx={{ fontSize: isMobile ? "17px" : undefined }} />
          </ToggleButton>
          <ToggleButton
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            aria-label="italic"
            value="italic"
          >
            <FormatItalic sx={{ fontSize: isMobile ? "17px" : undefined }} />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

        <StyledToggleButtonGroup size="small" aria-label="text link">
          <ToggleButton
            type="button"
            onClick={handleLinkDialogOpen}
            className={editor.isActive("link") ? "is-active" : ""}
            aria-label="link"
            value="link"
          >
            <AddLink sx={{ fontSize: isMobile ? "17px" : undefined }} />
          </ToggleButton>
          <ToggleButton
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            aria-label="unsetLink"
            value="unsetLink"
          >
            <LinkOff sx={{ fontSize: isMobile ? "17px" : undefined }} />
          </ToggleButton>
        </StyledToggleButtonGroup>
        {!isMobile && (
          <>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <StyledToggleButtonGroup
              size="small"
              exclusive
              aria-label="text size"
            >
              <Box>
                <ToggleButton
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  aria-label="h1"
                  value="h1"
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: isMobile ? "13px" : "18px",
                    }}
                  >
                    h<span style={{ fontSize: "13px" }}>1</span>
                  </Typography>
                </ToggleButton>

                <ToggleButton
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  aria-label="h2"
                  value="h2"
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: isMobile ? "13px" : "18px",
                    }}
                  >
                    h<span style={{ fontSize: "13px" }}>2</span>
                  </Typography>
                </ToggleButton>
              </Box>

              <ToggleButton
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                aria-label="h3"
                value="h3"
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "13px" : "18px",
                  }}
                >
                  h<span style={{ fontSize: "13px" }}>3</span>
                </Typography>
              </ToggleButton>

              <ToggleButton
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                aria-label="h4"
                value="h4"
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "13px" : "18px",
                  }}
                >
                  h<span style={{ fontSize: "13px" }}>4</span>
                </Typography>
              </ToggleButton>

              <ToggleButton
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
                aria-label="h5"
                value="h5"
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "13px" : "18px",
                  }}
                >
                  h<span style={{ fontSize: "13px" }}>5</span>
                </Typography>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </>
        )}
        <LinkInputDialog
          open={linkDialogOpen}
          handleClose={handleLinkDialogClose}
          handleSave={setLink}
        />
      </Paper>
    </Box>
  );
};

export default EditorMenuBar;
