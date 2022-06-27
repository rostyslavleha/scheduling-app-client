import React, { Fragment } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useStyles } from "./HeaderStyle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import { isAuth } from "../../Common/helpers";

const SideNavData = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const listItemData = [
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: <DashboardIcon />,
      access: ["hub"],
    },
    {
      label: "Blog Post",
      link: "/blog",
      icon: <BookIcon />,
      access: ["hub"],
    },
    {
      label: "Profile",
      link: "/profile",
      icon: <PersonIcon />,
      access: ["hub", "spoke"],
    },
  ];

  return (
    <List>
      {listItemData.map(
        (item, i) =>
          isAuth() &&
          item.access.includes(isAuth().role) && (
            <Fragment key={i}>
              <Button
                size="small"
                onClick={() => handleDrawerClose()}
                className={classes.navButton}
              >
                <ListItem
                  exact
                  key={i}
                  component={NavLink}
                  to={item.link}
                  className={classes.navlink}
                  activeClassName={classes.selectedNav}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                </ListItem>
              </Button>
            </Fragment>
          )
      )}
    </List>
  );
};

export default SideNavData;
