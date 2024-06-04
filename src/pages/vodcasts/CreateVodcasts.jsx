import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  useMediaQuery,
} from "@mui/material";
import vodcastimg from "../../assets/vodcastimag.png";
import vodcastimg2 from "../../assets/vodcastimg2.jpg";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { CloudUploadOutlined, Edit } from "@mui/icons-material";
import instaIcon from "../../assets/instaicon.png";
import facebookIcon from "../../assets/facebookicon.png";
import xIcon from "../../assets/xicon.png";
import telegramIcon from "../../assets/telegramIcon.png";
import gmailIcon from "../../assets/gmailicon.png";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("description is required"),
  instalink: Yup.string(),
  facebooklink: Yup.string(),
  xlink: Yup.string(),
  gmillink: Yup.string(),
  telegramlink: Yup.string(),
  playlistOption: Yup.string().required("Playlist option is required"),
  existingPlaylist: Yup.string(),
  newPlaylistName: Yup.string()
    .required("Playlist name is required")
    .trim()
    .min(1, "Playlist name cannot be empty")
    .matches(/\S/, "Playlist name cannot contain only whitespace"),
});

const initialValues = {
  title: "",
  instalink: "",
  facebooklink: "",
  xlink: "",
  gmillink: "",
  telegramlink: "",
  description: "",
  playlistOption: "existing",
  newPlaylistName: "",
  playlistcover: null,
};
const existingPlaylists = [
  { id: 1, title: "Playlist 1" },
  { id: 2, title: "Playlist 2" },
  { id: 3, title: "Playlist 3" },
];

