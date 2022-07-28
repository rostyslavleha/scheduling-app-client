import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../../Common/helpers";
import NavBreadCrumb from "../NavBreadCrumb";
import AppointmentInfoById from "../AppointmentInfoById";
import { CircularProgress, Button, Tooltip, Stack } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

const ConfirmedSpokeAppointmentInfoById = ({ match, history }) => {
  const [values, setValues] = useState({
    appointmentByIdInfo: {},
    loading: true,
  });
  const { appointmentByIdInfo, loading } = values;
  const token = getCookie("token");
  const appointmentId = match.params.appointmentId;

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
        path={`/spoke/confirmedBookings/${appointmentId}`}
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
                  //   onClick={}
                >
                  Modify<EditIcon></EditIcon>
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
                  //   onClick={}
                >
                  Cancel<CancelIcon></CancelIcon>
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ConfirmedSpokeAppointmentInfoById;
