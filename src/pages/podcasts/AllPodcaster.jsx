import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Input, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PodcasterCard from "./PodcasterCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchPodcaster } from "../../store/podcastSlice";

const podCasterCards = [
  {
    id: "1",
    img: require("../../assets/data/pdcast&vodcast/speak English smartly/channels4_profile.jpg"),
    name: "Speak English Smartly",
    title: "In this channel, You will learn All tips about English Speaking",
  },
  {
    id: "2",
    img: require("../../assets/data/pdcast&vodcast/what if/unnamed.jpg"),
    name: "ماذا لو",
    title: "لطالما سحرنا هذا السؤال المراوغ … ماذا لو…؟",
  },
  {
    id: "3",
    img: require("../../assets/data/pdcast&vodcast/حسن هاشم/unnamed.jpg"),
    name: "AL HASHIM",
    title:
      "أهلاً بكل الأصدقاء المتابعين لبرنامج غموض، والداعمين لي شخصياً لمواصلة بهذا البرنامج الشيْق والبرامج الباقية",
  },
  {
    id: "4",
    img: require("../../assets/data/pdcast&vodcast/Riwaya&Podcast/channels4_profile.jpg"),
    name: "Riwaya&Podcast",
    title:
      "نقدم لكم قناة مخصصة لعشاق القراءة والمطالعة والاستماع , سيكون بإمكانك قراءة الكتب والروايات التي تحبها في مدة زمنية قصيرة",
  },
  {
    id: "5",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile (1).jpg"),
    name: "Tarkiz school",
    title:
      "إذا كنت تبحث عن طريقة فريدة وممتعة لتعلم المواد الدراسية وتطوير مهاراتك، فقد وجدت المكان المناسب",
  },
  {
    id: "6",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile.jpg"),
    name: "زي الكتاب مابيقول",
    title:
      "زي الكتاب ما بيقول ..هي فيديوهات بنحاول من خلالها اننا نغوص في رحلة بحث مستمرة في بحر المعرفة الإنسان",
  },
  {
    id: "7",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile (2).jpg"),
    name: "د. عماد فوزي شُعيبي",
    title: "قناة فكريّة عامة تحترم عقول الآخرين وهدفها اغناء العقل  ",
  },
  {
    id: "8",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile (3).jpg"),
    name: "Steve Harvey",
    title:
      "Emmy® Award-winning entertainer, radio personality, motivational speaker",
  },
];

const AllPodcaster = () => {
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const podcasters = useSelector((state) => state.podcasts.podcasts);
  // const status = useSelector((state) => state.podcasts.status);
  // const error = useSelector((state) => state.podcasts.error);

  // useEffect(() => {
  //   if (status === "idle") {
  //     dispatch(fetchPodcaster());
  //   }
  // }, [status, dispatch]);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredPodcaster = podCasterCards.filter((podcaster) => {
    return (
      searchValue === "" ||
      podcaster.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      podcaster.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "90%",
          m: isMobile ? "6rem auto 3rem" : "5.5rem auto 2rem",
          padding: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Button
            sx={{
              order: isMobile ? "2" : "1",
              backgroundColor: "#f25f0c",
              color: "white",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "#fff",
                color: "#f25f0c",
              },
            }}
            variant="outlined"
            onClick={() => navigate("/podcasts/createpodcasts")}
          >
            {t("Create Podcast")}
          </Button>
          <Box
            sx={{
              marginBottom: "15px",
              position: "relative",
              order: isMobile ? "1" : "2",
            }}
          >
            <Input
              type="text"
              placeholder={t("Search")}
              value={searchValue}
              sx={{
                width: isMobile ? "300px" : "500px",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "20px",
                border: "none",
                boxShadow: "1px 4px 7px 0px #707070",
                outline: "none",
                "&::before, &::after": {
                  border: "none",
                },
                "&:hover:not(.Mui-disabled):before": {
                  border: "none",
                },
              }}
              onChange={handleSearch}
            />

            <SearchOutlined
              sx={{
                position: "absolute",
                fontSize: "30px",
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            transition: "opacity 0.5s ease",
            opacity: filteredPodcaster.length > 0 ? 1 : 0, // Fade in/out effect
          }}
        >
          {filteredPodcaster.map((podcaster, index) => (
            <PodcasterCard
              key={`pdcaster-${podcaster.id}-${index}`}
              podcaster={podcaster}
              index={index}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AllPodcaster;
