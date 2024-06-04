import { Box } from "@mui/material";
import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        display: "flex",
      }}
    >
      <InfinitySpin color="#707070" ariaLabel="loading" />
    </Box>
  );
};

export default Loader;
