import React, { Fragment } from "react";
import { Box } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import { useStyles } from "./HeaderStyle";
import NavbarComponent from "./NavbarComponent";
import SideNav from "./SideNav";
import BlogPost from "../BodyComponent/BlogPost";
import Dashboard from "../BodyComponent/Dashboard";
import Landing from "../Landing/Landing";

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
        <Route exact path="/" render={() => <Landing />}></Route>
        <div className={classes.wrapper}>
          <NavbarComponent handleDrawerToggle={handleDrawerToggle} />
          <SideNav
            mobileOpen={mobileOpen}
            handleDrawerClose={handleDrawerClose}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Route exact path="/dashboard" render={() => <Dashboard />} />
          <Route exact path="/blog" render={() => <BlogPost />} />\{" "}
        </div>
      </Switch>
    </Fragment>
  );
}
