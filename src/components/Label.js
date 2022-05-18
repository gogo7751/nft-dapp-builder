import React from "react";
import { Typography } from "@mui/material";

function LargeLabel(props) {
  return (
    <Typography
      sx={{
        fontWeight: 600,
        //marginTop: 2,
        marginBottom: 3,
      }}
      variant="h5"
      color="text"
      gutterBottom
    >
      {props.children}
    </Typography>
  );
}

function Label(props) {
  const sx = {};
  sx["marginTop"] = props.gutterTop ? 3 : -1;
  sx["marginBottom"] = props.gutterBottom ? 4 : 2;

  return (
    <Typography sx={props.sx ? props.sx : sx} variant="h6" color="text">
      {props.children}
    </Typography>
  );
}

export { LargeLabel, Label };
