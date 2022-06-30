import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import CircularProgress from "@mui/material/CircularProgress";
import AppointmentInfoById from "./AppointmentInfoById";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";

import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const RequestedHubAppointmentById = ({ match }) => {
  const [values, setValues] = useState({
    appointmentByIdInfo: {},
    open: false,
    loading: true,
  });
  const token = getCookie("token");
  const appointmentId = match.params.appointmentId;

  const { appointmentByIdInfo, loading, open } = values;

  const handleClickOpen = () => {
    setValues({ ...values, open: true });
  };
  const handleClose = () => {
    setValues({ ...values, open: false });
  };

  const getRequestedAppointmentInfo = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/request-appointment/${appointmentId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setValues({
          ...values,
          appointmentByIdInfo: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        setValues({
          ...values,
          loading: false,
        });
        console.log("Appointment by Id Info ERROR", error);
      });
  };

  useEffect(() => {
    getRequestedAppointmentInfo();
  }, []);

  return (
    <Fragment>
      <NavBreadCrumb
        path={`/request/appointment/${appointmentId}`}
        name={`AppointmentId- ${appointmentId}`}
      ></NavBreadCrumb>
      {loading ? (
        <div>
          <CircularProgress color="inherit" size={20} />
        </div>
      ) : (
        <Fragment>
          <AppointmentInfoById
            appointmentByIdInfo={appointmentByIdInfo}
          ></AppointmentInfoById>
          <Stack
            mt={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Tooltip
              title={
                appointmentByIdInfo.status === "rejected"
                  ? "Can not approve a rejected appointment request"
                  : "Click to approve request"
              }
            >
              <span>
                <Button
                  color="success"
                  variant="contained"
                  disabled={
                    appointmentByIdInfo.status === "rejected" ? true : false
                  }
                  onClick={handleClickOpen}
                >
                  Approve<CheckCircleIcon></CheckCircleIcon>
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                appointmentByIdInfo.status === "rejected"
                  ? "Appointment already rejected"
                  : "Click to reject request"
              }
            >
              <span>
                <Button
                  color="error"
                  variant="contained"
                  disabled={
                    appointmentByIdInfo.status === "rejected" ? true : false
                  }
                  onClick={handleClickOpen}
                >
                  Reject<CancelIcon></CancelIcon>
                </Button>
              </span>
            </Tooltip>
          </Stack>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Confirm Request
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                Are you sure you want to submit the request?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
              <Button autoFocus onClick={handleClose}>
                Confirm
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </Fragment>
      )}
    </Fragment>
  );
};

export default RequestedHubAppointmentById;
