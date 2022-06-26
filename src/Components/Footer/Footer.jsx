import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useStyles } from "../BodyComponent/BodyStyles";

const Footer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" color="textSecondary" align="center">
            All right reserved 2022
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
