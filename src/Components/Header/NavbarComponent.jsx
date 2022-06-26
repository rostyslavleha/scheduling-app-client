import React from "react";
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useStyles } from "./HeaderStyle";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import Profile from "./ActionTab/Profile";

export default function NavbarComponent({ handleDrawerToggle }) {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Box style={{ display: "flex" }}>
          <Typography variant="h6" className={classes.logo}>
            {"<AdminPannel />"}
          </Typography>
        </Box>
        <Hidden smDown>
          <Box>
            <Profile />
          </Box>
        </Hidden>
        <Hidden mdUp>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuRoundedIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
