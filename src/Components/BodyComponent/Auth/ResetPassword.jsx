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

const ResetPassword = ({ match }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    newPassword: "",
    confirmNewPassword: "",
    token: "",
    loading: false,
  });

  const {
    firstName,
    lastName,
    newPassword,
    confirmNewPassword,
    token,
    loading,
  } = values;

  useEffect(() => {
    let token = match.params.token;
    let { firstName, lastName } = jwt.decode(token);
    if (token) {
      setValues({ ...values, firstName, lastName, token });
    }
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
  };

  const resetPasswordForm = () => (
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
          Reset Password
        </Typography>

        <Typography component="h1" variant="h6">
          Welcome {firstName} {lastName}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={handleChange("newPassword")}
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
                value={confirmNewPassword}
                onChange={handleChange("confirmNewPassword")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
            {loading ? (
              <CircularProgress sx={{ ml: 3 }} color="secondary" size={20} />
            ) : null}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              Go back <Link to="/signin">Login</Link>
            </Grid>
          </Grid>
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
