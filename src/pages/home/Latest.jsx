import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRef, useState } from "react";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { IconButton, useMediaQuery } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BlogCard from "../blogs/BlogCard";
import PodcasterCard from "../podcasts/PodcasterCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VodcasterCard from "../vodcasts/VodcasterCard";

const podcasterCards = [
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

const bolgCards = [
  {
    id: "1",
    Categories: "business",
    porfileImg: require("../../assets/data/blog/mohammed habash.jpg"),
    blogImg: require("../../assets/data/blog/mohammed habash cover.jpg"),
    userName: "Mohammad Habash",
    likes: "4K",
    date: "2/12/2024",
    blogTitle: "التسويق غير الربحي",
    blogDescription:
      "خلينا نتفق بداية أن التسويق نشاط موجود من قديم الزمان، من حضارات الفراعنة وقبلها، والمبادئ العامة ما اختلفت عن اليوم، واستخدمه الكتيرين من شخصيات وحضارات وحتى جهات غير ربحية. المفهوم الواسع للتسويق يعني الاتصال مع الجمهور للتأثير فيه لعمل سلوك ما",
  },
  {
    id: "2",
    Categories: "psychology",
    date: "2/12/2023",
    porfileImg: require("../../assets/data/blog/drfawzy .jpg"),
    blogImg: require("../../assets/data/blog/dr fawzy cover.jpg"),
    userName: "د. عماد فوزي شعيبي",
    likes: "400",
    blogTitle: "الشخصيّة النفاجيّة",
    blogDescription:
      "النفاجيّ هو ذاك الذي يفخر ليس لديه. (بالعاميّة المنفاخ)؛ أي الذي ينتفخ على الفاضي والفارغ من الداخل. هذه الشخصيّة تذهب إلى أن يُقلّد من يعتبرهم أرقى منه، ويسعى زاحفاً لصحبتهم، ويتكبّر على من يعتبرهم أدنى منه ",
  },
  {
    id: "3",
    Categories: "psychology",
    date: "2/12/2023",
    porfileImg: require("../../assets/data/blog/drfawzy .jpg"),
    blogImg: require("../../assets/data/blog/dr fawzy cover.jpg"),
    userName: "د. عماد فوزي شُعيبي ",
    likes: "4.4K",
    blogTitle: "صندوق باندورا",
    blogDescription:
      "يٌقال فتحَ #صندوق_باندورا؛  والمقصود به أنه قد أخطأ في حساباته بحيث فتحت عليه كل شرور الدُنيا. ففي الميثولوجيا الإغريقية، صندوق باندورا هو صندوق  هو  يتضمن كل شرور البشرية من جشع، وغرور، وافتراء، وكذب وحسد، ووهن، ورجاء",
  },
  {
    id: "4",
    Categories: "technology",
    date: "2/12/2023",
    porfileImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    blogImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    userName: "Osama Mohamed",
    likes: "400",
    blogTitle: "ChatGPT",
    blogDescription:
      " لو انت بتتعامل معه وعايش يومك كله معاه معتمد عليه في شغل البرمجة حابب أقولك ان في مرحلة ممكن يضيعك فيها انك تبني كل شغلك عليه وتنسى انه موجود بس علشان يساعدك مش علشان يشتغل مكانك يعني هو مش فاهم  Logic ومش فاهم اصلا أي شيء هو عبارة عن أداه بتجيبلك الحاجة اللي هتساعدك",
  },
  {
    id: "5",
    Categories: "technology",
    porfileImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    blogImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    userName: "Osama Mohamed",
    likes: "3K",
    date: "2/12/2023",
    blogTitle: "Performance",
    blogDescription:
      "هقولك كام نصيحة يارب تستفيد بيهم وانت شغال في اي مشروع برمجي, انا كان بيجيلي مشاريع أراجع عليها وكنت بشوف مصايب ينفع يتألف منها مجلدات والله لكن هقولك على حاجة كانت بتفرتك ال Performance بتاع الموقع وهي كمية ال Scripts اللي ملهاش لازمة اللي حضرتك بتستدعيها في المشروع",
  },
  {
    id: "6",
    Categories: "technology",
    date: "2/12/2023",
    porfileImg: require("../../assets/data/blog/mohammed habash.jpg"),
    blogImg: require("../../assets/data/blog/mohammed habash cover.jpg"),
    userName: "Mohammad Habash",
    likes: "5K",
    blogTitle: "دليل الشهادات الإحترافية في التقنيات المستقبلية لعام 2024 ",
    blogDescription:
      "أن التطور المستمر في التقنيات الحديثة في عالمنا اليوم أصبح نقطة تحول في كثير من نماذج الأعمال والاقتصادات المتقدمة والعالمية، سعياً منها لتحقيق أعلى متطلبات الاستدامة و الكفاءة، سواءاً التشغيلية أو المالية أوالتشريعية أوالبيئية أو الاجتماعية أو الاقتصادية",
  },
  {
    id: "7",
    Categories: "psychology",
    date: "2/12/2023",
    porfileImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    blogImg: require("../../assets/data/blog/osama Mohammed.jpg"),
    userName: "Osama Mohamed",
    likes: "400",
    blogTitle: "السؤال الصحيح نصف الإجابة",
    blogDescription:
      "لازم تتعلم إزاي تسأل واوعى تتريق لو حد قالك كدة وتقوله هو السؤال محتاج تعليم ؟ آه السؤال محتاج تعليم وعشرات الأسئلة اللي ممكن تسألها في حياتك مش بيترد عليها بسبب أخطاء من ناحيتك لو اللي قدامك متاح انه يرد",
  },
  {
    id: "8",
    Categories: "psychology",
    date: "2/12/2023",
    porfileImg: require("../../assets/data/blog/drfawzy .jpg"),
    blogImg: require("../../assets/data/blog/dr fawzy cover.jpg"),
    userName: "د. عماد فوزي شعيبي",
    likes: "5K",
    blogTitle: "الشخصيّة الكارهة",
    blogDescription:
      "عض أنواع الشخصيات من النوع الكاره، تعكس كراهيتها هذه نوعاً من الخصاء (الشعور بالدونية) جرّاء عقدة أوديب (للذكر) أو الكترا (للانثى)، أو جراء أيّ عقدة مماثلة [كعقدة قابيل...] وهي شخصية تعيش على الشكّ بالآخرين، وتراهم خصوماً من الدرجة الأولى وتحولهم بسهولة إلى أعداء. وترى فيهم مُهدّداً أساسيّاً لوجودها",
  },
];

const vodCasterCards = [
  {
    id: "1",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile (3).jpg"),
    name: "Steve Harvey",
    title:
      "Emmy® Award-winning entertainer, radio personality, motivational speaker",
  },

  {
    id: "2",
    img: require("../../assets/data/pdcast&vodcast/حسن هاشم/unnamed.jpg"),
    name: "AL HASHIM",
    title:
      "أهلاً بكل الأصدقاء المتابعين لبرنامج غموض، والداعمين لي شخصياً لمواصلة بهذا البرنامج الشيْق والبرامج الباقية",
  },
  {
    id: "3",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile (2).jpg"),
    name: "د. عماد فوزي شُعيبي",
    title: "قناة فكريّة عامة تحترم عقول الآخرين وهدفها اغناء العقل  ",
  },

  {
    id: "4",
    img: require("../../assets/data/pdcast&vodcast/what if/unnamed.jpg"),
    name: "ماذا لو",
    title: "لطالما سحرنا هذا السؤال المراوغ … ماذا لو…؟",
  },
  {
    id: "5",
    img: require("../../assets/data/pdcast&vodcast/speak English smartly/channels4_profile.jpg"),
    name: "Speak English Smartly",
    title: "In this channel, You will learn All tips about English Speaking",
  },
  {
    id: "6",
    img: require("../../assets/data/pdcast&vodcast/Riwaya&Podcast/channels4_profile.jpg"),
    name: "Riwaya&Podcast",
    title:
      "نقدم لكم قناة مخصصة لعشاق القراءة والمطالعة والاستماع , سيكون بإمكانك قراءة الكتب والروايات التي تحبها في مدة زمنية قصيرة",
  },
  {
    id: "7",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile.jpg"),
    name: "زي الكتاب مابيقول",
    title:
      "زي الكتاب ما بيقول ..هي فيديوهات بنحاول من خلالها اننا نغوص في رحلة بحث مستمرة في بحر المعرفة الإنسان",
  },

  {
    id: "8",
    img: require("../../assets/data/pdcast&vodcast/channels4_profile (1).jpg"),
    name: "Tarkiz school",
    title:
      "إذا كنت تبحث عن طريقة فريدة وممتعة لتعلم المواد الدراسية وتطوير مهاراتك، فقد وجدت المكان المناسب",
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Latest = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const { palette } = useTheme();

  const isTabScreen = useMediaQuery("(min-width:769px) and (max-width:1060px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigScreen = useMediaQuery("(min-width:1600px)");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const slider2Ref = useRef(null);
  const goToNextSlide2 = () => {
    slider2Ref.current.slickNext();
  };

  const goToPrevSlide2 = () => {
    slider2Ref.current.slickPrev();
  };

  const slider3Ref = useRef(null);
  const goToNextSlide3 = () => {
    slider3Ref.current.slickNext();
  };

  const goToPrevSlide3 = () => {
    slider3Ref.current.slickPrev();
  };

  let centerSlidePercentage = isMobile
    ? 100
    : isTabScreen
    ? 50
    : !isBigScreen
    ? 33.33
    : 25;

  const settings = {
    infinite: true,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: isMobile ? 1 : isTabScreen ? 2 : !isBigScreen ? 3 : 4,
    centerSlidePercentage: centerSlidePercentage,
    autoplay: false,
  };

  let centerSlidePercentage2 = isMobile ? 100 : isTabScreen ? 50 : 33.33;
  const settings2 = {
    infinite: true,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
    slidesToShow: isMobile ? 1 : isTabScreen ? 2 : 3,
    centerSlidePercentage: centerSlidePercentage2,
    autoplay: false,
  };

  const StyledTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .Mui-selected": {
      backgroundColor: palette.primary.main,
      color: "#fff",
      borderRadius: value === 0 ? "25px 25px 0 0" : "0 0 25px 25px", // Border radius based on selected tab
    },
    "& .MuiTab-root": {
      borderRadius: value === 0 ? "25px 0 0 25px" : "0 25px 25px 0", // Default border radius for non-selected tabs
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box p="1rem 1rem 8rem 1rem " position="relative">
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
            my: "0.5rem",
            padding: "1rem",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textTransform: "uppercase",
              color: "#707070",
              fontWeight: "bold",
              letterSpacing: "1.5px",
            }}
          >
            {t("Latest")}
          </Typography>
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "90%" }}>
          <Box sx={{ marginBottom: "50px" }}>
            <AppBar
              position="static"
              sx={{
                borderRadius: "25px",
                backgroundColor: "#fff",
                color: "black",
                width: isMobile ? "100%" : "80%",
                m: "0 auto",
              }}
            >
              <StyledTabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("Blogs")}
                    </Typography>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("Programs")}
                    </Typography>
                  }
                  {...a11yProps(1)}
                />
              </StyledTabs>
            </AppBar>
          </Box>
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "transparent",
              borderRadius: "20px",
              width: isMobile ? "100%" : "95%",
              margin: "0 auto",
            }}
          >
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Box
                  sx={{
                    "& .slick-list": {
                      py: "15px !important",
                    },
                  }}
                >
                  <Slider ref={slider3Ref} {...settings2}>
                    {bolgCards.map((card) => (
                      <BlogCard
                        card={card}
                        key={`${card.userName}-${card.id}`}
                      />
                    ))}
                  </Slider>

                  <IconButton
                    onClick={goToPrevSlide3}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: isMobile ? "-10px" : "-0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateBefore
                      sx={{ fontSize: "40px", color: "#707070" }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={goToNextSlide3}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: isMobile ? "-10px" : "-0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateNext sx={{ fontSize: "40px", color: "#707070" }} />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      flexGrow: 1,
                      transition: "0.5s",
                      "&:hover": {
                        cursor: "pointer",
                      },
                      "&:hover > p": {
                        color: "#fabf9e",
                      },
                    }}
                    onClick={() => navigate("/blogs")}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        transition: "0.5s",
                        color: palette.primary.main,
                        mt: "15px",
                      }}
                    >
                      {t("MORE")}...
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    mb: "20px",
                    backgroundColor: "#f7f7f7",
                    p: "1.5rem",
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      ml: isMobile ? undefined : "60px",
                      mb: "20px",
                      color: "#707070",
                      textAlign: isMobile ? "center" : undefined,
                    }}
                  >
                    {t("Podcaster")}
                  </Typography>
                  <Slider ref={sliderRef} {...settings}>
                    {podcasterCards.map((podcaster, index) => (
                      <PodcasterCard
                        podcaster={podcaster}
                        key={`${podcaster.name}-${podcaster.id}`}
                      />
                    ))}
                  </Slider>
                  <IconButton
                    onClick={goToPrevSlide}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: isMobile ? "-10px" : "-0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateBefore
                      sx={{ fontSize: "40px", color: "#707070" }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={goToNextSlide}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: isMobile ? "-10px" : "-0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateNext sx={{ fontSize: "40px", color: "#707070" }} />
                  </IconButton>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      flexGrow: 1,
                      transition: "0.5s",
                      "&:hover": {
                        cursor: "pointer",
                      },
                      "&:hover > p": {
                        color: "#fabf9e",
                      },
                    }}
                    onClick={() => navigate("/allpodcaster")}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        transition: "0.5s",
                        color: palette.primary.main,
                        mt: "15px",
                      }}
                    >
                      {t("MORE")}...
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    backgroundColor: "#f7f7f7",
                    p: "1.5rem",
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      ml: isMobile ? undefined : "60px",
                      mb: "20px",
                      color: "#707070",
                      textAlign: isMobile ? "center" : undefined,
                    }}
                  >
                    {t("Vodcaster")}
                  </Typography>
                  <Slider ref={slider2Ref} {...settings}>
                    {vodCasterCards.map((vodcaster) => (
                      <VodcasterCard
                        vodcaster={vodcaster}
                        key={`${vodcaster.name}-${vodcaster.id}`}
                      />
                    ))}
                  </Slider>
                  <IconButton
                    onClick={goToPrevSlide2}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: isMobile ? "-10px" : "0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateBefore
                      sx={{ fontSize: "40px", color: "#707070" }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={goToNextSlide2}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: isMobile ? "-10px" : "0px",
                      color: "#fff",
                      padding: "5px",
                      zIndex: "10",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <NavigateNext sx={{ fontSize: "40px", color: "#707070" }} />
                  </IconButton>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      flexGrow: 1,
                      transition: "0.5s",
                      "&:hover": {
                        cursor: "pointer",
                      },
                      "&:hover > p": {
                        color: "#fabf9e",
                      },
                    }}
                    onClick={() => navigate("/allpodcaster")}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        transition: "0.5s",
                        color: palette.primary.main,
                        mt: "15px",
                      }}
                    >
                      {t("MORE")}...
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>
            </SwipeableViews>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Latest;
