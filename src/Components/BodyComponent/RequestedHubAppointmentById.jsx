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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const RequestedHubAppointmentById = ({ match, history }) => {
  const [values, setValues] = useState({
    appointmentByIdInfo: {},
    approveDialogOpen: false,
    rejectDialogOpen: false,
    loading: true,
    approveButtonLoad: false,
    rejectButtonLoad: false,
  });

  const {
    appointmentByIdInfo,
    loading,
    approveDialogOpen,
    rejectDialogOpen,
    approveButtonLoad,
    rejectButtonLoad,
  } = values;

  const token = getCookie("token");
  const appointmentId = match.params.appointmentId;

  function handleRejectClickOpen() {
    setValues({ ...values, rejectDialogOpen: true });
  }
  function handleRejectClose() {
    setValues({ ...values, rejectDialogOpen: false });
  }
  const handleApproveClickOpen = () => {
    setValues({ ...values, approveDialogOpen: true });
  };
  const handleApproveClose = () => {
    setValues({ ...values, approveDialogOpen: false });
  };

  const rejectAppointmentRequest = () => {
    setValues({ ...values, rejectButtonLoad: true });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/request-appointment/${appointmentId}`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        status: "rejected",
      },
    })
      .then((response) => {
        setValues({
          ...values,
          rejectButtonLoad: false,
        });
        history.push("/request/appointment");
        handleApproveClose();
        handleRejectClose();
      })
      .catch((err) => {
        setValues({
          ...values,
          rejectButtonLoad: false,
        });
        console.log(err);
      });
  };
  const approveAppointmentRequest = () => {
    setValues({ ...values, approveButtonLoad: true });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/request-appointment/${appointmentId}`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        status: "accepted",
      },
    })
      .then((response) => {
        setValues({
          ...values,
          approveButtonLoad: false,
        });
        history.push("/hub/confirmedBookings");
        handleApproveClose();
        handleRejectClose();
      })
      .catch((err) => {
        setValues({
          ...values,
          approveButtonLoad: false,
        });
        console.log(err);
      });
  };

  const getRequestedAppointmentInfo = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/request-appointment/${appointmentId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
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
                  onClick={handleApproveClickOpen}
                >
                  Approve<CheckCircleIcon></CheckCircleIcon>{" "}
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
                  onClick={handleRejectClickOpen}
                >
                  Reject<CancelIcon></CancelIcon>
                </Button>
              </span>
            </Tooltip>
          </Stack>
          <Dialog
            open={approveDialogOpen}
            onClose={handleApproveClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Appointment request confirmation
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to approve the request?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleApproveClose}>Cancel</Button>
              <Button onClick={approveAppointmentRequest} autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={rejectDialogOpen}
            onClose={handleRejectClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Appointment request confirmation
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure want to reject the appointment request?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleRejectClose}>Cancel</Button>
              <Button onClick={rejectAppointmentRequest} autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  );
};

export default RequestedHubAppointmentById;
