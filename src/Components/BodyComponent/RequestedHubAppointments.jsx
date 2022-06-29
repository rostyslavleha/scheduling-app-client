import React, { useEffect, useState, Fragment } from "react";
import NavBreadCrumb from "./NavBreadCrumb";
import axios from "axios";
import { getCookie } from "../../Common/helpers";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import HelpIcon from "@mui/icons-material/Help";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RequestedHubAppointments = () => {
  const [values, setValues] = useState({
    requestedAppointments: [],
  });
  const { requestedAppointments } = values;
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
  const convertToDate = (str) => {
    var date = new Date(str);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Appointment Id</StyledTableCell>
              <StyledTableCell>Requested By</StyledTableCell>
              <StyledTableCell>Requested For</StyledTableCell>
              <StyledTableCell>Appointment Date</StyledTableCell>
              <StyledTableCell>Appointment Time</StyledTableCell>
              <StyledTableCell>Appointment Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestedAppointments.map((row) => (
              <StyledTableRow style={{ textAlign: "center" }} key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row._id}
                </StyledTableCell>
                <StyledTableCell>
                  {row.requestedBy.firstName} {row.requestedBy.lastName}
                </StyledTableCell>
                <StyledTableCell>
                  {row.requestedFor.firstName} {row.requestedFor.lastName}
                </StyledTableCell>
                <StyledTableCell>
                  {convertToDate(row.appointmentDate)}
                </StyledTableCell>
                <StyledTableCell>{row.appointmentTime}</StyledTableCell>
                <StyledTableCell>
                  {row.status}
                  {row.status === "pending" && (
                    <HelpIcon fontSize="small" color="primary"></HelpIcon>
                  )}
                  {row.status === "accepted" && (
                    <CheckCircleIcon
                      fontSize="small"
                      color="success"
                    ></CheckCircleIcon>
                  )}
                  {row.status === "rejected" && (
                    <CancelIcon fontSize="small" color="error"></CancelIcon>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default RequestedHubAppointments;
