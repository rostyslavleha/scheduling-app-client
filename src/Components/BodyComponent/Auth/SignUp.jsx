import React, { useState, Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  TextField,
  Grid,
  Box,
  Radio,
  RadioGroup,
  Typography,
  Container,
  CssBaseline,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import { isAuth, authenticate } from "../../../Common/helpers";
import GoogleAuth from "./GoogleAuth";

const SignUp = ({ history }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "spoke",
    loading: false,
  });

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    loading,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = async (response) => {
    await authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin/profile")
        : history.push("/profile");
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { firstName, lastName, email, password, confirmPassword, role },
    })
      .then((response) => {
        console.log(response);
        setValues({
          ...values,
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          loading: false,
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        if (error.response.data.errors) {
          console.log(error);
          setValues({ ...values, loading: false });
          toast.error(error.response.data.errors);
        }
        console.log(error);
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RadioGroup row name="row-radio-buttons-group" value={role}>
                <FormControlLabel
                  checked={role === "spoke"}
                  value="spoke"
                  control={<Radio />}
                  label="Spoke Clinician"
                  onChange={handleChange("role")}
                />
                <FormControlLabel
                  checked={role === "hub"}
                  value="hub"
                  control={<Radio />}
                  label="Hub Clinician"
                  onChange={handleChange("role")}
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName}
                onChange={handleChange("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={handleChange("lastName")}
              />
            </Grid>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up{" "}
            {loading ? (
              <CircularProgress sx={{ ml: 3 }} color="secondary" size={20} />
            ) : null}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
          <GoogleAuth
            informParent={informParent}
            path="google-register"
          ></GoogleAuth>
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

export default withRouter(SignUp);
