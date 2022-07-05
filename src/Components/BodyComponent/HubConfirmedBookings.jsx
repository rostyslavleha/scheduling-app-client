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
import CancelIcon from "@mui/icons-material/Cancel";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

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

const tableHeadStyle = {
  textTransform: "uppercase",
  minWidth: 700,
};

const HubConfirmedBookings = () => {
  const [values, setValues] = useState({
    confirmedAppointments: [],
    loading: false,
  });
  const { confirmedAppointments, loading } = values;
  const token = getCookie("token");

  const getConfirmedAppointments = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/hub/bookings`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setValues({
          ...values,
          confirmedAppointments: response.data.confirmedBookings,
          loading: false,
        });
      })
      .catch((error) => {
        setValues({ ...values, loading: false });
        console.log(
          "Confirmed Appointments Info ERROR",
          error.response.data.error
        );
      });
  };
  const convertToDate = (str) => {
    var date = new Date(str);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
  };

  useEffect(() => {
    getConfirmedAppointments();
  }, []);

  return (
    <Fragment>
      <NavBreadCrumb
        path="/request/appointment"
        name="/requested/Appointments"
      ></NavBreadCrumb>{" "}
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={tableHeadStyle} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Requested By</StyledTableCell>
                <StyledTableCell>Requested For</StyledTableCell>
                <StyledTableCell>Appointment Date</StyledTableCell>
                <StyledTableCell>Appointment Time</StyledTableCell>
                <StyledTableCell colSpan={2}>
                  Appointment Status
                </StyledTableCell>
                <StyledTableCell colSpan={2}>
                  Appointment confirmation Id
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {confirmedAppointments.map((row) => (
                <StyledTableRow style={{ textAlign: "left" }} key={row._id}>
                  <StyledTableCell>
                    <Avatar alt="img" src={row.requestedBy.profilePhoto} />
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
                  <StyledTableCell>{row.status}</StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title={row.status === "active" && "ACTIVE"}>
                      <span>
                        <Button>
                          {row.status === "active" && (
                            <NotificationsActiveIcon color="success"></NotificationsActiveIcon>
                          )}
                        </Button>
                      </span>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row._id}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title="Click for more information">
                      <Button
                        size="small"
                        component={Link}
                        to={`/confirmedBookings/${row._id}`}
                      >
                        <OpenInFullIcon
                          color="primary"
                          size="small"
                        ></OpenInFullIcon>
                      </Button>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Fragment>
  );
};

export default HubConfirmedBookings;
