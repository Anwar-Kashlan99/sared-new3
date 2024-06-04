import { Box, Typography, useMediaQuery } from "@mui/material";
import Plan from "./Plan";
import { useState } from "react";

import { useTheme } from "@emotion/react";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Plans = () => {
  const isMobile = useMediaQuery("(max-width: 620px)");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const plans = [
    {
      id: 1,
      priceAfter: 9,
      audience: "100",
      priceBefore: 19.99,
      period: "month",
    },
    {
      id: 2,
      priceAfter: 19,
      audience: "500",
      priceBefore: 39.99,
      period: "month",
    },
    {
      id: 3,
      priceAfter: 29,
      audience: "1000",
      priceBefore: 59.99,
      period: "month",
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelect = (planId, price) => {
    setSelectedPlan({ planId, price: price + 1 });
    // Send the selected plan's price to the backend here
    // You can make an API call or invoke a function to send the data
  };

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 56px)"
      position="relative"
      bgcolor="#f7f7f7"
    >
      <Box display="flex" flexDirection="column">
        <Typography
          sx={{
            color: palette.primary.main,
            textAlign: "center",
            fontSize: isMobile
              ? "26px"
              : { xs: "28", sm: "30px", md: "30px", lg: "34px" },
            padding: "20px",
            marginBottom: "40px",
            marginTop: "25px",
            fontWeight: "bold",
          }}
        >
          {t("Select Your Package")}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            gap: "50px",
            flexWrap: "wrap",
          }}
        >
          {plans.map((plan) => (
            <Plan
              key={plan.id}
              planId={plan.id}
              priceAfter={plan.priceAfter}
              audience={plan.audience}
              priceBefore={plan.priceBefore}
              period={plan.period}
              isMain={plan.id === 1}
              onSelect={handlePlanSelect}
            />
          ))}
        </Box>
      </Box>
      <Box
        position="absolute"
        bottom="12px"
        left="20px"
        display="flex"
        alignItems="center"
        sx={{
          "&:hover *": {
            transition: "0.5s",
            cursor: "pointer",
            color: "#e7e7e7",
          },
        }}
        onClick={() => navigate("/")}
      >
        <ArrowBackIosNewOutlined
          sx={{
            color: "#707070",
          }}
        />
        <Typography color="#707070" variant="h4">
          {t("BACK")}
        </Typography>
      </Box>
    </Box>
  );
};

export default Plans;
