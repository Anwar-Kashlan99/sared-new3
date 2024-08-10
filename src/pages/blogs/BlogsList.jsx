import { SearchOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Input,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import { useTranslation } from "react-i18next";
import { useGetAllBlogsQuery } from "../../store/blogSlice";

const bolgs = [
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

const BlogsList = () => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, error, isLoading, refetch } = useGetAllBlogsQuery({
    key: "value",
  });

  console.log(data);

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const categories = [
    { id: "all", name: t("All") },
    { id: "technology", name: t("Technology") },
    { id: "sport", name: t("Sport") },
    { id: "psychology", name: t("Psychology") },
    { id: "philosophy", name: t("Philosophy") },
    { id: "business", name: t("Business") },
    { id: "art", name: t("Art") },
    { id: "fashion", name: t("Fashion") },
    { id: "foodsAndCooking", name: t("Foods and cooking") },
    { id: "music", name: t("Music") },
    { id: "science", name: t("Science") },
    { id: "education", name: t("Education") },
    { id: "health", name: t("Health") },
    { id: "design", name: t("Design") },
    { id: "movies", name: t("Movies") },
    { id: "languages", name: t("Languages") },
    { id: "other", name: t("Other") },
  ];

  const filteredBlogs = bolgs.filter((blog) => {
    return (
      (filterCategory === "" ||
        filterCategory === "all" ||
        blog.Categories === filterCategory) &&
      (searchValue === "" ||
        blog.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
        blog.blogTitle.toLowerCase().includes(searchValue.toLowerCase()))
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
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: "10px",
              alignItems: "center",
              order: isMobile ? "2" : "1",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#f25f0c",
                color: "white",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "#fff",
                  color: "#f25f0c",
                },
              }}
              variant="outlined"
              onClick={() => navigate("/blogs/createblog")}
            >
              {t("Create Blog")}
            </Button>
            <Box>
              {categories.length > 0 && (
                <Select
                  size="small"
                  value={filterCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  variant="outlined"
                  sx={{
                    color: "#707070",
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem
                      sx={{
                        color:
                          filterCategory === category.id
                            ? "#f25f0c"
                            : "#707070",
                      }}
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              marginBottom: isMobile ? "25px" : "15px",
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
            gap: "30px",
            transition: "opacity 0.5s ease",
            opacity: filteredBlogs.length > 0 ? 1 : 0, // Fade in/out effect
          }}
        >
          {/**{blogStatus === "loading" && <div>Loading...</div>}
      {blogError && <div>Error: {blogError}</div>} {blogStatus === "succeeded" &&} */}

          {filteredBlogs.map((card, index) => (
            <BlogCard
              card={card}
              index={index}
              key={`${card.userName}-${card.id}`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BlogsList;
