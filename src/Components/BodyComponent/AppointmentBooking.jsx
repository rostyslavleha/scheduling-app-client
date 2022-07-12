import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { isAuth, getCookie } from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import {
  Button,
  Grid,
  List,
  Stack,
  TextField,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
  Box,
  Radio,
  Divider,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import isWeekend from "date-fns/isWeekend";

const AppointmentBooking = ({ match }) => {
  const [values, setValues] = useState({
    appointmentDate: new Date(),
    availableTimeSlots: [],
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    selectedTimeSlot: "",
  });
  const [errors, setErrors] = useState({});

  const {
    appointmentDate,
    availableTimeSlots,
    patientFirstName,
    patientLastName,
    patientEmail,
    selectedTimeSlot,
  } = values;
  const token = getCookie("token");

  const convertToDate = (str) => {
    var date = new Date(str);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
  };

  const validate = () => {
    let temp = { ...errors };

    const isNameValid = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    if (patientFirstName.length === 0) {
      temp.patientFirstName = "First Name is required";
    } else if (!isNameValid.test(patientFirstName)) {
      temp.patientFirstName = "First Name invalid";
    } else {
      temp.patientFirstName = "";
    }

    if (patientLastName.length === 0) {
      temp.patientLastName = "Last Name is required";
    } else if (!isNameValid.test(patientLastName)) {
      temp.patientLastName = "Last Name invalid";
    } else {
      temp.patientLastName = "";
    }

    temp.patientEmail = patientEmail ? "" : "Email is required";
    if (patientEmail) {
      temp.patientEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(patientEmail)
        ? ""
        : "Email is not valid";
    }

    setErrors({ ...temp });
    const isValid =
      patientFirstName &&
      patientLastName &&
      patientEmail &&
      Object.values(temp).every((x) => x === "");
    console.log(isValid);
    return isValid;
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  function tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  const getAvailabilityByDate = () => {
    const clinicianId = match.params.clinicianId;
    const availabilityDate = convertToDate(appointmentDate);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/availability/${clinicianId}/${availabilityDate}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        let availableTimeSlotsByDate = [];
        console.log(response.data);
        response.data.availableSlots.length === 0
          ? setValues({
              ...values,
              availableTimeSlots: availableTimeSlotsByDate,
            })
          : response.data.availableSlots[0].availability.slots.map((slot) => {
              slot.isAvailable === true &&
                availableTimeSlotsByDate.push(slot.time);
            });
        setValues({ ...values, availableTimeSlots: availableTimeSlotsByDate });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAvailabilityByDate();
  }, [appointmentDate]);

  console.log("selected Date", appointmentDate);

  return (
    <Fragment>
      <NavBreadCrumb
        path={`/clinicians/${match.params.clinicianId}`}
        name="Book Appointment"
      ></NavBreadCrumb>
      <Stack direction="row">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            'User profile'
          </Grid>
          <Grid item xs={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StaticDatePicker
                openTo="day"
                shouldDisableDate={isWeekend}
                value={appointmentDate}
                onChange={(newValue) => {
                  setValues({ ...values, appointmentDate: newValue });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3}>
            <Stack direction="column">
              <List
                subheader={
                  <ListSubheader>
                    <Typography variant="overline">Select Time Slot</Typography>
                  </ListSubheader>
                }
                sx={{
                  bgcolor: "background.paper",
                  minHeight: 350,
                  maxHeight: 350,
                  overflow: "auto",
                }}
              >
                {availableTimeSlots.length === 0 ? (
                  <ListItem>
                    <ListItemButton>
                      <ListItemText>
                        No slots available. Please change date
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ) : (
                  availableTimeSlots.map((value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                      <ListItem key={value} disablePadding>
                        <ListItemButton sx={{ px: 3 }} role={undefined} dense>
                          <ListItemText
                            sx={{ px: 2 }}
                            id={labelId}
                            primary={`${value} [${tConv24(value)}]`}
                          />
                          <ListItemIcon sx={{ px: 2 }}>
                            <Radio
                              edge="start"
                              tabIndex={-1}
                              inputProps={{ "aria-labelledby": labelId }}
                              value={value}
                              checked={value === selectedTimeSlot}
                              onChange={handleChange("selectedTimeSlot")}
                              name="radio"
                            />
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                )}
              </List>
              <Box
                component="form"
                sx={{ mt: 2, bgcolor: "background.paper", p: 1 }}
              >
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="patientFirstName"
                    label="First Name"
                    type="text"
                    id="patientFirstName"
                    placeholder="Enter patient first name"
                    size="small"
                    value={patientFirstName}
                    onChange={handleChange("patientFirstName")}
                    sx={{ mt: 1 }}
                    {...(errors["patientFirstName"] && {
                      error: true,
                      helperText: errors["patientFirstName"],
                    })}
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="patientLastName"
                    label="Last Name"
                    type="text"
                    id="patientLastName"
                    placeholder="Enter patient last name"
                    size="small"
                    value={patientFirstName}
                    sx={{ mt: 1 }}
                    onChange={handleChange("patientLastName")}
                    {...(errors["patientLastName"] && {
                      error: true,
                      helperText: errors["patientLastName"],
                    })}
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="patientEmail"
                    label="Email Address"
                    type="email"
                    id="patientEmail"
                    placeholder="Enter patient email address"
                    size="small"
                    value={patientEmail}
                    sx={{ mt: 1 }}
                    onChange={handleChange("patientEmail")}
                    {...(errors["patientEmail"] && {
                      error: true,
                      helperText: errors["patientEmail"],
                    })}
                  ></TextField>
                </Grid>
                <Button sx={{ my: 1 }} fullWidth variant="contained">
                  Book
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Fragment>
  );
};

export default AppointmentBooking;
