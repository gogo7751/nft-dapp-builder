import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading({ enabled }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={enabled}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
