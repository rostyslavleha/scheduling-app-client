import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import jwt from "jsonwebtoken";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// match is injected from BrowserRouter which is provide as a prop to the Activate component as it is wrapped in the BrowserRouter
const Activate = ({ match }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    token: "",
    loading: false,
  });

  useEffect(() => {
    console.log(match);
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
        <Typography component="h3" variant="h5">
          Account Activation
        </Typography>
        <Typography component="h3" variant="h6">
          Welcome {firstName} {lastName}
        </Typography>
        <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={clickSubmit}>
          Activate
          {loading ? <CircularProgress color="secondary" size={20} /> : null}
        </Button>
      </Box>
    </Container>
  );

  return (
    <div className="col-md-6 offset-md-3 mt-3">
      <ToastContainer></ToastContainer>
      {activationLink()}
    </div>
  );
};

export default Activate;
