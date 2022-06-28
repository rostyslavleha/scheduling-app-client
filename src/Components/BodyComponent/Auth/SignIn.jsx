import React, { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, Redirect } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuth, authenticate } from "../../../Common/helpers";
import CircularProgress from "@mui/material/CircularProgress";

const SignIn = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    loading: false,
  });

  const { email, password, loading } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        console.log("SignIn Success", response);
        // save the response user in local storage and token in cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: "",
            password: "",
            loading: false,
          });
          toast.success(`${response.data.user.firstName} Welcome!`);
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin/profile")
            : history.push("/profile");
        });
      })
      .catch((error) => {
        console.log("SignIn error", error);
        setValues({ ...values, loading: false });
        toast.error(error.response.data.error);
      });
  };

  const signupForm = () => (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleChange("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={handleChange("password")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
            {loading ? (
              <CircularProgress sx={{ ml: 3 }} color="secondary" size={20} />
            ) : null}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/auth/password/forgot">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );

  return (
    <Fragment>
      <ToastContainer />
      {isAuth() ? <Redirect to="/"></Redirect> : null}
      {signupForm()}
    </Fragment>
  );
};

export default SignIn;
