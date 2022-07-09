import React, { useState, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../../media/logo.svg";
import { Link } from "react-router-dom";
import {
  Stack,
  CircularProgress,
  TextField,
  CssBaseline,
  Container,
  Grid,
  Button,
  Box,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
    loading: false,
  });
  const [errors, setErrors] = useState({});

  const { email, loading } = values;

  const validate = () => {
    let temp = { ...errors };
    temp.email = email ? "" : "Email is required";
    if (email) {
      temp.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
        ? ""
        : "Email is not valid";
    }
    setErrors({ ...temp });
    const isValid = email && Object.values(temp).every((x) => x === "");
    console.log(isValid);
    return isValid;
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setValues({ ...values, loading: true });
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/forgot-password`,
        data: { email },
      })
        .then((response) => {
          console.log(" Forgot Password Success", response);
          toast.success(response.data.message);
          setValues({ ...values, loading: false, email: "" });
        })
        .catch((error) => {
          console.log("Forgot Password Failure", error);
          setValues({ ...values, loading: false });
          if (error && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error(error.response.data.errors);
          }
        });
    }
  };

  const forgotPasswordForm = () => (
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
          boxShadow: 12,
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
            FORGOT PASSWORD
          </Typography>
        </Stack>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                size="small"
                id="email"
                label="Email"
                name="email"
                placeholder="Enter email address"
                autoComplete="email"
                value={email}
                sx={{ width: "40ch" }}
                onChange={handleChange("email")}
                {...(errors["email"] && {
                  error: true,
                  helperText: errors["email"],
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
            Send
            {loading ? (
              <CircularProgress sx={{ ml: 2 }} color="secondary" size={20} />
            ) : (
              <SendIcon></SendIcon>
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
      {forgotPasswordForm()}
    </Fragment>
  );
};

export default ForgotPassword;
