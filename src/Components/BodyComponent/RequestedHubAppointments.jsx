import React, { useEffect, useState, Fragment } from "react";
import NavBreadCrumb from "./NavBreadCrumb";
import axios from "axios";
import { getCookie } from "../../Common/helpers";

const RequestedHubAppointments = () => {
  const [values, setValues] = useState({
    requestedAppointments: [],
  });

  const token = getCookie("token");

  const getRequestedAppointments = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/request-appointment`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setValues({
          ...values,
          requestedAppointments: response.data.appointments,
        });
      })
      .catch((error) => {
        console.log("Stories ERROR", error.response.data.error);
      });
  };

  useEffect(() => {
    getRequestedAppointments();
  }, []);

  return (
    <Fragment>
      <NavBreadCrumb
        path="/request/appointment"
        name="/requested/Appointments"
      ></NavBreadCrumb>
    </Fragment>
  );
};

export default RequestedHubAppointments;
