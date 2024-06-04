import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import {
  ArrowDropDown,
  LanguageOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails, clearUserToken } from "../../../store/userSlice";
import { motion } from "framer-motion";

const Navbar = (props) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const isLoggedIn = useSelector((state) => state.user.isAuth);
  // const isLoggedIn = true;
  const isNotMobile = useMediaQuery("(min-width: 1100px)");
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const navItemsLogout = [
    { name: t("Home"), link: "/home" },
    { name: t("About Us"), link: "/about" },
    { name: t("Contact Us"), link: "/contact" },
  ];
  const logedinNavItems = [
    { name: t("Home"), link: "/home" },
    { name: t("Blogs"), link: "/blogs" },
    { name: t("Go Live"), link: "/allbroadcasts" },
    { name: t("Srd Club"), link: "/srdhouse" },
  ];

  const handleDrawerToggle = () => {
    setIsMenuToggled((prevIsMenuToggled) => !prevIsMenuToggled);
  };

  const [isActive, setIsActive] = useState(null);
  const navigate = useNavigate();

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
  };

  const lang = Cookies.get("i18next");

  const [anchorElLang, setAnchorElLang] = useState(null);

  const handleMenuLangOpen = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleMenuLangClose = () => {
    setAnchorElLang(null);
  };

  const handleLanguageSelect = (language) => {
    changeLanguage(language);
    handleMenuLangClose();
  };

  // Get the current location using useLocation()
  const location = useLocation();

  function userLogout() {
    dispatch(clearUserToken()); // Clears the token and sets isAuth to false
    dispatch(clearUserDetails()); // Optionally clear user details
    navigate("/login");
    handleMenuClose();
    setIsMenuToggled(false);
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPro, setAnchorElPro] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(false);
  };

  const handleMenuProOpen = (event) => {
    setAnchorElPro(event.currentTarget);
  };

  const handleMenuProClose = () => {
    setAnchorElPro(false);
  };

  const handleMenuItemClick = (path) => {
    setIsMenuToggled(false);
    handleMenuClose();
    handleMenuProClose();

    navigate(path);
  };

  useEffect(() => {
    setIsMenuToggled(false);
    setAnchorEl(null);
    setAnchorElPro(null);
  }, [location]);

  const handleOtherLinkClick = () => {
    setIsActive(null);
  };

  const handleLogoutClick = () => {
    setIsMenuToggled(false);
    userLogout();
  };
  // drawer

  const variantsUl = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const variantsLi = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        sx={{ my: 2, color: "#707070", fontWeight: "bold", fontSize: "28px" }}
      >
        {t("SRD")}
      </Typography>
      <Divider />
      <motion.ul
        variants={variantsUl}
        animate={isMenuToggled ? "open" : "closed"}
      >
        {isLoggedIn && (
          <motion.li variants={variantsLi} className="menuLi menuUlLi">
            <ListItemButton
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "20px",
                px: "25px",
                color: "#707070",
              }}
              onClick={() => handleMenuItemClick("/profile")}
            >
              <Typography>{userDetails.username}</Typography>
              <Avatar src={userDetails.profile} />
            </ListItemButton>
          </motion.li>
        )}
        {isLoggedIn
          ? logedinNavItems.map((item) => (
              <motion.li
                key={item.name}
                variants={variantsLi}
                className="menuLi menuUlLi"
              >
                <ListItemButton
                  sx={{
                    color: "#707070",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                  onClick={() => handleMenuItemClick(item.link)}
                >
                  <ListItemText
                    sx={{
                      color: "#707070",
                    }}
                    primary={
                      <Typography
                        sx={{
                          color: "#707070",
                          fontSize: "18px",
                        }}
                      >
                        {item.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </motion.li>
            ))
          : navItemsLogout.map((item) => (
              <motion.li
                key={item.name}
                variants={variantsLi}
                className="menuLi menuUlLi"
              >
                <ListItemButton
                  sx={{
                    color: "#707070",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                  onClick={() => handleMenuItemClick(item.link)}
                >
                  <ListItemText
                    sx={{ color: "#707070" }}
                    primary={
                      <Typography
                        sx={{
                          color: "#707070",
                          fontSize: "18px",
                        }}
                      >
                        {item.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </motion.li>
            ))}
        {isLoggedIn && (
          <Fragment>
            <motion.li variants={variantsLi} className="menuLi menuUlLi">
              <ListItemButton
                sx={{
                  color: "#707070",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                onClick={() => handleMenuItemClick("/allpodcaster")}
              >
                <ListItemText
                  sx={{ color: "#707070" }}
                  primary={
                    <Typography
                      sx={{
                        color: "#707070",
                        fontSize: "18px", // Adjust the font size as needed
                      }}
                    >
                      {t("Podcasters")}
                    </Typography>
                  }
                />
              </ListItemButton>
            </motion.li>
            <motion.li variants={variantsLi} className="menuLi menuUlLi">
              <ListItemButton
                sx={{
                  color: "#707070",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                onClick={() => handleMenuItemClick("/allvodcaster")}
              >
                <ListItemText
                  sx={{ color: "#707070" }}
                  primary={
                    <Typography
                      sx={{
                        color: "#707070",
                        fontSize: "18px", // Adjust the font size as needed
                      }}
                    >
                      {t("Vodcasters")}
                    </Typography>
                  }
                />
              </ListItemButton>
            </motion.li>
            <motion.li variants={variantsLi} className="menuLi menuUlLi">
              <ListItemButton
                sx={{
                  color: "#707070",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                onClick={() => handleMenuItemClick("/favorite")}
              >
                <ListItemText
                  sx={{ color: "#707070" }}
                  primary={
                    <Typography
                      sx={{
                        color: "#707070",
                        fontSize: "18px", // Adjust the font size as needed
                      }}
                    >
                      {t("Favorite")}
                    </Typography>
                  }
                />
              </ListItemButton>
            </motion.li>
          </Fragment>
        )}
        {isLoggedIn && (
          <motion.li
            variants={variantsLi}
            className="menuLi menuUlLi"
            style={{ justifyContent: "center" }}
          >
            <ListItemButton
              onClick={handleLogoutClick}
              sx={{ color: "#707070", textAlign: "center" }}
            >
              <ListItemText
                sx={{ color: "#707070" }}
                primary={
                  <Typography
                    sx={{
                      color: "#707070",
                      fontSize: "18px", // Adjust the font size as needed
                    }}
                  >
                    {t("Log Out")}
                  </Typography>
                }
              />
            </ListItemButton>
          </motion.li>
        )}
        <motion.li
          variants={variantsLi}
          className="menuLi menuUlLi"
          style={{ justifyContent: "center" }}
        >
          <IconButton
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleMenuLangOpen}
          >
            <LanguageOutlined sx={{ color: "#333" }} />
          </IconButton>
          <Menu
            id="language-menu"
            anchorEl={anchorElLang}
            open={Boolean(anchorElLang)}
            onClose={handleMenuLangClose}
            sx={{ zIndex: "999999999", marginTop: "5px" }}
          >
            <MenuItem onClick={() => handleLanguageSelect("en")}>
              {t("English")}
            </MenuItem>
            <MenuItem onClick={() => handleLanguageSelect("ar")}>
              {t("Arabic")}
            </MenuItem>
            <MenuItem onClick={() => handleLanguageSelect("fr")}>
              {t("French")}
            </MenuItem>
          </Menu>
        </motion.li>
      </motion.ul>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: isNotMobile ? "97%" : "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: isNotMobile ? "20px" : "0px",
            backgroundColor: "#fff5",
            backdropFilter: "blur(13px)",
            margin: "auto",
            height: "50px",
            position: isNotMobile ? "fixed" : "",
            top: "10px",
            boxShadow: "4px 6px 14px 0px #70707096",
            padding: "10px 25px",
            zIndex: "999",
          }}
        >
          <Box
            sx={{
              width: "90px",
              height: "45px",
            }}
          >
            <Link to={"/"}>
              <img
                alt="logo"
                src={logo}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Link>
          </Box>
          {isNotMobile ? (
            <Box
              display="flex"
              justifyContent="space-between"
              columnGap="40px"
              p="10px"
              marginRight="10px"
              alignItems="center"
            >
              {isLoggedIn && location.pathname === "/golive" ? (
                <Fragment>
                  {logedinNavItems.map((item) => (
                    <Fragment key={item.name}>
                      <NavLink
                        style={{ position: "relative" }}
                        onClick={handleOtherLinkClick}
                        to={item.link}
                        className="nav-item"
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#333",
                            fontSize: "18px",
                            px: "5px",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Box
                          sx={{
                            position: "absolute",
                            left: "0",
                            bottom: "-14px",
                            transition: "all ease-in-out 0.2s",
                            width: "0",
                            height: "2.8px",
                            bgcolor: "#f25f0c",
                          }}
                        ></Box>
                      </NavLink>
                    </Fragment>
                  ))}
                  <Box
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      "&.active": {
                        color: "#f25f0c !important",
                        fontWeight: "bold !important",
                      },
                    }}
                    onClick={handleMenuProOpen}
                    className={`${isActive ? "active" : ""} nav-item`}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "0",
                        bottom: "-14px",
                        transition: "all ease-in-out 0.2s",
                        width: "0",
                        height: "2.8px",
                        bgcolor: "#f25f0c",
                      }}
                    ></Box>
                    <Typography
                      variant="h4"
                      sx={{ color: "#333", fontSize: "18px" }}
                    >
                      {t("Programs")}
                    </Typography>
                    <ArrowDropDown
                      sx={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-23px",
                        color: "#333",
                      }}
                    />
                  </Box>

                  <Menu
                    anchorEl={anchorElPro}
                    open={Boolean(anchorElPro)}
                    onClose={handleMenuProClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    sx={{ zIndex: "999999999", marginTop: "10px" }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuItemClick("/allpodcaster");
                        setIsActive(true);
                      }}
                    >
                      <Typography sx={{ color: "#000", fontSize: "17px" }}>
                        {t("Podcasters")}
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleMenuItemClick("/allvodcaster");
                        setIsActive(true);
                      }}
                    >
                      <Typography sx={{ color: "#000", fontSize: "17px" }}>
                        {t("Vodcasters")}
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Fragment>
              ) : /**
              <Fragment>
                  <NavLink to="/specific-link">
                    <Typography variant="h4" sx={{ color: "#707070" }}>
                      Specific Item
                    </Typography>
                  </NavLink>
                </Fragment>
        */

              isLoggedIn ? (
                <Fragment>
                  {logedinNavItems.map((item) => (
                    <Fragment key={item.name}>
                      <NavLink
                        style={{ position: "relative" }}
                        onClick={handleOtherLinkClick}
                        to={item.link}
                        className="nav-item"
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#333",
                            fontSize: "18px",
                            px: "5px",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Box
                          sx={{
                            position: "absolute",
                            left: "0",
                            bottom: "-14px",
                            transition: "all ease-in-out 0.2s",
                            width: "0",
                            height: "2.8px",
                            bgcolor: "#f25f0c",
                          }}
                        ></Box>
                      </NavLink>
                    </Fragment>
                  ))}
                  <Box
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      "&.active": {
                        color: "#f25f0c !important",
                        fontWeight: "bold !important",
                      },
                    }}
                    onClick={handleMenuProOpen}
                    className={`${isActive ? "active" : ""} nav-item`}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "0",
                        bottom: "-14px",
                        transition: "all ease-in-out 0.2s",
                        width: "0",
                        height: "2.8px",
                        bgcolor: "#f25f0c",
                      }}
                    ></Box>
                    <Typography
                      variant="h4"
                      sx={{ color: "#333", fontSize: "18px" }}
                    >
                      {t("Programs")}
                    </Typography>
                    <ArrowDropDown
                      sx={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-23px",
                        color: "#333",
                      }}
                    />
                  </Box>

                  <Menu
                    anchorEl={anchorElPro}
                    open={Boolean(anchorElPro)}
                    onClose={handleMenuProClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    sx={{ zIndex: "999999999", marginTop: "10px" }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuItemClick("/allpodcaster");
                        setIsActive(true);
                      }}
                    >
                      <Typography sx={{ color: "#000", fontSize: "17px" }}>
                        {t("Podcasters")}
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleMenuItemClick("/allvodcaster");
                        setIsActive(true);
                      }}
                    >
                      <Typography sx={{ color: "#000", fontSize: "17px" }}>
                        {t("Vodcasters")}
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Fragment>
              ) : (
                // Show default navItems for other cases

                navItemsLogout.map((item) => (
                  <Fragment key={item.name}>
                    <NavLink
                      to={item.link}
                      className="nav-item"
                      style={{ position: "relative" }}
                    >
                      <Typography variant="h4" sx={{ color: "#333" }}>
                        {item.name}
                      </Typography>
                      <Box
                        sx={{
                          position: "absolute",
                          left: "0",
                          bottom: "-14px",
                          transition: "all ease-in-out 0.2s",
                          width: "0",
                          height: "2.8px",
                          bgcolor: "#f25f0c",
                        }}
                      ></Box>
                    </NavLink>
                  </Fragment>
                ))
              )}
            </Box>
          ) : (
            !isMenuToggled && (
              <IconButton onClick={handleDrawerToggle}>
                <MenuOutlined sx={{ color: "#333" }} />
              </IconButton>
            )
          )}
          {isNotMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "20px",
              }}
            >
              {isLoggedIn && (
                <>
                  <Avatar
                    src={userDetails.profile}
                    sx={{ cursor: "pointer" }}
                    onClick={handleMenuOpen}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    sx={{ zIndex: "999999999", marginTop: "5px" }}
                  >
                    <MenuItem onClick={() => handleMenuItemClick("/profile")}>
                      {t("My Profile")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuItemClick("/updateinfo")}
                    >
                      {t("Update Profile")}
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick("/favorite")}>
                      {t("Favorite")}
                    </MenuItem>
                    <MenuItem onClick={handleLogoutClick}>
                      {t("Log Out")}
                    </MenuItem>
                  </Menu>
                </>
              )}

              <IconButton
                aria-controls="language-menu"
                aria-haspopup="true"
                onClick={handleMenuLangOpen}
              >
                <LanguageOutlined sx={{ color: "#333" }} />
              </IconButton>
              <Menu
                id="language-menu"
                anchorEl={anchorElLang}
                open={Boolean(anchorElLang)}
                onClose={handleMenuLangClose}
                sx={{ zIndex: "999999999", marginTop: "5px" }}
              >
                <MenuItem onClick={() => handleLanguageSelect("en")}>
                  {t("English")}
                </MenuItem>
                <MenuItem onClick={() => handleLanguageSelect("ar")}>
                  {t("Arabic")}
                </MenuItem>
                <MenuItem onClick={() => handleLanguageSelect("fr")}>
                  {t("French")}
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Box>
      {!isNotMobile && (
        <Box
          sx={{
            position: "fixed",
            right: "0",
            bottom: "0",
            top: "0",
            left: "0",
            display: isMenuToggled ? "" : "block",
            zIndex: "9999",
            visibility: isMenuToggled ? "" : "hidden",
          }}
        >
          <Box
            sx={{
              opacity: isMenuToggled ? "1" : "0",
              transition: " opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              position: "fixed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              right: "0",
              bottom: "0",
              top: "0",
              left: "0",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: "-1",
            }}
            onClick={handleDrawerToggle}
          ></Box>
          <Box
            sx={{
              transform: isMenuToggled ? "none" : "translateX(250px)",
              visibility: isMenuToggled ? "" : "hidden",
              transition: isMenuToggled
                ? "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms"
                : "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

              width: isNotMobile ? "260px" : "270px",
              backgroundColor: "#fff",
              color: "rgba(0, 0, 0, 0.87)",
              boxShadow:
                "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              zIndex: "1200",
              position: "fixed",
              right: "0",
              top: "0",
              outline: "0",
            }}
          >
            {drawer}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navbar;
