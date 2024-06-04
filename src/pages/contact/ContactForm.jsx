import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Input,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { palette } = useTheme();
  const isMobile = useMediaQuery("(max-width: 620px)");

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e) => {
    console.log("~ e", e);
    const isValid = await trigger();
    if (!isValid) {
      e.preventDefault();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff4d",
        borderRadius: "20px",
        padding: "20px",
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <form
        target="_blank"
        onSubmit={onSubmit}
        action="https://formsubmit.co/fake-email@example.com"
        method="POST"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              mb: "10px",
              color: "#707070",
              fontSize: isMobile
                ? "22px"
                : { xs: "25px", sm: "28px", md: "32px" },
            }}
          >
            {t("Contact Us")}
          </Typography>

          <label
            style={{
              marginBottom: "3px",
            }}
          >
            {t("Enter your name")}
          </label>
          <Input
            sx={{
              mb: "15px",
              backgroundColor: "#fff",
              boxShadow: "4px 6px 14px 0px #707070",
              borderRadius: "20px",
              padding: "10px 18px",
              fontSize: "16px",
              border: "none",
              outline: "none",
              "&::before, &::after": {
                border: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                border: "none",
              },
            }}
            type="text"
            placeholder={t("User Name")}
            {...register("name", {
              required: true,
              maxLength: 100,
            })}
          />
          {errors.name && (
            <Typography sx={{ color: "red", mb: "3px", fontSize: "14px" }}>
              {errors.name.type === "required" &&
                `${t("This field is required.")}`}
              {errors.name.type === "maxLength" &&
                `${t("Max length is 100 char.")}`}
            </Typography>
          )}
          <label
            style={{
              marginBottom: "3px",
            }}
          >
            {t("Enter a valid email address")}
          </label>
          <Input
            placeholder={t("Email")}
            sx={{
              mb: "15px",
              backgroundColor: "#fff",
              boxShadow: "4px 6px 14px 0px #707070",
              borderRadius: "20px",
              padding: "10px 18px",
              fontSize: "16px",
              border: "none",
              outline: "none",
              "&::before, &::after": {
                border: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                border: "none",
              },
            }}
            {...register("email", {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
          />
          {errors.email && (
            <Typography sx={{ color: "red", mb: "3px", fontSize: "14px " }}>
              {errors.email.type === "required" &&
                `${t("This field is required.")}`}
              {errors.email.type === "pattern" &&
                `${t("Invalid email address.")}`}
            </Typography>
          )}
          <label
            style={{
              marginBottom: "3px",
            }}
          >
            {t("Enter your message")}
          </label>
          <Input
            placeholder={t("message")}
            sx={{
              mb: "15px",
              backgroundColor: "#fff",
              boxShadow: "4px 6px 14px 0px #707070",
              borderRadius: "20px",
              padding: "10px 18px",
              fontSize: "16px",
              border: "none",
              outline: "none",
              "&::before, &::after": {
                border: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                border: "none",
              },
            }}
            {...register("message", {
              required: true,
              maxLength: 2000,
            })}
          />
          {errors.message && (
            <Typography sx={{ color: "red", fontSize: "14px" }}>
              {errors.message.type === "required" &&
                `${t("This field is required.")}`}
              {errors.message.type === "maxLength" &&
                ` ${t("Max length is 2000 char.")}`}
            </Typography>
          )}
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Button
              size="large"
              type="submit"
              sx={{
                backgroundColor: palette.primary.main,
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "25px",
                p: "7px 60px",
                mt: isMobile ? "5px" : { xs: "8px", sm: "10px", md: "20px" },
                "&:hover": {
                  backgroundColor: palette.primary.dark,
                },
              }}
            >
              {t("SUBMIT")}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default ContactForm;
