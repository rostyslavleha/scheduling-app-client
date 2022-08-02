import React, { Fragment } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListSubheader,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import CancelIcon from "@mui/icons-material/Cancel";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import VerifiedIcon from "@mui/icons-material/Verified";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const appointmentStatusButtonColor = {
  rejected: "error",
  pending: "primary",
  active: "success",
  fulfilled: "primary",
  cancelled: "error",
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
          <CancelIcon
            color={appointmentStatusButtonColor[appointmentStatus]}
          ></CancelIcon>
        )}
        {appointmentStatus === "pending" && (
          <HelpIcon
            color={appointmentStatusButtonColor[appointmentStatus]}
          ></HelpIcon>
        )}
        {appointmentStatus === "active" && (
          <NotificationsActiveIcon
            color={appointmentStatusButtonColor[appointmentStatus]}
          ></NotificationsActiveIcon>
        )}
        {appointmentStatus === "fulfilled" && (
          <VerifiedIcon
            color={appointmentStatusButtonColor[appointmentStatus]}
          ></VerifiedIcon>
        )}
        {appointmentStatus === "cancelled" && (
          <HighlightOffIcon
            color={appointmentStatusButtonColor[appointmentStatus]}
          ></HighlightOffIcon>
        )}
      </Button>
      <List
        dense
        subheader={
          <ListSubheader>
            <Typography variant="overline">Patient Information</Typography>
          </ListSubheader>
        }
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 0,
          border: "1px solid #1976d2",
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
            primary={<Typography variant="overline"> Name: </Typography>}
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
