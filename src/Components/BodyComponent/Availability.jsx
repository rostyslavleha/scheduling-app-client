import React, { useEffect, useState, useCallback, Fragment } from "react";
import { Box } from "@mui/material";
import NavBreadCrumb from "./NavBreadCrumb";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import isWeekend from "date-fns/isWeekend";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import moment from "moment";
import axios from "axios";
import { isAuth, getCookie } from "../../Common/helpers";
import CircularProgress from "@mui/material/CircularProgress";

const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1);
};

export default function Availability() {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const token = getCookie("token");

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left).sort());
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked).sort());
    setLeft(not(left, leftChecked).sort());
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked).sort());
    setRight(not(right, rightChecked).sort());
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right).sort());
    setRight([]);
  };

  const convertToDate = (str) => {
    var date = new Date(str);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
  };

  // Generate Time Slots
  let generateTimeSlots = {
    slotInterval: 30,
    clinicOpenTime: "00:00",
    clinicCloseTime: "24:00",
  };
  let generatedTimeSlots = [];
  let startTime = moment(generateTimeSlots.clinicOpenTime, "HH:mm");
  let endTime = moment(generateTimeSlots.clinicCloseTime, "HH:mm").add(
    0,
    "days"
  );
  while (startTime < endTime) {
    generatedTimeSlots.push(startTime.format("HH:mm"));
    startTime.add(generateTimeSlots.slotInterval, "minutes");
  }

  const getAvailabilityByDate = () => {
    const clinicianId = isAuth()._id;
    const availabilityDate = convertToDate(appointmentDate);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/availability/${clinicianId}/${availabilityDate}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        let availabilityByDate = [];
        response.data.availableSlots[0].availability.slots.map((slot) => {
          availabilityByDate.push(slot.time);
        });

        availabilityByDate.length > 0
          ? setRight(availabilityByDate.sort())
          : setRight([]);

        let leftSlotsAvailable = generatedTimeSlots.filter(function (el) {
          return !availabilityByDate.includes(el);
        });
        setLeft(leftSlotsAvailable.sort());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAvailabilityByDate();
    // console.log("second", leftSlotsAvailable);
  }, [appointmentDate]);

  // Function to update availability
  const updateAvailability = (event) => {
    event.preventDefault();
    setLoading(true);
    let data = [];
    for (let i = 0; i < right.length; i++) {
      data.push({
        time: right[i],
        isAvailable: true,
      });
    }
    const clinicianId = isAuth()._id;
    const availability = [
      {
        date: convertToDate(appointmentDate),
        slots: data,
      },
    ];
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/availability`,
      headers: { Authorization: `Bearer ${token}` },
      data: { clinicianId, availability },
    })
      .then((response) => {
        setLoading(false);
        console.log("created availability", response);
        getAvailabilityByDate();
      })
      .catch((error) => {
        setLoading(false);
        console.log("Availability ERROR", error);
      });
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

  const customList = (items) => (
    <Paper sx={{ width: 300, height: 500, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;
          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value} [${tConv24(value)}]`}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Fragment>
      <NavBreadCrumb path="/availability" name="/Availability"></NavBreadCrumb>

      <Grid container spacing={5} justifyContent="center" alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            orientation="landscape"
            // disablePast
            openTo="day"
            value={appointmentDate}
            shouldDisableDate={isWeekend}
            onChange={(newValue) => {
              setAppointmentDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Grid item>{customList(left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 1 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 1 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 1 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 2 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(right)}</Grid>
      </Grid>
      <Box
        component="span"
        my={3}
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Button
          variant="outlined"
          color="primary"
          sx={{ height: 40 }}
          onClick={updateAvailability}
        >
          Update
          {loading && (
            <CircularProgress sx={{ ml: 3 }} color="secondary" size={20} />
          )}
        </Button>
      </Box>
    </Fragment>
  );
}
