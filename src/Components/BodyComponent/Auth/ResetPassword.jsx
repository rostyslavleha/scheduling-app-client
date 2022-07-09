import React, { useState, Fragment, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import { Stack, IconButton, InputAdornment } from "@mui/material";
import Logo from "../../../media/logo.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const ResetPassword = ({ match }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    newPassword: "",
    confirmNewPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    token: "",
    loading: false,
  });
  const [errors, setErrors] = useState({});

  const {
    firstName,
    lastName,
    newPassword,
    confirmNewPassword,
    token,
    loading,
    showPassword,
    showConfirmPassword,
  } = values;

  useEffect(() => {
    let token = match.params.token;
    console.log(jwt.decode(token));
    let { firstName, lastName } = jwt.decode(token);
    if (token) {
      setValues({ ...values, firstName, lastName, token });
    }
  }, []);

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

    const isNonWhiteSpace = /^\S*$/;
    const isValidLength = /^.{8,16}$/;
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (newPassword.length === 0) {
      temp.newPassword = "Password is required";
    } else if (!isNonWhiteSpace.test(newPassword)) {
      temp.newPassword = "Password must not contain any white spaces.";
    } else if (!isValidLength.test(newPassword)) {
      temp.newPassword = "Password must be 8-16 Characters Long";
    } else if (!isContainsUppercase.test(newPassword)) {
      temp.newPassword = "Password must have at least one Uppercase Character";
    } else if (!isContainsLowercase.test(newPassword)) {
      temp.newPassword = "Password must have at least one Lowercase Character";
    } else if (!isContainsNumber.test(newPassword)) {
      temp.newPassword = "Password must have at least one digit";
    } else if (!isContainsSymbol.test(newPassword)) {
      temp.newPassword = "Password must have at least one special Character";
    } else {
      temp.newPassword = "";
    }

    if (confirmNewPassword.length === 0) {
      temp.confirmNewPassword = "Password is required";
    } else if (!isNonWhiteSpace.test(confirmNewPassword)) {
      temp.confirmNewPassword = "Password must not contain any white spaces.";
    } else if (!isValidLength.test(confirmNewPassword)) {
      temp.confirmNewPassword = "Password must be 8-16 Characters Long";
    } else if (!isContainsUppercase.test(confirmNewPassword)) {
      temp.confirmNewPassword =
        "Password must have at least one Uppercase Character";
    } else if (!isContainsLowercase.test(confirmNewPassword)) {
      temp.confirmNewPassword =
        "Password must have at least one Lowercase Character";
    } else if (!isContainsNumber.test(confirmNewPassword)) {
      temp.confirmNewPassword = "Password must have at least one digit";
    } else if (!isContainsSymbol.test(confirmNewPassword)) {
      temp.confirmNewPassword =
        "Password must have at least one special Character";
    } else {
      temp.confirmNewPassword = "";
    }

    setErrors({ ...temp });
    const isValid =
      newPassword &&
      confirmNewPassword &&
      Object.values(temp).every((x) => x === "");
    console.log(isValid);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setValues({ ...values, loading: true });
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/reset-password`,
        data: { newPassword, confirmNewPassword, resetPasswordLink: token },
      })
        .then((response) => {
          console.log(" Reset Password Success", response);
          toast.success(response.data.message);
          setValues({
            ...values,
            loading: false,
            newPassword: "",
            confirmNewPassword: "",
          });
        })
        .catch((error) => {
          console.log("Reset Password Failure", error);
          setValues({ ...values, loading: false });
          if (error && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error(error.response.data.errors);
          }
        });
    }
  };

  const resetPasswordForm = () => (
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
            RESET ACCOUNT PASSWORD
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography component="h6" variant="overline">
            Welcome back {firstName} {lastName}
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
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
                size="small"
                autoComplete="new-password"
                value={newPassword}
                sx={{ width: "40ch" }}
                onChange={handleChange("newPassword")}
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
                {...(errors["newPassword"] && {
                  error: true,
                  helperText: errors["newPassword"],
                })}
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
                placeholder="Confirm new password"
                size="small"
                value={confirmNewPassword}
                sx={{ width: "40ch" }}
                onChange={handleChange("confirmNewPassword")}
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
                {...(errors["confirmNewPassword"] && {
                  error: true,
                  helperText: errors["confirmNewPassword"],
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
            Update
            {loading ? (
              <CircularProgress sx={{ ml: 2 }} color="secondary" size={20} />
            ) : (
              <RestartAltIcon></RestartAltIcon>
            )}
          </Button>
          <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
            <Typography>
              <Link style={{ textDecoration: "none" }} to="/signin">
                Login
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Container>
  );

  return (
    <Fragment>
      <ToastContainer />
      {resetPasswordForm()}
    </Fragment>
  );
};

export default ResetPassword;
