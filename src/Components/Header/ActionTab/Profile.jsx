import React, { Fragment } from "react";
import {
  Badge,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { isAuth, signout } from "../../../Common/helpers";
import { Link, withRouter } from "react-router-dom";

const Profile = ({ history }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // console.log("handleClicked ", event.currentTarget);
  };
  const handleClose = (action) => {
    setAnchorEl(null);
  };

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
            alt={process.env.REACT_APP_DEFAULT_USER_PROFILE_AVATAR}
            src={isAuth().profilePhoto}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              color: "white",
            }}
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
        <List dense={true} sx={{ minWidth: "150px", maxWidth: "300px" }}>
          <ListItem component={Button}>
            <Typography variant="overline" sx={{ textTransform: "uppercase" }}>
              {isAuth().firstName} {isAuth().lastName}
            </Typography>
          </ListItem>
          <Divider></Divider>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <ListItem
              component={Button}
              onClick={handleClose}
              sx={{ textTransform: "uppercase" }}
            >
              <Stack direction="row" alignItems="center">
                <AccountCircleIcon sx={{ mr: 2 }}></AccountCircleIcon>
                <ListItemText primary="Profile"></ListItemText>
              </Stack>
            </ListItem>
          </Link>
          <ListItem
            component={Button}
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
            sx={{ textTransform: "uppercase" }}
          >
            <Stack direction="row" alignItems="center">
              <ExitToAppIcon sx={{ mr: 2 }}></ExitToAppIcon>
              <ListItemText primary="Logout"></ListItemText>
            </Stack>
          </ListItem>
        </List>
      </Menu>
    </Fragment>
  );
};

export default withRouter(Profile);
