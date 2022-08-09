import { Drawer, Hidden } from "@mui/material";
import React from "react";
import { useStyles } from "./HeaderStyle";
import SideNavData from "./SidenavData";

const SideNav = ({ mobileOpen, handleDrawerClose, handleDrawerToggle }) => {
  const classes = useStyles();

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* Hidden on bigger Size  */}
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={"left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <SideNavData handleDrawerClose={handleDrawerClose} />
        </Drawer>
      </Hidden>
      {/* visible on screen greater than 600px */}
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <SideNavData handleDrawerClose={handleDrawerClose} />
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default SideNav;
