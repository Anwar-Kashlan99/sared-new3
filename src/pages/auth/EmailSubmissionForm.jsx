import { useNavigate } from "react-router-dom";
import avatar from "../../assets/profile.png";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import authImg from "../../assets/authImg.png";
import { useTranslation } from "react-i18next";
import { useGetUserByEmailQuery } from "../../store/authSlice";
import { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";

const emailSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email(),
});

const initialValues = {
  email: "",
};

const EmailSubmissionForm = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [emailToFetch, setEmailToFetch] = useState("");

  const {
    data: userDetails,
    error,
    isLoading,
    isFetching,
  } = useGetUserByEmailQuery(emailToFetch, {
    skip: emailToFetch === "", // Only run the query if emailToFetch is not empty
  });
  const handleFormSubmit = (values, { setSubmitting }) => {
    setEmailToFetch(values.email); // Set email to fetch data
    setSubmitting(false);
  };

  useEffect(() => {
    if (userDetails && !isFetching) {
      navigate("/login/password", { state: { userDetails } });
    }
    if (error) {
      toast.error(error.data?.message || t("Failed to fetch user details."));
    }
  }, [userDetails, isFetching, error, navigate, t]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${authImg})`,
        backgroundSize: isMobile ? "cover" : "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          zIndex: "1",
          backgroundColor: "#00000026",
        }}
      />
      <Toaster position="top-center" reverseOrder={false} />
      <Box
        sx={{
          width: isMobile ? "90%" : { sm: "78%", md: "62%", lg: "32%" },
          m: isMobile ? "4.5rem auto 1rem" : "2rem auto",
          backgroundColor: "#ffffff8f",
          borderRadius: "20px",
          padding: "1rem",
          zIndex: "2",
          boxShadow: "4px 6px 7px 0px #707070",
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
                sx={{ fontWeight: "bold", fontSize: "22px", color: "#fff" }}
              >
                {t("Welcome To SRD")}
              </Typography>
            </Box>
            <Formik
              initialValues={initialValues}
              validationSchema={emailSchema}
              onSubmit={handleFormSubmit}
            >
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
                    borderRadius: "50%",
                    mb: "25px",
                  }}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: isMobile ? "center" : "start",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "",
                      columnGap: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: "8px",
                    }}
                  >
                    <Field
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Email"
                      style={{
                        width: isMobile ? "175px" : "260px",
                        padding: "13px 20px",
                        borderRadius: "25px",
                        fontSize: "16px",
                        border: "none",
                        boxShadow: "4px 6px 7px 0px #707070",
                        outline: "none",
                        marginBottom: isMobile ? "15px" : "",
                      }}
                    />
                    <Button
                      type="submit"
                      sx={{
                        color: "#fff",
                        p: "7px 20px",
                        fontSize: "16px",
                        borderRadius: "20px",
                        boxShadow: "2px 6px 7px 0px #707070",
                        backgroundColor: isFetching ? "#ff9d66" : "#f25f0c",
                        "&:hover": {
                          backgroundColor: "#f57f3d",
                        },
                      }}
                      disabled={isLoading}
                    >
                      {isFetching ? (
                        <Bars
                          height="27"
                          width="45"
                          color="#f25f0c"
                          ariaLabel="bars-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                        />
                      ) : (
                        t("Next")
                      )}
                    </Button>
                  </Box>
                  <ErrorMessage
                    style={{
                      color: "red",
                      fontSize: "14px",
                      marginTop: "5px",
                      marginLeft: "5px",
                    }}
                    name="userName"
                    component="div"
                  />
                </Box>
              </Form>
            </Formik>
            <Box sx={{ marginLeft: "4px", marginTop: "10px" }}>
              <span style={{ color: "#fff" }}>
                {t("Don't have an account?")}{" "}
                <span
                  style={{
                    color: "#f25f0c",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#f57f3d",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate("/register")}
                >
                  {t("Register Now")}
                </span>
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailSubmissionForm;
