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

const SideNavData = ({ handleDrawerClose }) => {
  const classes = useStyles();
  const listItemData = [
    { label: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
    { label: "Blog Post", link: "/blog", icon: <BookIcon /> },
  ];

  return (
    <List>
      {listItemData.map((item, i) => (
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
      ))}
    </List>
  );
};

export default SideNavData;
