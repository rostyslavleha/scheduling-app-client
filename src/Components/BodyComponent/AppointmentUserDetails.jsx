import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";

const AppointmentUserDetails = ({ appointmentInfo, appointmentUserType }) => {
  return (
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
        divider
        secondaryAction={
          <Typography>
            {appointmentInfo.firstName} {appointmentInfo.lastName}
          </Typography>
        }
      >
        <ListItemText
          primary={
            <Typography variant="overline">{appointmentUserType}</Typography>
          }
        />
      </ListItem>
      <ListItem sx={{ justifyContent: "center" }} divider>
        <Avatar
          sx={{ height: 150, width: 150 }}
          src={`${appointmentInfo.profilePhoto}`}
          alt="No photo"
        ></Avatar>
      </ListItem>
      <ListItem
        divider
        secondaryAction={<Typography>{appointmentInfo._id}</Typography>}
      >
        <ListItemText
          primary={<Typography variant="overline">User Id:</Typography>}
        />
      </ListItem>
      <ListItem
        divider
        secondaryAction={<Typography>{appointmentInfo.gender}</Typography>}
      >
        <ListItemText
          primary={<Typography variant="overline">Gender:</Typography>}
        />
      </ListItem>
      <ListItem
        divider
        secondaryAction={<Typography>{appointmentInfo.email}</Typography>}
      >
        <ListItemText
          primary={<Typography variant="overline">Email: </Typography>}
        />
      </ListItem>
      <ListItem
        divider
        secondaryAction={<Typography>{appointmentInfo.clinicName}</Typography>}
      >
        <ListItemText
          primary={<Typography variant="overline">Clinic Name:</Typography>}
        />
      </ListItem>
      <ListItem
        secondaryAction={
          <Typography>{appointmentInfo.clinicContact}</Typography>
        }
      >
        <ListItemText
          primary={<Typography variant="overline">Clinic contact: </Typography>}
        />
      </ListItem>
    </List>
  );
};

export default AppointmentUserDetails;
