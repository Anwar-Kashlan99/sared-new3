import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import authImg from "../../assets/authImg.png";
import { useTranslation } from "react-i18next";
import {
  useGenerateOTPMutation,
  useVerifyOTPMutation,
} from "../../store/authSlice";
import { Bars } from "react-loader-spinner";

export default function VerifyOtp() {
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [verifyOTP] = useVerifyOTPMutation();
  const [generateOTP, { isLoading: isResending }] = useGenerateOTPMutation();
  const email = location.state?.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (OTP.length === 6) {
      try {
        await verifyOTP({ email, otp: OTP }).unwrap();

        const redirectPath =
          location.state?.operationContext === "register" ? "/login" : "/reset";
        navigate(redirectPath);
        toast.success(t("OTP verified successfully!"));
      } catch (error) {
        toast.error(t("OTP verification failed."));
      }
    } else {
      toast.error(t("Please enter a valid 6-digit OTP."));
    }
  };

  const resendOTP = async () => {
    try {
      await generateOTP(email).unwrap();
      toast.success(t("OTP has been resent to your email."));
    } catch (error) {
      toast.error(t("Failed to resend OTP."));
    }
  };

  const isMobile = useMediaQuery("(max-width: 768px)");
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
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              m: "10px 0 25px",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}
            >
              {t("Recover Password")}
            </Typography>
          </Box>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onSubmit={handleSubmit}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "20px",
                mb: "18px",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ marginBottom: "15px", color: "#fff" }}>
                  {t("Enter 6 digit OTP sent to your Email")}
                </Typography>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP Here"
                  style={{
                    width: isMobile ? "90%" : "300px",
                    padding: "13px 20px",
                    fontSize: "16px",
                    borderRadius: "20px",
                    color: "#707070",
                    border: "none",
                    boxShadow: "4px 6px 7px 0px #707070",
                    outline: "none",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                />
              </Box>

              <Button
                sx={{
                  color: "#fff",
                  p: "7px 20px",
                  borderRadius: "20px",
                  boxShadow: "2px 6px 7px 0px #707070",
                  marginBottom: "5px",
                  fontSize: "16px",
                  backgroundColor: isResending ? "#ff9d66" : "#f25f0c",
                  "&:hover": {
                    backgroundColor: "#f57f3d",
                  },
                }}
                type="submit"
                disabled={isResending}
              >
                {isResending ? (
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
                  t("Verify")
                )}
              </Button>
            </Box>
          </form>
          <Box sx={{ marginLeft: "4px" }}>
            <span style={{ color: "#fff" }}>
              {t("Can't get OTP?")}{" "}
              <span
                style={{
                  color: "#f25f0c",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#f57f3d",
                  },
                }}
                onClick={resendOTP}
              >
                {t("Resend")}
              </span>
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
