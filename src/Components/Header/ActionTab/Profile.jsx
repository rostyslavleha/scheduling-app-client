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
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

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
        <StyledBadge
          badgeContent={null}
          color="secondary"
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <img
            alt={process.env.REACT_APP_DEFAULT_USER_PROFILE_AVATAR}
            src={`${isAuth().profilePhoto}`}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              color: "white",
            }}
          />
        </StyledBadge>
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
