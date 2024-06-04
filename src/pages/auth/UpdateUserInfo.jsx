import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/profile.png";
import convertToBase64 from "./helper/convert";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import updateImg from "../../assets/updateInfoImg.jpg";
import { DeleteOutline } from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/authSlice";

const linkOptions = [
  "Facebook",
  "WhatsApp",
  "YouTube",
  "Instagram",
  "Gmail",
  "X",
];

export default function UpdateUserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const { userDetails } = useSelector((state) => state.user);
  const { t } = useTranslation();

  /** formik doensn't support file upload so we need to create this handler */
  const isMobile = useMediaQuery("(max-width: 768px)");
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  // handle links
  const [links, setLinks] = useState(userDetails?.links || []);

  const addLink = () => {
    if (links.length < linkOptions.length) {
      const newLinks = [...links, { title: "", url: "" }];
      setLinks(newLinks);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = links.map((link, idx) => {
      if (idx === index) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setLinks(newLinks);
  };
  const removeLink = (index) => {
    const newLinks = links.filter((_, idx) => idx !== index);
    setLinks(newLinks);
  };

  const getAvailableOptions = (selectedTitle) => {
    const selectedTitles = links
      .map((link) => link.title)
      .filter((title) => title);
    return linkOptions.filter(
      (option) => !selectedTitles.includes(option) || option === selectedTitle
    );
  };
  // const handleSubmit = async (values, { setSubmitting }) => {
  //   dispatch(updateUser({ ...values, avatar: file }))
  //     .unwrap()
  //     .then(() => {
  //       toast.success("Profile updated successfully!");
  //       navigate("/home");
  //     })
  //     .catch((error) => {
  //       toast.error(`Update failed: ${error.message || "Unknown error"}`);
  //     })
  //     .finally(() => setSubmitting(false));
  // };
  // const initialValues = {
  //   firstName: userDetails?.firstName || "",
  //   lastName: userDetails?.lastName || "",
  //   email: userDetails?.email || "",
  //   mobile: userDetails?.mobile || "",
  //   address: userDetails?.address || "",
  //   gender: userDetails?.gender || "",
  //   bio: userDetails?.bio || "",
  // };

  const updateSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    gender: Yup.string(),
    address: Yup.string(),
    bio: Yup.string(),
    email: Yup.string().email("Invalid email"),
    mobile: Yup.string()
      .matches(/^\d+$/, "Mobile must contain only digits")
      .min(10, "Mobile must be at least 10 digits")
      .max(15, "Mobile must not exceed 15 digits"),
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "flex-end", // Align to the right
        backgroundImage: `url(${updateImg})`,
        backgroundSize: isMobile ? "cover" : "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Box
        sx={{
          width: isMobile ? "90%" : { sm: "78%", md: "62%", lg: "40%" },
          margin: isMobile ? "6rem 1.5rem" : "6rem 2rem 2rem", // Adjust the margins
          backgroundColor: "#ffffff73",
          height: "fit-content",
          borderRadius: "20px",
          padding: "1rem",
          zIndex: "2",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                m: "10px 0 25px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: isMobile ? "22px" : "25px",
                  color: "#fff",
                }}
              >
                {t("Update User Information")}
              </Typography>
            </Box>
            <Formik
              // initialValues={initialValues}
              validationSchema={updateSchema}
              // onSubmit={handleSubmit}
            >
              {() => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "175px",
                      height: "175px",
                      borderRadius: "50%",
                      mb: "25px",
                    }}
                  >
                    <label htmlFor="profile">
                      <img
                        src={userDetails?.avatar || file || avatar}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          backdropFilter: "blur(7.1px)",
                          borderRadius: "50%",
                        }}
                        alt="avatar"
                      />
                    </label>
                    <input
                      onChange={onUpload}
                      id="profile"
                      name="profile"
                      type="file"
                      accept="image/*"
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: isMobile ? "column" : "row",
                        columnGap: isMobile ? "" : "10px",
                      }}
                    >
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        style={{
                          width: isMobile ? "100%" : "470px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                      <ErrorMessage
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "10px",
                          marginLeft: "5px",
                        }}
                        name="email"
                        component="div"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: isMobile ? "" : "10px",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <Field
                        type="text"
                        id="mobile"
                        name="mobile"
                        placeholder="Mobile"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                          color: "#707070",
                        }}
                      >
                        <option value="male">{t("Male")}</option>
                        <option value="female">{t("Female")}</option>
                      </Field>
                    </Box>
                    <ErrorMessage
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "10px",
                        marginLeft: "5px",
                        alignSelf: "flex-start",
                      }}
                      name="mobile"
                      component="div"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: isMobile ? "" : "10px",
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <Field
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Address"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />

                      <Field
                        type="text"
                        id="bio"
                        name="bio"
                        placeholder="BIO"
                        style={{
                          width: isMobile ? "100%" : "230px",
                          padding: "13px 20px",
                          fontSize: "16px",
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "4px 6px 7px 0px #707070",
                          outline: "none",
                          marginBottom: "15px",
                        }}
                      />
                    </Box>

                    <Box>
                      {links.map((link, index) => (
                        <Box key={index} sx={{ marginBottom: "15px" }}>
                          <FormControl fullWidth>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "baseline",

                                columnGap: isMobile ? "" : "10px",
                                flexDirection: isMobile ? "column" : "row",
                              }}
                            >
                              <Select
                                value={link.title}
                                size="small"
                                style={{
                                  width: isMobile ? "100%" : "160px",
                                  backgroundColor: "#fff",
                                  fontSize: "16px",
                                  padding: "3px 20px",
                                  borderRadius: "20px",
                                  border: "none",
                                  boxShadow: "4px 6px 7px 0px #707070",
                                  outline: "none",
                                  color: "#707070",
                                }}
                                onChange={(e) =>
                                  handleLinkChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                sx={{ mb: 1 }}
                              >
                                {getAvailableOptions(link.title).map(
                                  (option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                              <Box
                                key={index}
                                sx={{
                                  position: "relative",
                                }}
                              >
                                <Field
                                  type="text"
                                  name={`links[${index}].url`}
                                  placeholder="Enter a link"
                                  style={{
                                    width: isMobile ? "100%" : "300px",
                                    padding: "13px 20px",
                                    fontSize: "16px",
                                    borderRadius: "20px",
                                    border: "none",
                                    boxShadow: "4px 6px 7px 0px #707070",
                                    outline: "none",
                                  }}
                                  onChange={(e) =>
                                    handleLinkChange(
                                      index,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                />
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    right: "0",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                  }}
                                  onClick={() => removeLink(index)}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Box>
                            </Box>
                          </FormControl>
                        </Box>
                      ))}
                      {links.length < linkOptions.length && (
                        <Button
                          sx={{
                            color: "#FFF",
                            backgroundColor: "#f25f0c",
                            mb: "10px",
                            boxShadow: "1px 3px 7px 0px #707070",
                            borderRadius: "25px",
                            padding: "5px 15px",
                            marginLeft: links.length > 0 ? "10px" : "",
                          }}
                          onClick={addLink}
                        >
                          {t("Add Link")}
                        </Button>
                      )}
                    </Box>

                    <Button
                      sx={{
                        color: "#fff",
                        p: "7px 20px",
                        borderRadius: "20px",
                        fontSize: "16px",
                        boxShadow: "1px 3px 7px 0px #707070",
                        backgroundColor: "#f25f0c",
                        marginBottom: "20px",
                        "&:hover": {
                          backgroundColor: "#f57f3d",
                        },
                      }}
                      type="submit"
                    >
                      {t("Update")}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
