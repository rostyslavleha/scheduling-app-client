import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { convertToDate } from "../../Common/helpers";
import AppointmentUserDetails from "./AppointmentUserDetails";
import AppointmentPatientDetails from "./AppointmentPatientDetails";

function tConv24(time24) {
  var ts = time24;
  var H = +ts.substr(0, 2);
  var h = H % 12 || 12;
  h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
  var ampm = H < 12 ? " AM" : " PM";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
}

const AppointmentInfoById = ({ appointmentByIdInfo }) => {
  return (
    <Box
      mt={1}
      sx={{
        flexGrow: 1,
        border: "1px solid #1976d2",
        borderRadius: 2,
        bgcolor: "background.paper",
        padding: 1,
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Typography variant="h6" gutterBottom color="text.primary">
          {convertToDate(appointmentByIdInfo.appointmentDate)} -{" "}
          {tConv24(appointmentByIdInfo.appointmentTime)}
        </Typography>

        <Typography variant="caption">
          Created: {Date(appointmentByIdInfo.createdAt)}
        </Typography>
        <Typography variant="caption">
          Last updated: {Date(appointmentByIdInfo.updatedAt)}
        </Typography>
      </Stack>

      <Grid container spacing={1} columns={16} sx={{ mt: 1 }}>
        <Grid item xs={16} sm={6} md={6}>
          <Stack alignItems="center">
            <AppointmentUserDetails
              appointmentInfo={appointmentByIdInfo.requestedBy}
              appointmentUserType="Requested By"
            ></AppointmentUserDetails>
          </Stack>
        </Grid>
        <Grid item xs={16} sm={4} md={4}>
          <Stack spacing={1} alignItems="center" sx={{ mt: 10 }}>
            <AppointmentPatientDetails
              appointmentPatientInfo={appointmentByIdInfo.requestedFor}
              appointmentStatus={appointmentByIdInfo.status}
            ></AppointmentPatientDetails>
          </Stack>
        </Grid>
        <Grid item xs={16} sm={6} md={6}>
          <Stack alignItems="center">
            <AppointmentUserDetails
              appointmentInfo={appointmentByIdInfo.requestedTo}
              appointmentUserType="Requested To"
            ></AppointmentUserDetails>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentInfoById;
