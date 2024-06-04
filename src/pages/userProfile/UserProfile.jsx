import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useRef } from "react";
import profileCover from "../../assets/profileCover.png";
import { Edit, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { XIcon } from "react-share";
import whatsapp from "../../assets/whatsapp.png";
import gmail from "../../assets/gmail.png";
import facebook from "../../assets/facebook.png";
import youtube from "../../assets/youtube.png";
import BlogCard from "../blogs/BlogCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import img from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/channels4_profile.jpg";
import cover from "../../assets/data/pdcast&vodcast/Riwaya&Podcast/cover.jpg";

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

const podcasterCards = [
  {
    id: "1",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "2",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "3",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "4",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "5",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "6",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "7",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "8",
    img: require("../../assets/createpodcast2.png"),
    name: "Podcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
];

const vodcasterCards = [
  {
    id: "1",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "2",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "3",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "4",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "5",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "6",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "7",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
  {
    id: "8",
    img: require("../../assets/vodcastimg2.jpg"),
    name: "Vodcast test",
    title: "lorem ipsum test vel sceleris consectetur",
  },
];

const UserProfile = () => {
  const isMobile = useMediaQuery("(max-width: 825px)");
  const isTabScreen = useMediaQuery("(min-width:769px) and (max-width:1060px)");
  const isBigScreen = useMediaQuery("(min-width:1600px)");
  const { t } = useTranslation();
  const sliderRef = useRef(null);
  const slider2Ref = useRef(null);
  const slider3Ref = useRef(null);

  const handleCoverEdit = () => {};

  const handleFollow = () => {};

  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const goToNextSlide2 = () => {
    slider2Ref.current.slickNext();
  };

  const goToPrevSlide2 = () => {
    slider2Ref.current.slickPrev();
  };

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

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ width: "100%", height: "350px", position: "relative" }}>
        <img
          alt="Profile Cover"
          src={cover}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#707070a6",
            position: "absolute",
            bottom: "25px",
            right: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onclick={handleCoverEdit}
        >
          <Edit sx={{ fontSize: "40px", color: "#fff" }} />
        </Box>
      </Box>

      <Box
        sx={{
          width: "90%",
          m: isMobile ? "0rem auto 1rem" : "0rem auto 1rem",
          padding: "0.2rem 1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : undefined,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              columnGap: "15px",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : undefined,
            }}
          >
            <Avatar
              sx={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                transform: "translateY(-35px)",
              }}
              src={img}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#f25f0c",
                  fontSize: "17px",
                  my: "5px",
                }}
              >
                Riwaya&Podcast
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
            <Typography
              sx={{
                color: "#707070",
                ml: isMobile ? "0px" : "50px",
                mt: "10px",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "18px" }}>500K</span>{" "}
              {t("followers")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              columnGap: "5px",
            }}
          >
            <IconButton
              sx={{
                width: "54px",
                height: "54px",
              }}
            >
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <XIcon size={36} round />
              </a>
            </IconButton>
            <IconButton
              sx={{
                width: "54px",
                height: "54px",
              }}
            >
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  alt="facebook"
                  src={facebook}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </a>
            </IconButton>
            <IconButton
              sx={{
                width: "54px",
                height: "54px",
              }}
            >
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  alt="whatsapp"
                  src={whatsapp}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </a>
            </IconButton>
            <IconButton
              sx={{
                width: "54px",
                height: "54px",
              }}
            >
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  alt="youtube"
                  src={youtube}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </a>
            </IconButton>
            <IconButton
              sx={{
                width: "54px",
                height: "54px",
              }}
            >
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  alt="gmail"
                  src={gmail}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </a>
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ mt: "1rem" }}>
          <Typography
            sx={{
              maxWidth: "600px",
              color: "#707070",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            🔴رواية وبودكاست .. نساعدكم على قراءة الكتب والروايات صوتياً🔴 ⚫
            نقدم لكم قناة مخصصة لعشاق القراءة والمطالعة والاستماع , سيكون
            بإمكانك قراءة الكتب والروايات التي تحبها في مدة زمنية قصيرة أثناء
            ممارسة أعمالك ونشاطاتك دون الحاجة إلى تخصيص وقت للقراءة وإضاعة الوقت
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#7B7775",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            width: "90%",
            m: "0 auto",
            p: "10px 5px 25px 0",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              color: "#fff",
              mb: "10px",
              ml: "20px",
              fontWeight: "bold",
            }}
          >
            {t("Blogs")}
          </Typography>
          <Slider ref={sliderRef} {...settings}>
            {bolgCards.map((card, index) => (
              <div key={`${card.userName}-${card.id}`}>
                <BlogCard card={card} index={index} />
              </div>
            ))}
          </Slider>
          <IconButton
            onClick={goToPrevSlide}
            sx={{
              position: "absolute",
              top: "50%",
              left: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateBefore sx={{ fontSize: "40px", color: "#fff" }} />
          </IconButton>
          <IconButton
            onClick={goToNextSlide}
            sx={{
              position: "absolute",
              top: "50%",
              right: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "90%",
            m: "0 auto",
            p: "25px 5px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              color: "#707070",
              mb: "20px",
              ml: "20px",
              fontWeight: "bold",
            }}
          >
            {t("Podcasts")}
          </Typography>
          <Slider ref={slider2Ref} {...settings}>
            {podcasterCards.map((podcaster) => (
              <div key={`${podcaster.userName}-${podcaster.id}`}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "350px",
                      height: "275px",
                      marginBottom: "5px",
                      borderRadius: "20px",
                      border: "8px solid #EB7635",
                      position: "relative",
                    }}
                  >
                    <img
                      alt={`${podcaster.name}-${podcaster.id}`}
                      src={podcaster.img}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {podcaster.name}
                  </Typography>
                  <Typography sx={{ maxWidth: "250px", textAlign: "center" }}>
                    {podcaster.title}
                  </Typography>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton
            onClick={goToPrevSlide2}
            sx={{
              position: "absolute",
              top: "50%",
              left: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateBefore sx={{ fontSize: "40px", color: "#EB7635" }} />
          </IconButton>
          <IconButton
            onClick={goToNextSlide2}
            sx={{
              position: "absolute",
              top: "50%",
              right: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateNext sx={{ fontSize: "40px", color: "#EB7635" }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#EB7635",
          borderRadius: "20px 20px 0px 0px",
        }}
      >
        <Box
          sx={{
            width: "90%",
            m: "0 auto",
            p: "25px 5px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              color: "#fff",
              mb: "20px",
              ml: "20px",
              fontWeight: "bold",
            }}
          >
            {t("Vodcasts")}
          </Typography>
          <Slider ref={slider3Ref} {...settings}>
            {vodcasterCards.map((vodcaster) => (
              <div key={`${vodcaster.userName}-${vodcaster.id}`}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "350px",
                      height: "275px",
                      marginBottom: "5px",
                      borderRadius: "20px",
                      border: "8px solid #fff",
                      position: "relative",
                    }}
                  >
                    <img
                      alt={`${vodcaster.name}-${vodcaster.id}`}
                      src={vodcaster.img}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#f7f7f7",
                    }}
                  >
                    {vodcaster.name}
                  </Typography>
                  <Typography
                    sx={{
                      maxWidth: "250px",
                      textAlign: "center",
                      color: "#f7f7f7",
                    }}
                  >
                    {vodcaster.title}
                  </Typography>
                </Box>
              </div>
            ))}
          </Slider>
          <IconButton
            onClick={goToPrevSlide3}
            sx={{
              position: "absolute",
              top: "50%",
              left: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateBefore sx={{ fontSize: "40px", color: "#fff" }} />
          </IconButton>
          <IconButton
            onClick={goToNextSlide3}
            sx={{
              position: "absolute",
              top: "50%",
              right: "-30px",
              color: "white",
              padding: "5px",
              zIndex: "10",
              transform: "translateY(-50%)",
            }}
          >
            <NavigateNext sx={{ fontSize: "40px", color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;
