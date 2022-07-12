import React, { Fragment, useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  ImageList,
  Typography,
  InputBase,
  Box,
  Toolbar,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { getCookie } from "../../Common/helpers";
import axios from "axios";
import CardClinicianProfile from "./CardClinicianProfile";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#cfd8dc",
  "&:hover": {
    backgroundColor: "#90a4ae",
  },
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    // width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "100ch",
      },
    },
  },
}));

const SearchClinicians = () => {
  const [values, setValues] = useState({
    clinicians: [],
    searchQuery: "",
  });

  const { clinicians, searchQuery } = values;

  const token = getCookie("token");

  const getHubClinicians = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/clinicians`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log(response);
        setValues({ ...values, clinicians: response.data });
      })
      .catch((error) => {
        console.log("Stories ERROR", error.response.data.error);
      });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, searched: false });
  };

  useEffect(() => {
    getHubClinicians();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar sx={{ p: "0 !important" }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search clinicians"
            inputProps={{ "aria-label": "search" }}
            onChange={handleChange("searchQuery")}
          />
        </Search>
      </Toolbar>
      {clinicians && clinicians.length > 0 ? (
        <ImageList cols={3}>
          {clinicians
            .filter((clinician) => {
              if (searchQuery === "") {
                return clinician;
              } else if (
                clinician.firstName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                clinician.lastName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                clinician.aboutClinician
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                clinician.clinicName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                clinician.email
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              ) {
                return clinician;
              }
            })
            .map((clinician, index) => (
              <Link
                underline="none"
                component={RouterLink}
                to={`/clinicians/${clinician._id}`}
              >
                <CardClinicianProfile
                  clinician={clinician}
                ></CardClinicianProfile>
              </Link>
            ))}
        </ImageList>
      ) : (
        <Typography></Typography>
      )}
    </Box>
  );
};

export default SearchClinicians;
