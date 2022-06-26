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
import PostAddIcon from "@mui/icons-material/PostAdd";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function SidenavData({ handleDrawerClose }) {
  const classes = useStyles();
  const listItemData = [
    { label: "Dashboard", link: "/", icon: <DashboardIcon /> },
    { label: "Blog Post", link: "/blog", icon: <BookIcon /> },
    { label: "Link 1", link: "/link1", icon: <PostAddIcon /> },
    {
      label: "Notification",
      link: "/notification",
      icon: <NotificationsActiveIcon />,
    },
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
}
