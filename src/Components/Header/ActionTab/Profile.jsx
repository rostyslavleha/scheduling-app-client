import React, { Fragment } from "react";
import {
  Badge,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
} from "@mui/material";
import { useStyles } from "../HeaderStyle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Profile = ({ history }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // console.log("handleClicked ", event.currentTarget);
  };
  const handleClose = (action) => {
    setAnchorEl(null);
  };

  const dropDownData = [
    { label: "Profile", icon: <AccountCircleIcon /> },
    { label: "Logout", icon: <ExitToAppIcon /> },
  ];

  return (
    <Fragment>
      <IconButton
        aria-controls="profile"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <Badge badgeContent={null} color="secondary">
          <img
            alt="noimage"
            src="https://firebasestorage.googleapis.com/v0/b/promote-b3a12.appspot.com/o/userAvatar%2FdefaultAvatar.svg?alt=media&token=57a9ef20-56c2-488c-9e05-3755f6206ec5"
            className={classes.navImg}
          />
        </Badge>
      </IconButton>
      <Menu
        id="profile"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        placement="bottom-start"
      >
        <List dense={true} className={classes.dropdownlist}>
          {dropDownData.map((item, i) => (
            <ListItem
              key={i}
              component={Button}
              onClick={handleClose}
              className={classes.listItem}
            >
              <ListItemAvatar>{item.icon}</ListItemAvatar>
              <ListItemText primary={item.label}></ListItemText>
            </ListItem>
          ))}
        </List>
      </Menu>
    </Fragment>
  );
};

export default Profile;
