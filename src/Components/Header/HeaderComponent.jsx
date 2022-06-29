import React, { Fragment } from "react";
import { Box } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import { useStyles } from "./HeaderStyle";
import NavbarComponent from "./NavbarComponent";
import SideNav from "./SideNav";
import BlogPost from "../BodyComponent/BlogPost";
import Dashboard from "../BodyComponent/Dashboard";
import UserProfile from "../BodyComponent/UserProfile";
import Availability from "../BodyComponent/Availability";
import RequestedHubAppointments from "../BodyComponent/RequestedHubAppointments";
import AdminProfile from "../BodyComponent/AdminProfile";
import Landing from "../BodyComponent/Auth/Landing";
import ForgotPassword from "../BodyComponent/Auth/ForgotPassword";
import ResetPassword from "../BodyComponent/Auth/ResetPassword";
import SignUp from "../BodyComponent/Auth/SignUp";
import SignIn from "../BodyComponent/Auth/SignIn";
import Activate from "../BodyComponent/Auth/Activate";
import Stories from "../BodyComponent/AdminComponents/Stories";
import NewStory from "../BodyComponent/AdminComponents/NewStory";
import UpdateStory from "../BodyComponent/AdminComponents/UpdateStory";
import UserRoute from "../BodyComponent/Auth/UserRoute";
import AdminRoute from "../BodyComponent/Auth/AdminRoute";

export default function HeaderComponent() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
  };
  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Landing}></Route>
        <Route exact path="/signin" component={SignIn}></Route>
        <Route exact path="/signup" render={() => <SignUp />}></Route>
        <Route exact path="/auth/activate/:token" component={Activate}></Route>
        <Route
          exact
          path="/auth/password/forgot"
          component={ForgotPassword}
        ></Route>
        <Route
          exact
          path="/auth/password/reset/:token"
          component={ResetPassword}
        ></Route>
        <Box className={classes.wrapper}>
          <NavbarComponent handleDrawerToggle={handleDrawerToggle} />
          <SideNav
            mobileOpen={mobileOpen}
            handleDrawerClose={handleDrawerClose}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/blog" component={BlogPost} />
          <UserRoute exact path="/profile" component={UserProfile}></UserRoute>
          <UserRoute
            exact
            path="/availability"
            component={Availability}
          ></UserRoute>
          <UserRoute
            exact
            path="/request/appointment"
            component={RequestedHubAppointments}
          ></UserRoute>
          <AdminRoute
            exact
            path="/admin/profile"
            component={AdminProfile}
          ></AdminRoute>
          <AdminRoute
            path="/admin/stories"
            exact
            component={Stories}
          ></AdminRoute>
          <AdminRoute
            path="/admin/newStory"
            exact
            component={NewStory}
          ></AdminRoute>
          <AdminRoute
            path="/admin/story/update/:storyId"
            exact
            component={UpdateStory}
          ></AdminRoute>
        </Box>
      </Switch>
    </Fragment>
  );
}
