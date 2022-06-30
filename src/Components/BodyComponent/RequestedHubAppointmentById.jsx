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

const RequestedHubAppointmentById = ({ match }) => {
  const [values, setValues] = useState({
    appointmentByIdInfo: {},
    loading: true,
  });
  const token = getCookie("token");
  const appointmentId = match.params.appointmentId;

  const { appointmentByIdInfo, loading } = values;

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
                  ? "Can not approve a rejected appointment"
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
                >
                  Reject<CancelIcon></CancelIcon>
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Fragment>
      )}
    </Fragment>
  );
};

export default RequestedHubAppointmentById;
