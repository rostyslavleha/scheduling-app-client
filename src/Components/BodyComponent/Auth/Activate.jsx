import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import jwt from "jsonwebtoken";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { Box, Stack, Grid } from "@mui/material";
import Logo from "../../../media/logo.svg";
import DoneIcon from "@mui/icons-material/Done";
// match is injected from BrowserRouter which is provide as a prop to the Activate component as it is wrapped in the BrowserRouter
const Activate = ({ match }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    token: "",
    loading: false,
  });

  useEffect(() => {
    let token = match.params.token;
    let { firstName, lastName } = jwt.decode(token);
    if (token) {
      setValues({ ...values, firstName, lastName, token });
    }
  }, []);

  const { firstName, lastName, token, loading } = values;

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      loading: true,
    });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log("ACCOUNT ACTIVATION", response);
        toast.success(response.data.message);
        setValues({
          ...values,
          loading: false,
          redirect: true,
        });
      })
      .catch((error) => {
        console.log(error);
        setValues({
          ...values,
          loading: false,
        });
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => (
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
            ACTIVATE ACCOUNT
          </Typography>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6}>
              <Typography component="h6" variant="overline">
                Thank you{" "}
                <strong>
                  {firstName} {lastName}
                </strong>{" "}
                for signing up with <strong>promote</strong>.
              </Typography>
              <Typography component="h6" variant="subtitle1">
                Your account is ready to use. To get started activate your
                account now.
              </Typography>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="center">
            <Button
              variant="contained"
              sx={{ mt: 2, boxShadow: 10 }}
              onClick={clickSubmit}
            >
              Activate
              {loading ? (
                <CircularProgress sx={{ ml: 2 }} color="secondary" size={20} />
              ) : (
                <DoneIcon></DoneIcon>
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );

  return (
    <Fragment>
      <ToastContainer></ToastContainer>
      {activationLink()}
    </Fragment>
  );
};

export default Activate;
