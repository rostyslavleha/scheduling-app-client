import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../../../Common/helpers";

const Landing = ({ match, history }) => {
  const landingHeader = () => <Stack spacing={2} direction="row"></Stack>;

  return (
    <div>
      <h3>Landing</h3>
      {landingHeader()}
    </div>
  );
};

export default Landing;
