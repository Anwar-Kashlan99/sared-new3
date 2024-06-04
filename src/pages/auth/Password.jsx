import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import avatar from "../../assets/profile.png";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import authImg from "../../assets/authImg.png";
import { useTranslation } from "react-i18next";
import {
  useGenerateOTPMutation,
  useLoginMutation,
} from "../../store/authSlice";
import { Bars } from "react-loader-spinner";

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

const initialValues = {
  password: "",
};

export default function Password() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state?.userDetails;
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const [generateOTP] = useGenerateOTPMutation();

  const handleSubmitPassword = async ({ password }) => {
    try {
      const loginResponse = await login({
        email: userDetails.email,
        password,
      }).unwrap();
      navigate("/home");
    } catch (error) {
      toast.error(t("Login failed."));
    }
  };
  const handlePasswordReset = async () => {
    try {
      await generateOTP(userDetails.email).unwrap();
      toast.success(t("OTP sent for password reset!"));
      navigate("/verify-otp", {
        state: { email: userDetails.email, operationContext: "resetPassword" },
      });
    } catch (error) {
      toast.error(t("Failed to send reset password OTP."));
    }
  };

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
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <Box
        sx={{
          width: isMobile ? "90%" : { sm: "78%", md: "62%", lg: "32%" },
          m: "2rem auto",
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
                sx={{ fontWeight: "bold", fontSize: "20px", color: "#707070" }}
              >
                {t("Hello")}
                {userDetails?.username}
              </Typography>
            </Box>
            <Formik
              initialValues={initialValues}
              validationSchema={passwordSchema}
              onSubmit={handleSubmitPassword}
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
                    src={userDetails?.profile || avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      backdropFilter: "blur(7.1px)",
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
                      type="password"
                      id="password"
                      name="password"
                      style={{
                        width: isMobile ? "175px" : "235px",
                        padding: "13px 20px",
                        fontSize: "16px",
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "4px 6px 7px 0px #707070",
                        outline: "none",
                        marginBottom: isMobile ? "15px" : "",
                      }}
                      placeholder="Password"
                    />

                    <Button
                      type="submit"
                      sx={{
                        color: "#fff",
                        p: "7px 20px",
                        borderRadius: "20px",
                        fontSize: "16px",
                        boxShadow: "2px 6px 7px 0px #707070",
                        backgroundColor: isLoading ? "#ff9d66" : "#f25f0c",
                        "&:hover": {
                          backgroundColor: "#f57f3d",
                        },
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
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
                        t("Sign In")
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
                    name="password"
                    component="div"
                  />
                </Box>
              </Form>
            </Formik>
            <Box sx={{ marginLeft: "4px", marginTop: "10px" }}>
              <span style={{ color: "#fff" }}>
                {t("Forgot Password?")}{" "}
                <span
                  style={{
                    color: "#f25f0c",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#f57f3d",
                    },
                  }}
                  onClick={() => handlePasswordReset()}
                >
                  {t("Recover Now")}
                </span>
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
