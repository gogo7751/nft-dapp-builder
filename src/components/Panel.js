import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    boxShadow: "0px 0px 25px rgba(0,0,0,0.1)",
    marginTop: (settings) => {
      return settings.top === undefined
        ? theme.spacing(4)
        : theme.spacing(settings.top);
    },
    marginBottom: (settings) => {
      return settings.bottom === undefined
        ? theme.spacing(4)
        : theme.spacing(settings.bottom);
    },
    height: (settings) => {
      return settings.height === undefined
        ? null
        : theme.spacing(settings.height);
    },
  },
}));

export default function Panel({ top, bottom, height, children }) {
  const settings = { top, bottom, height };
  const classes = useStyles(settings);
  return (
    <Paper
      className={classes.paper}
      variant="outlined"
      sx={{ borderRadius: 4 }}
    >
      {children}
    </Paper>
  );
}
