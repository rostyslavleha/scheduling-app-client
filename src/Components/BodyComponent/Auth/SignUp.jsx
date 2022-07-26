import React, { useState, Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../../media/logo.svg";

import {
  Button,
  TextField,
  Grid,
  Stack,
  Box,
  Radio,
  RadioGroup,
  Typography,
  Container,
  CssBaseline,
  FormControlLabel,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { isAuth, authenticate } from "../../../Common/helpers";
import GoogleAuth from "./GoogleAuth";

const SignUp = ({ history }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    role: "spoke",
    loading: false,
  });
  const [errors, setErrors] = useState({});

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    loading,
    showPassword,
    showConfirmPassword,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handlePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleConfirmPasswordVisibility = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const validate = () => {
    let temp = { ...errors };

    const isNameValid = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    if (firstName.length === 0) {
      temp.firstName = "First Name is required";
    } else if (!isNameValid.test(firstName)) {
      temp.firstName = "First Name invalid";
    } else {
      temp.firstName = "";
    }

    if (lastName.length === 0) {
      temp.lastName = "Last Name is required";
    } else if (!isNameValid.test(lastName)) {
      temp.lastName = "Last Name invalid";
    } else {
      temp.lastName = "";
    }

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
      temp.password = "Password must be between 8-16 characters";
    } else if (!isContainsUppercase.test(password)) {
      temp.password = "Password must have at least one uppercase Character";
    } else if (!isContainsLowercase.test(password)) {
      temp.password = "Password must have at least one lowercase Character";
    } else if (!isContainsNumber.test(password)) {
      temp.password = "Password must have at least one number";
    } else if (!isContainsSymbol.test(password)) {
      temp.password = "Password must have at least one special Character";
    } else {
      temp.password = "";
    }

    if (confirmPassword.length === 0) {
      temp.confirmPassword = "Password is required";
    } else if (!isNonWhiteSpace.test(confirmPassword)) {
      temp.confirmPassword = "Password must not contain any white spaces.";
    } else if (!isValidLength.test(confirmPassword)) {
      temp.confirmPassword = "Password must be 8-16 Characters Long";
    } else if (!isContainsUppercase.test(confirmPassword)) {
      temp.confirmPassword =
        "Password must have at least one Uppercase Character";
    } else if (!isContainsLowercase.test(confirmPassword)) {
      temp.confirmPassword =
        "Password must have at least one Lowercase Character";
    } else if (!isContainsNumber.test(confirmPassword)) {
      temp.confirmPassword = "Password must have at least one digit";
    } else if (!isContainsSymbol.test(confirmPassword)) {
      temp.confirmPassword =
        "Password must have at least one special Character";
    } else {
      temp.confirmPassword = "";
    }

    setErrors({ ...temp });
    const isValid =
      email &&
      password &&
      firstName &&
      lastName &&
      confirmPassword &&
      Object.values(temp).every((x) => x === "");
    console.log(isValid);
    return isValid;
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
    if (validate()) {
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
          padding: 3.5,
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
            Sign up
          </Typography>
        </Stack>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            xs={12}
            sx={{ border: "1px", mb: 2, ml: 3 }}
          >
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
          </Stack>
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
                autoComplete="given-name"
                name="firstName"
                id="firstName"
                label="First Name"
                placeholder="Enter first name"
                size="small"
                value={firstName}
                onChange={handleChange("firstName")}
                sx={{ width: "40ch" }}
                {...(errors["firstName"] && {
                  error: true,
                  helperText: errors["firstName"],
                })}
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
                placeholder="Enter last name"
                size="small"
                value={lastName}
                onChange={handleChange("lastName")}
                sx={{ width: "40ch" }}
                {...(errors["lastName"] && {
                  error: true,
                  helperText: errors["lastName"],
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                placeholder="Enter email address"
                autoComplete="email"
                size="small"
                value={email}
                onChange={handleChange("email")}
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
                size="small"
                autoComplete="new-password"
                value={password}
                sx={{ width: "40ch" }}
                onChange={handleChange("password")}
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
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm password"
                autoComplete="new-password"
                size="small"
                value={confirmPassword}
                onChange={handleChange("confirmPassword")}
                sx={{ width: "40ch" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleConfirmPasswordVisibility}
                        aria-label="toggle password"
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon></VisibilityOffIcon>
                        ) : (
                          <VisibilityIcon></VisibilityIcon>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...(errors["confirmPassword"] && {
                  error: true,
                  helperText: errors["confirmPassword"],
                })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, boxShadow: 10 }}
          >
            Create Account
            {loading ? (
              <CircularProgress sx={{ ml: 2 }} color="secondary" size={20} />
            ) : (
              <HowToRegIcon></HowToRegIcon>
            )}
          </Button>
          <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
            <Typography>
              <Link style={{ textDecoration: "none" }} to="/signin">
                Already have an account?
              </Link>
            </Typography>
          </Stack>
          <Divider sx={{ mt: 2 }}>
            <Typography justifyContent="center">Sign up with</Typography>
          </Divider>
          <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
            <GoogleAuth
              informParent={informParent}
              path="google-register"
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

export default withRouter(SignUp);
