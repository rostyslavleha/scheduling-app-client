import React, { Fragment } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import CancelIcon from "@mui/icons-material/Cancel";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const appointmentStatusButtonColor = {
  rejected: "error",
  pending: "primary",
  active: "success",
};

const AppointmentPatientDetails = ({
  appointmentPatientInfo,
  appointmentStatus,
}) => {
  return (
    <Fragment>
      <Button
        variant="outlined"
        color={appointmentStatusButtonColor[appointmentStatus]}
        sx={{ justifyContent: "space-between", width: "100%" }}
      >
        <Typography sx={{ fontWeight: "bold" }}>
          {appointmentStatus.toUpperCase()}
        </Typography>
        {appointmentStatus === "rejected" && (
          <CancelIcon color="error"></CancelIcon>
        )}
        {appointmentStatus === "pending" && (
          <HelpIcon color="primary"></HelpIcon>
        )}
        {appointmentStatus === "active" && (
          <NotificationsActiveIcon color="success"></NotificationsActiveIcon>
        )}
      </Button>
      <List
        dense
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 0,
          border: "1px solid #1976d2",
          borderRadius: 2,
        }}
      >
        <ListItem
          button
          divider
          secondaryAction={
            <Typography>
              {appointmentPatientInfo.firstName}{" "}
              {appointmentPatientInfo.lastName}
            </Typography>
          }
        >
          <ListItemText
            primary={<Typography variant="overline">Patient Name: </Typography>}
          />
        </ListItem>
        <ListItem
          button
          divider
          secondaryAction={
            <Typography>{appointmentPatientInfo._id}</Typography>
          }
        >
          <ListItemText
            primary={<Typography variant="overline">Patient ID: </Typography>}
          />
        </ListItem>
        <ListItem
          button
          divider
          secondaryAction={
            <Typography>{appointmentPatientInfo.email}</Typography>
          }
        >
          <ListItemText
            primary={<Typography variant="overline">Email: </Typography>}
          />
        </ListItem>
      </List>
    </Fragment>
  );
};

export default AppointmentPatientDetails;
