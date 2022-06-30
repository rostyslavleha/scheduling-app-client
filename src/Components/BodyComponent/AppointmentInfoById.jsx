import React from "react";
import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import ImageList from "@mui/material/ImageList";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  border: "1px solid black",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
  width: 300,
}));

const AppointmentInfoById = ({ appointmentByIdInfo }) => {
  return (
    <Box
      mt={2}
      sx={{
        flexGrow: 1,
        border: "1px solid #4dabf5",
      }}
    >
      <div>Appointment Status: {appointmentByIdInfo.status}</div>
      <div>Appointment Date : {appointmentByIdInfo.appointmentDate}</div>
      <div>Appointment Time :{appointmentByIdInfo.appointmentTime}</div>
      <div>Appointment Created at :{appointmentByIdInfo.createdAt}</div>
      <div>Appointment Last Updated at :{appointmentByIdInfo.updatedAt}</div>
      <div>
        {appointmentByIdInfo.status === "pending" ? (
          <BorderLinearProgress variant="determinate" value={50} />
        ) : (
          <BorderLinearProgress variant="determinate" value={100} />
        )}
      </div>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={16} sm={6} md={6}>
          <div style={{ textAlign: "center" }}>
            clinicName:
            {appointmentByIdInfo.requestedBy.clinicName}
          </div>
          <ImageList>
            <img
              style={{ height: "100px", width: "100px" }}
              src={`${appointmentByIdInfo.requestedBy.profilePhoto}`}
              alt="No photo"
            ></img>
          </ImageList>
          <div style={{ textAlign: "center" }}>
            Profile ID:
            {appointmentByIdInfo.requestedBy._id}
          </div>
          <div style={{ textAlign: "center" }}>
            {" "}
            Name:
            {appointmentByIdInfo.requestedBy.firstName}
            {"  "}
            {appointmentByIdInfo.requestedBy.lastName}
          </div>
          <div style={{ textAlign: "center" }}>
            Email:
            {appointmentByIdInfo.requestedBy.email}
          </div>
          <div style={{ textAlign: "center" }}>
            Clinic Contact : {appointmentByIdInfo.requestedBy.clinicContact}
          </div>
          <div style={{ textAlign: "center" }}>
            Gender : {appointmentByIdInfo.requestedBy.gender}
          </div>
        </Grid>
        <Grid item xs={16} sm={4} md={4}>
          <div style={{ textAlign: "center" }}>
            clinicName:
            {appointmentByIdInfo.requestedFor.firstName}
            {appointmentByIdInfo.requestedFor.lastName}
          </div>

          <div style={{ textAlign: "center" }}>
            Profile ID:
            {appointmentByIdInfo.requestedFor._id}
          </div>

          <div style={{ textAlign: "center" }}>
            Email:
            {appointmentByIdInfo.requestedFor.email}
          </div>
        </Grid>
        <Grid item xs={16} sm={6} md={6}>
          <div style={{ textAlign: "center" }}>
            clinicName:
            {appointmentByIdInfo.requestedTo.clinicName}
          </div>
          <ImageList>
            <img
              style={{ height: "100px", width: "100px" }}
              src={`${appointmentByIdInfo.requestedTo.profilePhoto}`}
              alt="No photo"
            ></img>
          </ImageList>
          <div style={{ textAlign: "center" }}>
            Profile ID:
            {appointmentByIdInfo.requestedTo._id}
          </div>
          <div style={{ textAlign: "center" }}>
            {" "}
            Name:
            {appointmentByIdInfo.requestedTo.firstName}
            {"  "}
            {appointmentByIdInfo.requestedTo.lastName}
          </div>
          <div style={{ textAlign: "center" }}>
            Email:
            {appointmentByIdInfo.requestedTo.email}
          </div>
          <div style={{ textAlign: "center" }}>
            Clinic Contact : {appointmentByIdInfo.requestedTo.clinicContact}
          </div>
          <div style={{ textAlign: "center" }}>
            Gender : {appointmentByIdInfo.requestedTo.gender}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentInfoById;
