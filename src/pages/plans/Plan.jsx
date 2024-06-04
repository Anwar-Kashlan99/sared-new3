import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Plan = ({
  planId,
  priceAfter,
  audience,
  priceBefore,
  period,
  isMain,
  onSelect,
}) => {
  const { palette } = useTheme();

  const handleSelect = () => {
    onSelect(planId, priceAfter);
  };
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <Box
      dir={isArabic ? "rtl" : "ltr"}
      display="flex"
      flexDirection="column"
      sx={{
        boxShadow: `8px 9px 7px 0px ${isMain ? "#f79f6d" : "#707070"}`,
        width: "280px",
        textAlign: "center",
        padding: "50px 20px",
        borderRadius: "20px",
        marginBottom: "35px",
        backgroundColor: "white",
        transition: "0.5s",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#f7f7f7",
        },
      }}
      onClick={handleSelect}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          color: "#707070",
        }}
      >
        $ {priceAfter}
        <sup>99</sup>
      </Typography>
      <Box
        sx={{
          padding: "10px",
          marginTop: "50px",
          textAlign: isArabic ? "right" : "left",
          color: "#707070",
        }}
      >
        <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>
          {t("audience capacity")}:{" "}
          <span style={{ color: palette.primary.main }}>{audience}</span>
        </Typography>
        <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>
          {t("price")}:{" "}
          <span
            style={{
              color: palette.primary.main,
              textDecoration: "line-through",
            }}
          >
            {priceBefore}
          </span>
        </Typography>
        <Typography sx={{ marginBottom: "15px", fontSize: "18px" }}>
          {t("period")}:{" "}
          <span style={{ color: palette.primary.main }}>{period}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Plan;
