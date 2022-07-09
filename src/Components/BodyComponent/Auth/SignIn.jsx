import React, { useState, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../../media/logo.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
  CircularProgress,
  Stack,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";

import { isAuth, authenticate } from "../../../Common/helpers";
import GoogleAuth from "./GoogleAuth";

const SignIn = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    loading: false,
  });
  const [errors, setErrors] = useState({});

  const { email, password, loading, showPassword } = values;

  const validate = () => {
    let temp = { ...errors };
    temp.email = email ? "" : "Email is required";
    if (email) {
      temp.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
        ? ""
        : "Email is not valid";
    }
    const isNonWhiteSpace = /^\S*$/;
    const isValidLength = /^.{8,16}$/;
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (password.length === 0) {
      temp.password = "Password is required";
    } else if (!isNonWhiteSpace.test(password)) {
      temp.password = "Password must not contain any white spaces.";
    } else if (!isValidLength.test(password)) {
      temp.password = "Password must be 8-16 Characters Long";
    } else if (!isContainsUppercase.test(password)) {
      temp.password = "Password must have at least one Uppercase Character";
    } else if (!isContainsLowercase.test(password)) {
      temp.password = "Password must have at least one Lowercase Character";
    } else if (!isContainsNumber.test(password)) {
      temp.password = "Password must have at least one digit";
    } else if (!isContainsSymbol.test(password)) {
      temp.password = "Password must have at least one special Character";
    } else {
      temp.password = "";
    }

    setErrors({ ...temp });
    const isValid =
      email && password && Object.values(temp).every((x) => x === "");
    console.log(isValid);
    return isValid;
  };

  const handlePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin/profile")
        : history.push("/profile");
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
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
    }
  };

  const signupForm = () => (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1.5,
          border: "0.125rem solid",
          boxShadow: 10,
          borderRadius: "1.5rem 0 1.5rem 1.5rem",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <img src={Logo} style={{ width: "2.5rem", height: "2.5rem" }} />
          <Typography
            component="h1"
            variant="h1"
            sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
          >
            LOGIN
          </Typography>
        </Stack>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                placeholder="Enter email address"
                autoComplete="email"
                size="small"
                value={email}
                onChange={handleChange("email")}
                sx={{ width: "40ch" }}
                {...(errors["email"] && {
                  error: true,
                  helperText: errors["email"],
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                autoComplete="new-password"
                size="small"
                value={password}
                onChange={handleChange("password")}
                sx={{ width: "40ch" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePasswordVisibility}
                        aria-label="toggle password"
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon></VisibilityOffIcon>
                        ) : (
                          <VisibilityIcon></VisibilityIcon>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...(errors["password"] && {
                  error: true,
                  helperText: errors["password"],
                })}
              />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
            <Typography>
              <Link
                style={{ textDecoration: "none" }}
                to="/auth/password/forgot"
              >
                Forgot Password?
              </Link>{" "}
            </Typography>
          </Stack>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, boxShadow: 10 }}
          >
            Login
            {loading ? (
              <CircularProgress sx={{ ml: 2 }} color="secondary" size={20} />
            ) : (
              <LoginIcon></LoginIcon>
            )}
          </Button>
          <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
            <Typography>
              <Link style={{ textDecoration: "none" }} to="/signup">
                Don't have an account?
              </Link>
            </Typography>
          </Stack>
          <Divider sx={{ mt: 2 }}>
            <Typography justifyContent="center">Login with</Typography>
          </Divider>
          <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
            <GoogleAuth
              informParent={informParent}
              path="google-login"
            ></GoogleAuth>
          </Stack>
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
