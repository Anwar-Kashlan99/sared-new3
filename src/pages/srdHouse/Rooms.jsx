import { SearchOutlined } from "@mui/icons-material";
import { Box, Button, Input, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import RoomDetailModule from "./RoomDetailModule";
import RoomsCard from "./RoomsCard";
import { useTranslation } from "react-i18next";
import { providesTags, useGetAllRoomsQuery } from "../../store/srdClubSlice";
import socketInit from "../../socket";
import { ACTIONS } from "../../actions";

const Rooms = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showModule, setShowModule] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();
  const { data, error, isLoading, refetch } = useGetAllRoomsQuery({
    key: "value",
  });

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const handleModuleOpen = () => {
    setShowModule(true);
  };

  const handleModuleClose = () => {
    setShowModule(false);
    refetch();
  };

  const filteredRooms = data
    ?.filter((card) => {
      return (
        searchValue === "" ||
        card.topic.toLowerCase().includes(searchValue.toLowerCase()) ||
        card._id.toLowerCase().includes(searchValue.toLowerCase())
      );
    })
    .reverse();

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
            onClick={handleModuleOpen}
          >
            {t("Create Rome")}
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
            gap: "30px",
            transition: "opacity 0.5s ease",
            opacity: filteredRooms?.length > 0 ? 1 : 0, // Fade in/out effect
          }}
        >
          {filteredRooms?.map((card, index) => (
            <RoomsCard
              card={card}
              index={index}
              key={`${card.title}-${card._id}-${index}`}
            />
          ))}
        </Box>
      </Box>
      {showModule && <RoomDetailModule onClose={handleModuleClose} />}
    </Box>
  );
};

export default Rooms;
