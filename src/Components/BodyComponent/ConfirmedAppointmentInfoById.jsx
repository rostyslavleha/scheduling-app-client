import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import AppointmentInfoById from "./AppointmentInfoById";
import {
  CircularProgress,
  Stack,
  Button,
  Tooltip,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ConfirmedAppointmentInfoById = ({ match, history }) => {
  const [values, setValues] = useState({
    appointmentByIdInfo: {},
    loading: true,
    dialogOpen: false,
  });

  const { appointmentByIdInfo, loading, dialogOpen } = values;
  const token = getCookie("token");
  const appointmentId = match.params.appointmentId;

  const handleCompleteClickOpen = () => {
    setValues({ ...values, dialogOpen: true });
  };

  const handleDialogClose = () => {
    setValues({ ...values, dialogOpen: false });
  };

  const handleCompleteAppointment = () => {
    setValues({ ...values, dialogOpen: false });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/confirmed-appointments/${appointmentId}`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        status: "fulfilled",
      },
    })
      .then((res) => {
        handleDialogClose();
        history.push("/hub/confirmedBookings");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getConfirmedAppointmentInfo = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/confirm-appointment/${appointmentId}`,
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
    getConfirmedAppointmentInfo();
  }, []);

  return (
    <Fragment>
      <NavBreadCrumb
        path={`/hub/confirmedBookings/${appointmentId}`}
        name={`Appointment Id: ${appointmentId}`}
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
            mt={1}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Tooltip
              title={
                (appointmentByIdInfo.status === "fulfilled" &&
                  "Appointment has been already completed") ||
                (appointmentByIdInfo.status === "cancelled" &&
                  "Appointment has been already cancelled") ||
                (appointmentByIdInfo.status === "active" &&
                  "Click to complete appointment")
              }
            >
              <span>
                <Button
                  color="success"
                  variant="contained"
                  disabled={appointmentByIdInfo.status !== "active"}
                  onClick={handleCompleteClickOpen}
                >
                  Complete<CheckCircleIcon></CheckCircleIcon>
                </Button>
              </span>
            </Tooltip>
          </Stack>
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Appointment fulfillment
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to complete the appointment?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleCompleteAppointment} autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ConfirmedAppointmentInfoById;
