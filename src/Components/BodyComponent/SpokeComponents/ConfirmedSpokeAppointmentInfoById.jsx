import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { getCookie, convertToDate } from "../../../Common/helpers";
import NavBreadCrumb from "../NavBreadCrumb";
import AppointmentInfoById from "../AppointmentInfoById";
import {
  CircularProgress,
  Button,
  Tooltip,
  Stack,
  TextField,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Radio,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import isWeekend from "date-fns/isWeekend";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const ConfirmedSpokeAppointmentInfoById = ({ match, history }) => {
  const [values, setValues] = useState({
    appointmentByIdInfo: {},
    loading: true,
    availableTimeSlots: [],
    selectedTimeSlot: "",
  });
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState(new Date());

  const { appointmentByIdInfo, loading, availableTimeSlots, selectedTimeSlot } =
    values;
  const token = getCookie("token");
  const appointmentId = match.params.appointmentId;

  const handleModifyOpen = () => {
    getAvailabilityByDate(newAppointmentDate);
    setModifyDialogOpen(true);
  };

  const handleModifyClose = () => {
    setModifyDialogOpen(false);
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const getAvailabilityByDate = (newValue) => {
    const clinicianId = appointmentByIdInfo.requestedTo._id;
    const availabilityDate = convertToDate(newValue);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/availability/${clinicianId}/${availabilityDate}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        let availableTimeSlotsByDate = [];
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

  const handleModifyAppointment = () => {};

  function tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  const getConfirmedAppointmentInfo = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/confirm-appointment/${appointmentId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log(response.data);
        setValues({
          ...values,
          appointmentByIdInfo: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        setValues({
          ...values,
          loading: false,
        });
        console.log("Appointment by Id Info ERROR", error);
      });
  };

  useEffect(() => {
    getConfirmedAppointmentInfo();
  }, []);

  return (
    <Fragment>
      <NavBreadCrumb
        path={`/spoke/confirmedBookings/${appointmentId}`}
        name={`Appointment Id: ${appointmentId}`}
      ></NavBreadCrumb>
      {loading ? (
        <div>
          <CircularProgress color="inherit" size={20} />
        </div>
      ) : (
        <Fragment>
          <AppointmentInfoById
            appointmentByIdInfo={appointmentByIdInfo}
          ></AppointmentInfoById>
          <Stack
            mt={1}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Tooltip
              title={
                (appointmentByIdInfo.status === "fulfilled" &&
                  "Appointment has been already completed") ||
                (appointmentByIdInfo.status === "cancelled" &&
                  "Appointment has been already cancelled") ||
                (appointmentByIdInfo.status === "active" &&
                  "Click to modify appointment")
              }
            >
              <span>
                <Button
                  color="success"
                  variant="contained"
                  disabled={appointmentByIdInfo.status !== "active"}
                  // onClick={handleModifyClickOpen}
                  onClick={handleModifyOpen}
                >
                  Modify<EditIcon></EditIcon>
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                (appointmentByIdInfo.status === "fulfilled" &&
                  "Appointment has been already completed, no actions can be performed") ||
                (appointmentByIdInfo.status === "cancelled" &&
                  "Appointment has been already cancelled") ||
                (appointmentByIdInfo.status === "active" &&
                  "Click to cancel appointment")
              }
            >
              <span>
                <Button
                  color="error"
                  variant="contained"
                  disabled={appointmentByIdInfo.status !== "active"}
                  // onClick={handleCancelClickOpen}
                >
                  Cancel<CancelIcon></CancelIcon>
                </Button>
              </span>
            </Tooltip>
          </Stack>
          <Dialog
            open={modifyDialogOpen}
            onClose={handleModifyClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Modify appointment
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Select new appointment date and time
              </DialogContentText>
              <Stack direction="row">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <StaticDatePicker
                    label="Responsive"
                    disablePast
                    openTo="day"
                    displayStaticWrapperAs="desktop"
                    shouldDisableDate={isWeekend}
                    value={newAppointmentDate}
                    onChange={(newValue) => {
                      setNewAppointmentDate(newValue);
                      getAvailabilityByDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <List
                  subheader={
                    <ListSubheader>
                      <Typography variant="overline">
                        Select new time Slot
                      </Typography>
                    </ListSubheader>
                  }
                  sx={{
                    bgcolor: "background.paper",
                    maxHeight: 300,
                    overflow: "auto",
                    border: "1px solid #1976d2",
                    borderRadius: 2,
                    padding: 0,
                  }}
                >
                  {availableTimeSlots.length === 0 ? (
                    <ListItem>
                      <ListItemButton>
                        <ListItemText>
                          No slots available. Select different date
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  ) : (
                    availableTimeSlots.map((value) => {
                      const labelId = `checkbox-list-label-${value}`;
                      return (
                        <ListItem key={value} disablePadding>
                          <ListItemButton dense>
                            <ListItemText
                              id={labelId}
                              primary={`${value}  [${tConv24(value)}]`}
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
              </Stack>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5}>
                  <Typography variant="overline">
                    Current appointment
                  </Typography>
                  <Typography variant="h6">
                    {convertToDate(appointmentByIdInfo.appointmentDate)}
                  </Typography>
                  <Typography variant="h6">
                    {tConv24(appointmentByIdInfo.appointmentTime)}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <DoubleArrowIcon color="warning"></DoubleArrowIcon>
                  <DoubleArrowIcon color="warning"></DoubleArrowIcon>
                  <DoubleArrowIcon color="warning"></DoubleArrowIcon>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="overline">New Appointment</Typography>
                  <Typography variant="h6">
                    {convertToDate(newAppointmentDate)}
                  </Typography>
                  <Typography variant="h6">
                    {selectedTimeSlot !== "" && tConv24(selectedTimeSlot)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModifyClose}>Cancel</Button>
              <Button onClick={handleModifyAppointment} autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ConfirmedSpokeAppointmentInfoById;
