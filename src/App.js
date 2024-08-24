import React, { Suspense, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import Loader from "./components/Loader.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Navbar from "./components/shared/navbar/Navbar";
import Footer from "./components/shared/footer/Footer";
import { Toaster } from "react-hot-toast";

// Lazy-loaded components
const Intro = React.lazy(() => import("./pages/intro/Intro"));
const Home = React.lazy(() => import("./pages/home/Home"));
const About = React.lazy(() => import("./pages/about/About"));
const Contact = React.lazy(() => import("./pages/contact/Contact"));
const Plans = React.lazy(() => import("./pages/plans/Plans"));
const EmailSubmissionForm = React.lazy(() =>
  import("./pages/auth/EmailSubmissionForm")
);
const Password = React.lazy(() => import("./pages/auth/Password"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Reset = React.lazy(() => import("./pages/auth/Reset"));
const VerifyOtp = React.lazy(() => import("./pages/auth/VerifyOtp"));
const UpdateUserInfo = React.lazy(() => import("./pages/auth/UpdateUserInfo"));
const AllPodcaster = React.lazy(() => import("./pages/podcasts/AllPodcaster"));
const CreatePodcast = React.lazy(() =>
  import("./pages/podcasts/CreatePodcast")
);
const PodcastDetail = React.lazy(() =>
  import("./pages/podcasts/PodcastDetail")
);
const AllBroadcasts = React.lazy(() => import("./pages/live/AllBroadcasts"));
const Rooms = React.lazy(() => import("./pages/srdHouse/Rooms"));
const Room = React.lazy(() => import("./pages/srdHouse/Room"));
const ChatRoomPage = React.lazy(() =>
  import("./pages/chatRoom/ChatRoomPage.jsx")
);
const GoLive = React.lazy(() => import("./pages/live/GoLive"));
const BlogsList = React.lazy(() => import("./pages/blogs/BlogsList"));
const BlogDetail = React.lazy(() => import("./pages/blogs/BlogDetail"));
const CreateBlog = React.lazy(() => import("./pages/blogs/CreateBlog"));
const AllVodcaster = React.lazy(() => import("./pages/vodcasts/AllVodcaster"));
const CreateVodcast = React.lazy(() =>
  import("./pages/vodcasts/CreateVodcasts")
);
const VodcastDetail = React.lazy(() =>
  import("./pages/vodcasts/VodcastDetail")
);
const UserProfile = React.lazy(() => import("./pages/userProfile/UserProfile"));
const Favorite = React.lazy(() => import("./pages/favorite/Favorite"));
const PodcastrtPlayLists = React.lazy(() =>
  import("./pages/podcasts/PodcastrtPlayLists")
);
const VodcastrtPlayLists = React.lazy(() =>
  import("./pages/vodcasts/VodcastrtPlayLists")
);

function PublicRoute({ children }) {
  const isAuth = useSelector((state) => state.user.isAuth);
  // const isAuth = true;

  return isAuth ? <Navigate to="/home" replace /> : children;
}

function PrivateRoute({ children }) {
  const isAuth = useSelector((state) => state.user.isAuth);
  // const isAuth = true;

  return isAuth ? children : <Navigate to="/login" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Box className="app">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <BrowserRouter>
        <ScrollToTop />
        <CssBaseline />
        <Suspense fallback={<Loader />}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <EmailSubmissionForm />
                </PublicRoute>
              }
            />
            <Route
              path="/login/password"
              element={
                <PublicRoute>
                  <Password />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/reset"
              element={
                <PublicRoute>
                  <Reset />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOtp />
                </PublicRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            {/** <Route path="/plans" element={<PrivateRoute><Plans /></PrivateRoute>} />*/}
            <Route
              path="/updateinfo"
              element={
                <PrivateRoute>
                  <UpdateUserInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/allpodcaster"
              element={
                <PrivateRoute>
                  <AllPodcaster />
                </PrivateRoute>
              }
            />
            <Route
              path="/podcasts/createpodcasts"
              element={
                <PrivateRoute>
                  <CreatePodcast />
                </PrivateRoute>
              }
            />
            <Route
              path="/podcaster/playlists/podcasts"
              element={
                <PrivateRoute>
                  <PodcastDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/allvodcaster"
              element={
                <PrivateRoute>
                  <AllVodcaster />
                </PrivateRoute>
              }
            />
            <Route
              path="/vodcasts/createvodcasts"
              element={
                <PrivateRoute>
                  <CreateVodcast />
                </PrivateRoute>
              }
            />
            <Route
              path="/vodcaster/playlists/vodcasts"
              element={
                <PrivateRoute>
                  <VodcastDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/allbroadcasts"
              element={
                <PrivateRoute>
                  <AllBroadcasts />
                </PrivateRoute>
              }
            />
            <Route
              path="/srdhouse"
              element={
                <PrivateRoute>
                  <Rooms />
                </PrivateRoute>
              }
            />
            <Route
              path="/srdhouse/room/:id"
              element={
                <PrivateRoute>
                  <Room />
                </PrivateRoute>
              }
            />
            <Route
              path="/live/room/:id"
              element={
                <PrivateRoute>
                  <GoLive />
                </PrivateRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <PrivateRoute>
                  <BlogsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <PrivateRoute>
                  <BlogDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/blogs/createblog"
              element={
                <PrivateRoute>
                  <CreateBlog />
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/favorite"
              element={
                <PrivateRoute>
                  <Favorite />
                </PrivateRoute>
              }
            />
            <Route
              path="/podcaster/playlists"
              element={
                <PrivateRoute>
                  <PodcastrtPlayLists />
                </PrivateRoute>
              }
            />
            <Route
              path="/vodcaster/playlists"
              element={
                <PrivateRoute>
                  <VodcastrtPlayLists />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<ErrorPage errorMsg="Error 404 Page Not Found" />}
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatRoomPage />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </Box>
  );
}

export default App;
