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
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import VerifiedIcon from "@mui/icons-material/Verified";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Badge, Typography } from "@mui/material";

const appointmentStatusValues = {
  active: {
    message: "active",
    icon: <NotificationsActiveIcon color="success" />,
  },
  fulfilled: { message: "fulfilled", icon: <VerifiedIcon color="primary" /> },
  cancelled: { message: "cancelled", icon: <HighlightOffIcon color="error" /> },
};

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
      url: `${process.env.REACT_APP_API}/confirmed-appointments`,
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
        path="/hub/confirmedBookings"
        name="/hub/confirmedBookings"
      ></NavBreadCrumb>{" "}
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Fragment>
          {confirmedAppointments.length > 0 ? (
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
                        {row.status === "active" && (
                          <Tooltip
                            title={appointmentStatusValues[
                              row.status
                            ].message.toUpperCase()}
                          >
                            <span>
                              <Button>
                                {appointmentStatusValues[row.status].icon}
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                        {row.status === "fulfilled" && (
                          <Tooltip
                            title={appointmentStatusValues[
                              row.status
                            ].message.toUpperCase()}
                          >
                            <span>
                              <Button>
                                {appointmentStatusValues[row.status].icon}
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                        {row.status === "cancelled" && (
                          <Tooltip
                            title={appointmentStatusValues[
                              row.status
                            ].message.toUpperCase()}
                          >
                            <span>
                              <Button>
                                {appointmentStatusValues[row.status].icon}
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row._id}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="more information">
                          <Button
                            size="small"
                            component={Link}
                            to={`/hub/confirmedBookings/${row._id}`}
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
            <Typography>No Appointments available</Typography>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default HubConfirmedBookings;
