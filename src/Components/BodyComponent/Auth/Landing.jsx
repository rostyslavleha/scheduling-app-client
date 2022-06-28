import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../../../Common/helpers";

const Landing = ({ match, history }) => {
  const landingHeader = () => (
    <Stack spacing={2} direction="row">
      {!isAuth() && (
        <div>
          {(match.path === "/signup" || match.path === "/") && (
            <Link
              to="/signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" sx={{ mt: 3, mb: 2 }}>
                Login
              </Button>
            </Link>
          )}
          {(match.path === "/signin" || match.path === "/") && (
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button variant="contained" sx={{ mt: 3, mb: 2 }}>
                Register
              </Button>
            </Link>
          )}
        </div>
      )}

      {isAuth() &&
        (isAuth().role === "spoke" ||
          isAuth().role === "hub" ||
          isAuth().role === "admin") && (
          <div className="username">
            {isAuth().firstName} {isAuth().lastName}
          </div>
        )}
      {isAuth() && (
        <div>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </Stack>
  );

  return (
    <div>
      <h3>Landing</h3>
      {landingHeader()}
    </div>
  );
};

export default withRouter(Landing);
