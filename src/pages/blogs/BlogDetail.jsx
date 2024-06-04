import {
  Avatar,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/Loader";
import blogImg from "../../assets/blogImg.png";
import { useTranslation } from "react-i18next";
import {
  Bookmark,
  Close,
  Edit,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreVert,
  Share,
} from "@mui/icons-material";
import { FacebookIcon, TelegramIcon, WhatsappIcon, XIcon } from "react-share";
import gmail from "../../assets/gmail.png";
import facebook from "../../assets/facebook.png";
import youtube from "../../assets/youtube.png";
import commentIcon from "../../assets/commentimg.png";
import FavoriteImg from "../../assets/FavoriteImg.png";
import EmojiPicker from "emoji-picker-react";
import backImg from "../../assets/blogback.png";
import backImg2 from "../../assets/blogback2.png";
import CommentContainer from "../../components/CommentContainer";
import { SharePopup } from "../../components/SharePopup";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorMenuBar from "./EditorMenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { editBlog } from "../../store/blogSlice";
import { useDispatch } from "react-redux";
import blogimg from "../../assets/data/blog/mohammed habash.jpg";
import blogeCover from "../../assets/data/blog/mohammed habash cover.jpg";

const BlogDetail = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [blog, setBlog] = useState(null);

  // Save blog

  const [isSaved, setIsSaved] = useState(false);

  const saveBlog = () => {
    setIsSaved((prev) => !prev);
  };

  // Handle Like

  const [isLiked, setIsLiked] = useState(false);

  const likedBlog = () => {
    setIsLiked((prev) => !prev);
  };

  // handle comments
  const [willComment, setWillComment] = useState(false);

  const commentBlog = () => {
    setWillComment((prev) => !prev);
  };
  // for Sharing
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleShareClick = () => {
    setShowSharePopup(!showSharePopup);
  };

  // handleFollow
  const handleFollow = () => {};

  // handle Edit
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState(blog?.title);
  const [titleError, setTitleError] = useState("");
  const [tempTitle, setTempTitle] = useState(title);

  const [content, setContent] = useState(blog?.content);
  const [contentError, setContentError] = useState("");
  const [tempContent, setTempContent] = useState(content);

  const [selectedImage, setSelectedImage] = useState(blog?.img || blogeCover);
  const [temporaryImage, setTemporaryImage] = useState(blog?.img || blogeCover);

  const handleIsEditable = (bool) => {
    setIsEditable(bool);
    editor?.setEditable(bool);
  };
  const handleOnChangeTitle = (e) => {
    if (title) setTitleError("");
    setTitle(e.target.value);
  };

  const handleOnChangeContent = ({ editor }) => {
    if (!editor.isEmpty) setContentError("");
    setContent(editor.getHTML());
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    onUpdate: handleOnChangeContent,
    editorProps: {
      attributes: {
        class: "editor",
      },
    },
    // content: content,
    content:
      "خلينا نتفق بداية أن التسويق نشاط موجود من قديم الزمان، من حضارات الفراعنة وقبلها، والمبادئ العامة ما اختلفت عن اليوم، واستخدمه الكتيرين من شخصيات وحضارات وحتى جهات غير ربحية.المفهوم الواسع للتسويق يعني الاتصال مع الجمهور للتأثير فيه لعمل سلوك ما.فينك تطبقه على كتير مجالات حتى غير ربحية مثل فريق كرة سلة يأثر بالجمهور ليشجعه (حتى لو ما حضر بالملعب) أو ميتم أطفال يأثر بالجمهور ليتبرع أو يرسم البسمة على وجه الأطفال.لكن هاد مابيعني أن هالجهات ما تتعلم أو تطبق قوانين التسويق العلمية الصحيحة، لأن بدونها بكون نشاطها فوضوي عشوائي غير مدروس لن يحقق لها النتيجة المطلوبة.واليوم السوشيل ميديا ساعدت كتير جهات تسوق أنشطتها غير الربحية بفعالية أكبر، ومع قرب انتهاء شهر رمضان بترفع الجمعيات الخيرية وتيرة رسائلها التسويقية للتبرع ودفع الزكاة عن طريقها.لو كنت مسؤول عن صنع المحتوى التسويقي بإحدى المبادرات غير الربحية الخيرية (مهما كان نشاطها)، تواصل معي عبر رسائل الصفحة لتحصل على الدعم المناسب لشغلك",
    editable: isEditable,
  });

  const handleEnableEdit = () => {
    setAnchorEl(null);
    handleIsEditable(!isEditable);
    setTempTitle(title);
    setTempContent(editor?.getHTML() || "");
    setTemporaryImage(selectedImage);
  };

  const handleCancelEdit = () => {
    handleIsEditable(!isEditable);
    setTitle(tempTitle);
    setSelectedImage(temporaryImage);
    editor?.commands.setContent(tempContent);
    setSelectedImage(temporaryImage);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;
      setSelectedImage(image);
      setTemporaryImage(image);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    // Construct the image object correctly depending on how it's stored
    // const imageFile = selectedImage instanceof File ? selectedImage : null;
    // dispatch(
    //   editBlog({
    //     blogId: blog.id,
    //     title: title,
    //     content: content,
    //     image: imageFile,
    //   })
    // );
  };

  // Handle delete

  const handleDelete = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: isMobile ? "none" : "block" }}>
        <img
          alt="backgroungImg"
          src={backImg}
          style={{ position: "absolute", zIndex: "-2", top: "0", left: "0" }}
        />
        <img
          alt="backgroungImg2"
          src={backImg2}
          style={{
            zIndex: "-1",
            position: "absolute",
            width: "300px",
            right: "-150px",
            top: "450px",
          }}
        />
      </Box>
      <Toaster position="top-center" reverseOrder={false} />
      <Box
        sx={{
          width: isMobile ? "95%" : "90%",
          m: isMobile ? "6rem auto 3rem" : "5.5rem auto 5rem",
          padding: "1rem",
        }}
      >
        {!isMobile && (
          <Box sx={{ textAlign: "right" }}>
            {isEditable ? (
              <IconButton onClick={handleCancelEdit}>
                <Close sx={{ color: "#f25f0c" }} />
              </IconButton>
            ) : (
              <IconButton onClick={handleMenuOpen}>
                <MoreVert sx={{ color: "#f25f0c" }} />
              </IconButton>
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{ zIndex: "999999999", ml: "-50px", mt: "-10px" }}
            >
              <MenuItem onClick={handleEnableEdit}>
                <Typography sx={{ color: "#000", fontSize: "17px" }}>
                  {t("Edit")}
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleDelete}>
                <Typography sx={{ color: "#000", fontSize: "17px" }}>
                  {t("Delete")}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : "900px",
              mb: "15px",
              position: "relative",
            }}
          >
            {isEditable ? (
              <label
                htmlFor="image"
                style={{ cursor: isEditable ? "pointer" : undefined }}
              >
                <input
                  type="file"
                  style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <img
                  alt={blog?.title || "blogImg"}
                  src={selectedImage}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "20px",
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
              </label>
            ) : (
              <>
                <img
                  alt={blog?.title || "blogImg"}
                  src={selectedImage}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "20px",
                  }}
                />
              </>
            )}
          </Box>
          {isEditable ? (
            <Box sx={{ width: isMobile ? "90%" : "30%", mb: "10px" }}>
              <textarea
                style={{
                  borderRadius: "10px",
                  width: "100%",
                  padding: "14px 20px",
                  height: "50px",
                  fontSize: "16px",

                  outline: "none",
                  backgroundColor: "#ffffff60",

                  border: "none",

                  boxShadow: "1px 4px 7px 0px #707070",
                }}
                placeholder="Title"
                onChange={handleOnChangeTitle}
                value={title}
              />
              {titleError && (
                <Typography sx={{ mt: "8px", fontSize: "15px", color: "red" }}>
                  {titleError}
                </Typography>
              )}
            </Box>
          ) : (
            <Box>
              <Typography
                sx={{
                  color: "#f25f0c",
                  fontSize: "34px",
                  fontWeight: "bold",
                  mb: "25px",
                }}
              >
                {blog?.title || "التسويق غير الربحي"}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              width: isMobile ? "100%" : "80%",
              display: "flex",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mb: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "15px",
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : undefined,
                mb: isMobile ? "15px" : undefined,
              }}
            >
              <Avatar
                sx={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                }}
                src={blogimg}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  ml: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#f25f0c",
                    fontSize: "17px",
                    mb: "5px",
                  }}
                >
                  Mohammad Habash
                </Typography>
                <Button
                  variant="text"
                  sx={{
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px #3cb02f60",
                    color: "#3CB02F",
                    fontWeight: "bold",
                    padding: "5px 18px",
                    "&:hover": {
                      backgroundColor: "#3cb02f1c",
                    },
                  }}
                  onClick={handleFollow}
                >
                  {t("follow")}
                </Button>
              </Box>
              {isMobile && (
                <Box sx={{ textAlign: "right" }}>
                  {isEditable ? (
                    <IconButton onClick={handleCancelEdit}>
                      <Close sx={{ color: "#f25f0c" }} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleMenuOpen}>
                      <MoreVert sx={{ color: "#f25f0c" }} />
                    </IconButton>
                  )}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    sx={{ zIndex: "999999999" }}
                  >
                    <MenuItem onClick={handleEnableEdit}>
                      <Typography sx={{ color: "#000", fontSize: "17px" }}>
                        {t("Edit")}
                      </Typography>
                    </MenuItem>

                    <MenuItem onClick={handleDelete}>
                      <Typography sx={{ color: "#000", fontSize: "17px" }}>
                        {t("Delete")}
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              maxWidth: "100%",
              width: isMobile ? "100%" : "80%",
              mx: "auto",
              backgroundColor: "#ffffff60",
              boxShadow: "1px 4px 7px 0px #707070",
              p: isMobile ? "14px 10px" : "20px 30px",
              borderRadius: "10px",
            }}
          >
            {isEditable && (
              <Fragment>
                <EditorMenuBar editor={editor} />
                <hr />
              </Fragment>
            )}
            <EditorContent editor={editor} id="blogTextContent" />

            {/* {contentError && <p className="mt-1 text-wh-900">{contentError}</p>}*/}
          </Box>
          {isEditable && (
            <Box
              sx={{
                width: "70%",
                display: "flex",
                justifyContent: "flex-end",
                mt: "20px",
              }}
            >
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
                onClick={handleSaveEdit}
              >
                {t("Save")}
              </Button>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: "25px",
              mb: "15px",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: "8px",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  mr: "5px",
                }}
              >
                <IconButton onClick={handleShareClick}>
                  <Share
                    sx={{
                      fontSize: "35px",
                      color: "#f25f0c",
                    }}
                  />
                </IconButton>

                {showSharePopup && <SharePopup title={""} left={"-120px"} />}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "10px",
                }}
              >
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <XIcon size={32} round />
                </a>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TelegramIcon size={32} round />
                </a>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="facebook"
                    src={facebook}
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                  />
                </a>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon size={32} style={{ borderRadius: "10px" }} />
                </a>{" "}
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="youtube"
                    src={youtube}
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                  />
                </a>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="gmail"
                    src={gmail}
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                  />
                </a>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                columnGap: "20px",
              }}
            >
              <Typography>{blog?.time || "12.00 AM"}</Typography>
              <Typography>{blog?.date || "21/3/2024 AM"}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#ebebeb",
              width: isMobile ? "95%" : "85%",
              px: "10px",
              mb: "40px",
              position: "relative",
            }}
          >
            {!isMobile && (
              <img
                alt="favoriteimg"
                src={FavoriteImg}
                style={{
                  position: "absolute",
                  top: "-55px",
                  right: "0",
                  width: "90px",
                }}
              />
            )}
            <IconButton onClick={saveBlog}>
              <Bookmark
                sx={{
                  fontSize: "40px",
                  color: isSaved ? "#f25f0c" : undefined,
                }}
              />
            </IconButton>
            <IconButton onClick={commentBlog}>
              <img
                alt="commentIcon"
                src={commentIcon}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />
            </IconButton>
            <IconButton onClick={likedBlog}>
              {isLiked ? (
                <FavoriteOutlined sx={{ fontSize: "40px", color: "#F74B4B" }} />
              ) : (
                <FavoriteBorderOutlined sx={{ fontSize: "40px" }} />
              )}
            </IconButton>
          </Box>

          <CommentContainer willComment={willComment} />
        </Box>
      </Box>
    </Box>
  );
};

export default BlogDetail;
