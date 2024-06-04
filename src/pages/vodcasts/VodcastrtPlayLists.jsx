import { Box, Card, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

const playListCard = [
  {
    id: "1",
    image: require("../../assets/data/pdcast&vodcast/غموض-حسن-هاشم-nFEqhbxf8RK-6akmGQxKR3A.1400x1400.jpg"),
    title: "برنامج غموض",
    createAt: "2024/2/20",
  },
  {
    id: "2",
    image: require("../../assets/data/pdcast&vodcast/hq720.jpg"),
    title: "استكشاف",
    createAt: "2024/3/20",
  },
  {
    id: "3",
    image: require("../../assets/data/pdcast&vodcast/57141716.jpg"),
    title: "الأجنحة المتكسرة",
    createAt: "2024/5/20",
  },
  {
    id: "4",
    image: require("../../assets/data/pdcast&vodcast/غلاف_ع-الماشي.jpeg"),
    title: "ع الماشي",
    createAt: "2021/2/20",
  },
  {
    id: "5",
    image: require("../../assets/data/pdcast&vodcast/16b7d0176750457.Y3JvcCw1ODM0LDQ1NjMsMCwxNDQ.jpg"),
    title: "زي الكتاب مابيقول",
    createAt: "2023/12/1",
  },
  {
    id: "6",
    image: require("../../assets/data/pdcast&vodcast/maxresdefault.jpg"),
    title: "مافبل تعلم البرمجة",
    createAt: "2023/11/20",
  },
];

const VodcastrtPlayLists = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    controls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    });
  }, [controls]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "95%" : "80%",
          m: isMobile ? "5rem auto 3rem" : "4.5rem auto 2rem",
          padding: "1rem",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            mb: "40px",
            color: "#f25f0c",
          }}
        >
          {t("Playlists")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center",
          }}
        >
          {playListCard.map((card, index) => {
            return (
              <motion.div
                key={`playlist${card.id}-${index}`}
                initial={{
                  opacity: 0,
                  x: isMobile ? 35 : index % 2 === 0 ? 50 : 100,
                }}
                animate={controls}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card
                  sx={{
                    boxShadow: "0 4px 6px #707070",
                    margin: isMobile ? "0 15px" : "0px",
                    borderRadius: "20px",
                    backgroundColor: "#fff",
                    position: "relative",
                    width: isMobile ? "90%" : "350px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/vodcaster/playlists/vodcasts")}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        height: "350px",
                        padding: "10px",
                        backgroundColor: "#f3f3f3",
                      }}
                    >
                      <img
                        alt={`playlist-${card.title}-${index}`}
                        src={card.image}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          height: "100%",
                          borderRadius: "10px",
                        }}
                        loading="lazy"
                      />
                    </Box>
                    <Box
                      sx={{
                        padding: "10px 15px 12px",
                        backgroundColor: "#f3f3f3",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "17px",
                            mb: "7px",
                          }}
                        >
                          {card.title}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography sx={{ color: "#707070", fontSize: "14px" }}>
                          {card.createAt}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default VodcastrtPlayLists;
