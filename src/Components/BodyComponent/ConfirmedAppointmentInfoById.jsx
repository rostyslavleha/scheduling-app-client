import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import AppointmentInfoById from "./AppointmentInfoById";
import { Stack, CircularProgress } from "@mui/material";

const ConfirmedAppointmentInfoById = ({ match, history }) => {
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
        path={`/confirmedBookings/${appointmentId}`}
        name={`Appointment Id: ${appointmentId}`}
      ></NavBreadCrumb>
      {loading ? (
        <div>
          <CircularProgress color="inherit" size={20} />
        </div>
      ) : (
        <AppointmentInfoById
          appointmentByIdInfo={appointmentByIdInfo}
        ></AppointmentInfoById>
      )}
    </Fragment>
  );
};

export default ConfirmedAppointmentInfoById;
