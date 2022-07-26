import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import {
  CircularProgress,
  Tooltip,
  Avatar,
  Button,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  tableCellClasses,
  TableCell,
  Typography,
  Badge,
} from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import HelpIcon from "@mui/icons-material/Help";
import CancelIcon from "@mui/icons-material/Cancel";
import NavBreadCrumb from "./NavBreadCrumb";
import { getCookie } from "../../Common/helpers";

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

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
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

const RequestedHubAppointments = () => {
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
        path="/request/appointment"
        name="/requested/Appointments"
      ></NavBreadCrumb>{" "}
      {loading ? (
        <CircularProgress color="inherit" />
      ) : (
        <Fragment>
          {requestedAppointments.length > 0 ? (
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
                              src={row.requestedTo.profilePhoto}
                            />
                          }
                        >
                          <Avatar
                            alt="img"
                            src={row.requestedBy.profilePhoto}
                          />
                        </Badge>
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
                        <Tooltip title="more information">
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
            <Typography>No Requests available</Typography>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default RequestedHubAppointments;
