import { Box, Button, useMediaQuery } from "@mui/material";
import blogImg from "../../assets/createblogimg.png";
import blogImg2 from "../../assets/createblogimg2.jpg";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Edit } from "@mui/icons-material";
import instaIcon from "../../assets/instaicon.png";
import facebookIcon from "../../assets/facebookicon.png";
import xIcon from "../../assets/xicon.png";
import telegramIcon from "../../assets/telegramIcon.png";
import gmailIcon from "../../assets/gmailicon.png";
import { useTranslation } from "react-i18next";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorMenuBar from "./EditorMenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Fragment } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createBlog } from "../../store/blogSlice";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  category: Yup.string().required("Category is required"),
  instalink: Yup.string(),
  facebooklink: Yup.string(),
  xlink: Yup.string(),
  gmillink: Yup.string(),
  telegramlink: Yup.string(),
});

const initialValues = {
  title: "",
  category: "technology",
  instalink: "",
  facebooklink: "",
  xlink: "",
  gmillink: "",
  telegramlink: "",
  image: null,
};

const CreateBlog = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width: 1600px)");

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.blog);
  const { t } = useTranslation();

  const categories = [
    { id: "technology", name: t("Technology") },
    { id: "sport", name: t("Sport") },
    { id: "psychology", name: t("Psychology") },
    { id: "philosophy", name: t("Philosophy") },
    { id: "business", name: t("Business") },
    { id: "art", name: t("Art") },
    { id: "fashion", name: t("Fashion") },
    { id: "foodsAndCooking", name: t("Foods and cooking") },
    { id: "music", name: t("Music") },
    { id: "science", name: t("Science") },
    { id: "education", name: t("Education") },
    { id: "health", name: t("Health") },
    { id: "design", name: t("Design") },
    { id: "movies", name: t("Movies") },
    { id: "languages", name: t("Languages") },
    { id: "other", name: t("Other") },
  ];

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const contentHTML = editor.getHTML();
    if (!contentHTML || contentHTML.trim() === "<p></p>") {
      setErrors({ content: "Content is required" });
      setSubmitting(false);
      return;
    }

    const blogData = { ...values, content: contentHTML };

    try {
      await dispatch(createBlog(blogData)).unwrap();
      setErrors({});
    } catch (error) {
      if (error.data && error.data.errors) {
        setErrors(error.data.errors);
      } else {
        setErrors({ _error: "An error occurred while creating the blog." });
      }
    }

    setSubmitting(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "editor",
      },
    },
    editable: true,
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${blogImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
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
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
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
                  <label htmlFor="image">
                    <input
                      type="file"
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }}
                    />
                    {values.image && (
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
                          src={URL.createObjectURL(values.image)}
                          alt="UploadedImage"
                          style={{
                            border: "5px solid #f25f0c",
                            height: "100%",
                            width: "100%",
                            borderRadius: "30px",
                            cursor: "pointer",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            width: "65px",
                            height: "65px",
                            borderRadius: "50%",
                            backgroundColor: "#707070",
                            position: "absolute",
                            bottom: "25px",
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
                    {!values.image && (
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
                          src={blogImg2} // Replace with the path to your placeholder image
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
                            bottom: "25px",
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
                      mb: "10px",
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
                  {/*<Box
                    sx={{
                      mb: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Field
                      placeholder={t("AI Text Generator")}
                      type="text"
                      id="aiText"
                      name="aiText"
                      style={{
                        width: isBigScreen
                          ? "440px"
                          : isMobile
                          ? "100%"
                          : "340px",
                        padding: "14px 20px",
                        fontSize: "17px",
                        borderRadius: "8px 0px 0px 8px",
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
                    <Box
                      sx={{
                        padding: "9px 20px",
                        backgroundColor: "#fff",
                        borderRadius: "0px 8px 8px 0px",
                        marginBottom: "5px",
                        boxShadow: "1px 4px 7px 0px #707070",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: "#f25f0c",
                          fontSize: "20px",
                        }}
                      >
                        AI
                      </Typography>
                    </Box>
                      </Box>*/}
                  <Box
                    sx={{
                      display: isMobile ? "block" : "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: isMobile ? undefined : "10px",
                    }}
                  >
                    <Box>
                      <Field
                        as="select"
                        id="category"
                        name="category"
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
                          marginBottom: isMobile ? "10px" : "5px",
                          boxShadow: "1px 4px 7px 0px #707070",
                          cursor: "pointer",
                          outline: "none",
                          "&::before, &::after": {
                            border: "none",
                          },
                          "&&:hover:not(.MuiDisabled):before": {
                            border: "none",
                          },
                        }}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
                    </Box>
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
                      mb: isMobile ? undefined : "10px",
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
                      mb: "10px",
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
              <Box
                sx={{
                  mb: isMobile ? "10px" : undefined,
                  width: "100%",
                  minHeight: "250px",
                  padding: "14px 20px",
                  fontSize: "17px",
                  backgroundColor: "#ffffff60",
                  borderRadius: "15px",
                  border: "none",
                  marginBottom: "5px",
                  boxShadow: "1px 4px 7px 0px #707070",
                }}
              >
                <Fragment>
                  <EditorMenuBar editor={editor} />

                  <hr />
                </Fragment>

                <EditorContent editor={editor} />
              </Box>
              {errors.content && (
                <Box sx={{ color: "red", mt: "10px" }}>{errors.content}</Box>
              )}
              {isMobile && (
                <Button
                  sx={{
                    width: isBigScreen ? "500px" : isMobile ? "100%" : "400px",
                    padding: "8px 15px",
                    mt: isMobile ? "10px" : undefined,
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

export default CreateBlog;