const CreateVodcast = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width: 1600px)");
  const { t } = useTranslation();
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDuration, setVideoDuration] = useState("00:00:00");
  const [imageName, setImageName] = useState("");
  const videoRef = useRef(null);

  const handlePlaylistImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setImageName(file.name); // Set the name of the selected image
      setFieldValue("playlistimage", file); // Set the image file in Formik's values
    }
  };
  const [selectedPlaylistOption, setSelectedPlaylistOption] =
    useState("existing");
  const handlePlaylistOptionChange = (event) => {
    setSelectedPlaylistOption(event.target.value);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setVideoFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const formattedDuration = formatDuration(duration);
      setVideoDuration(formattedDuration);
    }
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    // try {
    //   if (!videoFile) {
    //     toast.error("Please select a video file.");
    //     return;
    //   }
    //   const token = localStorage.getItem("token");
    //   const vodcastCreatedAt = new Date().toISOString();
    //   const formData = new FormData();
    //   formData.append("title", values.title);
    //   formData.append("instalink", values.instalink);
    //   formData.append("facebooklink", values.facebooklink);
    //   formData.append("xlink", values.xlink);
    //   formData.append("gmillink", values.gmillink);
    //   formData.append("telegramlink", values.telegramlink);
    //   formData.append("description", values.description);
    //   formData.append("video", videoFile);
    //   formData.append("vodcastCreatedAt", vodcastCreatedAt); // Include podcast created at timestamp
    //   if (values.playlistOption === "new") {
    //     // Capture current timestamp for playlist
    //     const playlistCreatedAt = new Date().toISOString();
    //     formData.append("newPlaylistName", values.newPlaylistName);
    //     formData.append("playlistCreatedAt", playlistCreatedAt); // Include playlist created at timestamp
    //     formData.append("playlistcover", values.playlistcover);
    //   } else {
    //     formData.append("existingPlaylist", values.existingPlaylist);
    //   }
    //     const response = await api.post("/api/vodcasts", formData, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //     console.log("Vodcast created:", response.data);
    //   toast.success("Vodcast created successfully!");
    // } catch (error) {
    //   console.error("Error creating vodcast:", error);
    //   toast.error("Failed to create vodcast. Please try again.");
    // } finally {
    //   setSubmitting(false);
    // }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${vodcastimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Box
        sx={{
          width: isMobile ? "95%" : "80%",
          m: isMobile ? "5rem auto 3rem" : "4.5rem auto 2rem",
          padding: "1rem",
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: isMobile ? "center" : "space-between",
                  alignItems: "center",
                  mb: isMobile ? undefined : "20px",
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <label htmlFor="video">
                    <input
                      type="file"
                      accept="video/*"
                      id="video"
                      name="video"
                      onChange={handleVideoChange}
                      required
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                    />
                    {videoPreview && (
                      <Box
                        sx={{
                          borderRadius: "30px",
                          position: "relative",
                          width: isBigScreen
                            ? "700px"
                            : isMobile
                            ? "100%"
                            : "600px",
                          height: isBigScreen
                            ? "470px"
                            : isMobile
                            ? "300px"
                            : "400px",
                          mb: !isBigScreen ? "15px" : undefined,
                        }}
                      >
                        <video
                          ref={videoRef}
                          src={videoPreview}
                          onLoadedData={handleVideoLoaded}
                          onContextMenu={handleContextMenu}
                          controls
                          controlsList="nodownload"
                          style={{
                            border: "5px solid #f25f0c",
                            height: "100%",
                            width: "100%",
                            borderRadius: "30px",
                            cursor: "pointer",
                            objectFit: "cover",
                          }}
                        >
                          <source src={videoPreview} type="video/mp4" />
                        </video>

                        <Box
                          sx={{
                            width: "65px",
                            height: "65px",
                            borderRadius: "50%",
                            backgroundColor: "#707070",
                            position: "absolute",
                            top: "25px",
                            right: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Edit sx={{ fontSize: "45px", color: "#fff" }} />
                        </Box>
                      </Box>
                    )}
                    {!videoPreview && (
                      <Box
                        sx={{
                          borderRadius: "30px",
                          position: "relative",
                          width: isBigScreen
                            ? "700px"
                            : isMobile
                            ? "100%"
                            : "600px",
                          height: isBigScreen
                            ? "470px"
                            : isMobile
                            ? "300px"
                            : "400px",
                          mb: !isBigScreen ? "15px" : undefined,
                        }}
                      >
                        <img
                          src={vodcastimg2} // Replace with the path to your placeholder image
                          alt="PlaceholderImagesup"
                          style={{
                            width: "100%",
                            borderRadius: "30px",
                            border: "5px solid #f25f0c",
                            cursor: "pointer",
                            objectFit: "cover",
                            height: "100%",
                          }}
                        />
                        <Box
                          sx={{
                            width: "65px",
                            height: "65px",
                            borderRadius: "50%",
                            backgroundColor: "#707070",
                            position: "absolute",
                            top: "25px",
                            right: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Edit sx={{ fontSize: "45px", color: "#fff" }} />
                        </Box>
                      </Box>
                    )}
                  </label>
                </Box>
                <Box>
                  <Box
                    sx={{
                      mb: "12px",
                    }}
                  >
                    <Field
                      placeholder={t("Title")}
                      type="text"
                      id="title"
                      name="title"
                      style={{
                        width: isBigScreen
                          ? "500px"
                          : isMobile
                          ? "100%"
                          : "400px",
                        padding: "14px 20px",
                        fontSize: "17px",
                        borderRadius: "8px",
                        border: "none",
                        marginBottom: "5px",
                        boxShadow: "1px 4px 7px 0px #707070",
                        outline: "none",

                        "&::before, &::after": {
                          border: "none",
                        },
                        "&:hover:not(.MuiDisabled):before": {
                          border: "none",
                        },
                      }}
                    />
                    <ErrorMessage
                      style={{ color: "red" }}
                      name="title"
                      component="div"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: isMobile ? "block" : "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: isMobile ? undefined : "12px",
                    }}
                  >
                    <label htmlFor="video">
                      <input
                        type="file"
                        accept="video/*"
                        id="video"
                        name="video"
                        onChange={handleVideoChange}
                        required
                        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                      />
                      <Box
                        sx={{
                          width: isBigScreen
                            ? "240px"
                            : isMobile
                            ? "100%"
                            : "190px",
                          padding: "11px 20px",
                          fontSize: "17px",
                          color: "#707070",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border: "none",
                          position: "relative",
                          marginBottom: isMobile ? "10px" : "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&&:hover:not(.MuiDisabled):before": {
                            border: "none",
                          },
                        }}
                      >
                        <span>
                          {videoDuration && videoFile
                            ? videoDuration
                            : "00:00:00"}
                        </span>
                        <CloudUploadOutlined
                          sx={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#f25f0c",
                          }}
                        />
                      </Box>
                    </label>

                    <Box sx={{ position: "relative" }}>
                      <Field
                        type="text"
                        placeholder={t("Add a link")}
                        id="instalink"
                        name="instalink"
                        style={{
                          width: isBigScreen
                            ? "240px"
                            : isMobile
                            ? "100%"
                            : "190px",
                          padding: "14px 20px 14px 50px",
                          fontSize: "17px",
                          borderRadius: "8px",
                          border: "none",
                          marginBottom: isMobile ? "10px" : "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&:hover:not(.MuiDisabled):before": {
                            border: "none",
                          },
                        }}
                      />
                      <img
                        alt="intaicon"
                        src={instaIcon}
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-55%)",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: isMobile ? "block" : "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: isMobile ? undefined : "12px",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Field
                        type="text"
                        placeholder={t("Add a link")}
                        id="facebooklink"
                        name="facebooklink"
                        style={{
                          width: isBigScreen
                            ? "240px"
                            : isMobile
                            ? "100%"
                            : "190px",
                          padding: "14px 20px 14px 50px",
                          fontSize: "17px",
                          borderRadius: "8px",
                          border: "none",
                          marginBottom: isMobile ? "10px" : "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&:hover:not(.MuiDisabled):before": {
                            border: "none",
                          },
                        }}
                      />
                      <img
                        alt="facebook"
                        src={facebookIcon}
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-55%)",
                        }}
                      />
                    </Box>
                    <Box sx={{ position: "relative" }}>
                      <Field
                        type="text"
                        placeholder={t("Add a link")}
                        id="xlink"
                        name="xlink"
                        style={{
                          width: isBigScreen
                            ? "240px"
                            : isMobile
                            ? "100%"
                            : "190px",
                          padding: "14px 20px 14px 50px",
                          fontSize: "17px",
                          borderRadius: "8px",
                          border: "none",
                          marginBottom: isMobile ? "10px" : "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&:hover:not(.MuiDisabled):before": {
                            border: "none",
                          },
                        }}
                      />
                      <img
                        alt="x"
                        src={xIcon}
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-55%)",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: isMobile ? "block" : "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: "12px",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Field
                        type="text"
                        placeholder={t("Add a link")}
                        id="gmillink"
                        name="gmillink"
                        style={{
                          width: isBigScreen
                            ? "240px"
                            : isMobile
                            ? "100%"
                            : "190px",
                          padding: "14px 20px 14px 50px",
                          fontSize: "17px",
                          borderRadius: "8px",
                          border: "none",
                          marginBottom: isMobile ? "10px" : "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&:hover:not(.MuiDisabled):before": {
                            border: "none",
                          },
                        }}
                      />
                      <img
                        alt="gmailIcon"
                        src={gmailIcon}
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-55%)",
                        }}
                      />
                    </Box>
                    <Box sx={{ position: "relative" }}>
                      <Field
                        type="text"
                        placeholder={t("Add a link")}
                        id="telegramlink"
                        name="telegramlink"
                        style={{
                          width: isBigScreen
                            ? "240px"
                            : isMobile
                            ? "100%"
                            : "190px",
                          padding: "14px 20px 14px 50px",
                          fontSize: "17px",
                          borderRadius: "8px",
                          border: "none",
                          marginBottom: isMobile ? "10px" : "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&:hover:not(.MuiDisabled):before": {
                            border: "none",
                          },
                        }}
                      />
                      <img
                        alt="telegramIcon"
                        src={telegramIcon}
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          position: "absolute",
                          left: "8px",
                          top: "50%",
                          transform: "translateY(-55%)",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mb: "12px",
                    }}
                  >
                    <RadioGroup
                      aria-label="playlistOption"
                      name="playlistOption"
                      value={selectedPlaylistOption}
                      onChange={handlePlaylistOptionChange}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: isMobile ? "flex-start" : "center",

                          flexDirection: isMobile ? "column" : "row",
                          "& .css-j204z7-MuiFormControlLabel-root .MuiFormControlLabel-label":
                            {
                              fontSize: "17px",
                              fontWeight: "bold",
                            },
                        }}
                      >
                        <FormControlLabel
                          value="existing"
                          control={<Radio />}
                          label={t("Select from existing playlist")}
                        />
                        <FormControlLabel
                          value="new"
                          control={<Radio />}
                          label={t("Create new playlist")}
                        />
                      </Box>
                    </RadioGroup>
                  </Box>

                  {selectedPlaylistOption === "new" ? (
                    <Box
                      sx={{
                        display: isMobile ? "block" : "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: "12px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          rowGap: "5px",
                          marginBottom: isMobile ? "12px" : undefined,
                        }}
                      >
                        <Field
                          placeholder={t("Enter playlist name")}
                          type="text"
                          id="newPlaylistName"
                          name="newPlaylistName"
                          style={{
                            width: isBigScreen
                              ? "240px"
                              : isMobile
                              ? "100%"
                              : "190px",
                            padding: "14px 20px",
                            fontSize: "17px",
                            borderRadius: "8px",
                            border: "none",
                            marginBottom: isMobile ? "12px" : undefined,
                            boxShadow: "1px 4px 7px 0px #707070",
                            outline: "none",

                            "&::before, &::after": {
                              border: "none",
                            },
                            "&:hover:not(.MuiDisabled):before": {
                              border: "none",
                            },
                          }}
                        />
                        <ErrorMessage
                          style={{ color: "red" }}
                          name="newPlaylistName"
                          component="div"
                        />
                      </Box>
                      <label htmlFor="playlisimage">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center", // Align items vertically
                            width: isBigScreen
                              ? "240px"
                              : isMobile
                              ? "286px"
                              : "190px",
                            padding: "12px 35px 12px 20px",
                            fontSize: "17px",
                            borderRadius: "8px",
                            border: "none",
                            marginBottom: "5px",
                            cursor: "pointer",
                            boxShadow: "1px 4px 7px 0px #707070",
                            outline: "none",
                            backgroundColor: "#fff",
                            position: "relative",
                            overflow: "hidden", // Hide overflow text
                            textOverflow: "ellipsis", // Add ellipsis for overflow text
                            whiteSpace: "nowrap", // Prevent text from wrapping
                            "&::before, &::after": {
                              border: "none",
                            },
                            "&:hover:not(.MuiDisabled):before": {
                              border: "none",
                            },
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            id="playlisimage"
                            name="playlisimage"
                            onChange={(event) =>
                              handlePlaylistImageChange(event, setFieldValue)
                            }
                            style={{
                              opacity: 0,
                              position: "absolute",
                              zIndex: -1,
                            }}
                          />
                          <Box
                            sx={{
                              flex: "1", // Allow the text to take the available space
                              overflow: "hidden", // Hide overflow text
                              textOverflow: "ellipsis", // Add ellipsis for overflow text
                              whiteSpace: "nowrap", // Prevent text from wrapping
                            }}
                          >
                            {imageName ? (
                              <span>{imageName}</span>
                            ) : (
                              <span>{t("Upload Cover")}</span>
                            )}
                          </Box>
                          <CloudUploadOutlined
                            sx={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#f25f0c",
                            }}
                          />
                        </Box>
                      </label>
                    </Box>
                  ) : selectedPlaylistOption === "existing" ? (
                    <Box sx={{ mb: "12px" }}>
                      <Field
                        as="select"
                        id="existingPlaylist"
                        name="existingPlaylist"
                        style={{
                          width: isBigScreen
                            ? "500px"
                            : isMobile
                            ? "100%"
                            : "400px",
                          padding: "14px 20px",
                          fontSize: "17px",
                          borderRadius: "8px",
                          border: "none",
                          marginBottom: "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          outline: "none",
                        }}
                      >
                        {existingPlaylists.map((playlist) => (
                          <option key={playlist.id} value={playlist.id}>
                            {playlist.title}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        style={{ color: "red" }}
                        name="existingPlaylist"
                        component="div"
                      />
                    </Box>
                  ) : null}

                  {!isMobile && (
                    <Button
                      sx={{
                        width: isBigScreen
                          ? "500px"
                          : isMobile
                          ? "100%"
                          : "400px",
                        padding: "8px 15px",
                        backgroundColor: "#f25f0c",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          background: "#fff",
                          color: "#f25f0c",
                        },
                      }}
                      type="submit"
                      variant="outlined"
                      disabled={isSubmitting}
                    >
                      {t("Save")}
                    </Button>
                  )}
                </Box>
              </Box>
              <Box sx={{ mb: isMobile ? "5px" : undefined }}>
                <Field
                  placeholder={t("Type your description here")}
                  as="textarea"
                  id="description"
                  name="description"
                  style={{
                    width: "100%",
                    height: "250px",
                    padding: "14px 20px",
                    fontSize: "17px",
                    backgroundColor: "#ffffff60",
                    borderRadius: "15px",
                    border: "none",
                    marginBottom: "5px",
                    boxShadow: "1px 4px 7px 0px #707070",
                    outline: "none",

                    "&::before, &::after": {
                      border: "none",
                    },
                    "&:hover:not(.MuiDisabled):before": {
                      border: "none",
                    },
                  }}
                />
                <ErrorMessage
                  style={{
                    color: "red",
                  }}
                  name="description"
                  component="div"
                />
              </Box>
              {isMobile && (
                <Button
                  sx={{
                    width: isBigScreen ? "500px" : isMobile ? "100%" : "400px",
                    padding: "8px 15px",
                    backgroundColor: "#f25f0c",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      background: "#fff",
                      color: "#f25f0c",
                    },
                  }}
                  type="submit"
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  {t("Save")}
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreateVodcast;
