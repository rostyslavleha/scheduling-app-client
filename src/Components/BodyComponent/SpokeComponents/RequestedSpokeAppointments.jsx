import React, { useEffect, useState, Fragment } from "react";
import NavBreadCrumb from "../NavBreadCrumb";
import axios from "axios";
import { getCookie } from "../../../Common/helpers";
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
import Typography from "@mui/material/Typography";
import { CircularProgress, Badge } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 8,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 8,
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

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const tableHeadStyle = {
  textTransform: "uppercase",
  minWidth: 700,
};

const RequestedSpokeAppointments = () => {
  const [values, setValues] = useState({
    requestedAppointments: [],
    loading: false,
  });
  const { requestedAppointments, loading } = values;
  const token = getCookie("token");

  const getRequestedAppointments = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/request-appointment`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setValues({
          ...values,
          requestedAppointments: response.data.appointments,
          loading: false,
        });
      })
      .catch((error) => {
        setValues({ ...values, loading: false });
        console.log("Appointments Info ERROR", error.response.data.error);
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
        path="/spoke/request/bookings"
        name="/spoke/request/bookings"
      ></NavBreadCrumb>{" "}
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Fragment>
          {requestedAppointments.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={tableHeadStyle} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Requested To</StyledTableCell>
                    <StyledTableCell>Requested For</StyledTableCell>
                    <StyledTableCell>Appointment Date</StyledTableCell>
                    <StyledTableCell>Appointment Time</StyledTableCell>
                    <StyledTableCell colSpan={2}>
                      Appointment Status
                    </StyledTableCell>
                    <StyledTableCell colSpan={2}>
                      Appointment request Id
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestedAppointments.map((row) => (
                    <StyledTableRow style={{ textAlign: "left" }} key={row._id}>
                      <StyledTableCell>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            <SmallAvatar
                              alt="img"
                              src={row.requestedBy.profilePhoto}
                            />
                          }
                        >
                          <Avatar
                            alt="img"
                            src={row.requestedTo.profilePhoto}
                          />
                        </Badge>
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.requestedTo.firstName} {row.requestedTo.lastName}
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
                        <Tooltip
                          title={
                            row.status === "pending" ? "PENDING" : "REJECTED"
                          }
                        >
                          <span>
                            <Button>
                              {row.status === "pending" && (
                                <HelpIcon color="primary"></HelpIcon>
                              )}
                              {row.status === "rejected" && (
                                <CancelIcon color="error"></CancelIcon>
                              )}
                            </Button>
                          </span>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row._id}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="click for more information">
                          <Button
                            size="small"
                            component={Link}
                            to={`/request/appointment/${row._id}`}
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
          ) : (
            <Typography>No appointment requests found</Typography>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default RequestedSpokeAppointments;
