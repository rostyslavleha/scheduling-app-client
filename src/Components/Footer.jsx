import React from "react";
import { Box } from "@mui/material";
import { useStyles } from "./BodyComponent/BodyStyles";

export default function Footer() {
  const classes = useStyles();

  return <Box className={classes.footer}>Footer</Box>;
}
