import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth, getCookie, signout } from "../../Common/helpers";
import NavBreadCrumb from "./NavBreadCrumb";
import {
  CircularProgress,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Stack,
  Avatar,
  Button,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../../firebase";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const UserEditProfile = ({ history }) => {
  const allInputs = { imgUrl: "" };
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    aboutClinician: "",
    affiliatedFrom: "",
    clinicAddress: {
      address1: "",
      address2: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
    },
    clinicContact: "",
    clinicName: "",
    clinicRegisteredYear: "",
    clinicRegistrationNo: "",
    clinicianProfessionalCourses: [],
    clinicianSpecialization: [],
    clinicianTrainedLocation: "",
    createdAt: "",
    updatedAt: "",
    gender: "",
    profilePhoto: "",
    socialMediaHandles: [],
    title: "",
    username: "",
    dateOfBirth: "",
    yearsOfExperience: 0,
    _id: "",
    experienceDropDownValues: [],
    loading: false,
    profilePhotoUploading: false,
  });
  const [errors, setErrors] = useState({});
  const inputFile = useRef(null);
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const {
    firstName,
    lastName,
    email,
    loading,
    role,
    affiliatedFrom,
    clinicAddress,
    clinicContact,
    clinicName,
    aboutClinician,
    clinicRegisteredYear,
    clinicRegistrationNo,
    clinicianProfessionalCourses,
    clinicianSpecialization,
    clinicianTrainedLocation,
    createdAt,
    updatedAt,
    gender,
    profilePhoto,
    socialMediaHandles,
    title,
    username,
    dateOfBirth,
    yearsOfExperience,
    _id,
    experienceDropDownValues,
    profilePhotoUploading,
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    loadUserProfile();
    generateExperienceValues();
  }, []);

  const convertToDate = (str) => {
    var date = new Date(str);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return [month, day, date.getFullYear()].join("-");
  };

  const generateExperienceValues = () => {
    for (let i = 0; i <= 20; i++) {
      values.experienceDropDownValues.push(i);
    }
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleImageAsFile = (event) => {
    const image = event.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleFirebaseUpdate = (event) => {
    event.preventDefault();
    console.log("start of upload");
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    console.log(imageAsFile.name);
    setValues({ ...values, profilePhotoUploading: true });
    const storageRef = ref(storage, `/userAvatar/${imageAsFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageAsFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageAsUrl((prevObject) => ({
            ...prevObject,
            imgUrl: url,
          }));
          setValues({
            ...values,
            profilePhoto: url,
            profilePhotoUploading: false,
          });
        });
      }
    );
  };

  const loadUserProfile = () => {
    setValues({ ...values, loading: true });
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data.firstName);
        const {
          firstName,
          lastName,
          email,
          role,
          password,
          confirmPassword,
          aboutClinician,
          affiliatedFrom,
          clinicAddress,
          clinicContact,
          clinicName,
          clinicRegisteredYear,
          clinicRegistrationNo,
          clinicianProfessionalCourses,
          clinicianSpecialization,
          clinicianTrainedLocation,
          createdAt,
          updatedAt,
          gender,
          profilePhoto,
          socialMediaHandles,
          title,
          username,
          dateOfBirth,
          yearsOfExperience,
          _id,
        } = response.data;
        setValues({
          ...values,
          firstName,
          lastName,
          email,
          role,
          gender,
          password,
          confirmPassword,
          aboutClinician,
          affiliatedFrom,
          clinicContact,
          clinicName,
          clinicRegisteredYear,
          clinicRegistrationNo,
          clinicianProfessionalCourses,
          clinicianSpecialization,
          clinicianTrainedLocation,
          createdAt,
          updatedAt,
          profilePhoto,
          socialMediaHandles,
          title,
          username,
          dateOfBirth,
          yearsOfExperience,
          clinicAddress: {
            ...values.clinicAddress,
            address1: clinicAddress.address1,
            address2: clinicAddress.address2,
            city: clinicAddress.city,
            country: clinicAddress.country,
            postalCode: clinicAddress.postalCode,
            province: clinicAddress.province,
          },
          _id,
          loading: false,
        });
      })
      .catch((error) => {
        console.log("User Profile Error", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
        toast.error(error.response.data.error);
      });
  };

  return (
    <Fragment>
      <NavBreadCrumb path="/edit-profile" name="Edit Profile"></NavBreadCrumb>
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Box mt={2} sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={8}>
              <Stack spacing={1} direction="row">
                <FormControl sx={{ minWidth: 80 }} size="small">
                  <InputLabel id="demo-title">Title</InputLabel>
                  <Select
                    required
                    labelId="demo-title"
                    id="demo-title"
                    value={title}
                    label="Title"
                    name="title"
                    onChange={handleChange("title")}
                  >
                    <MenuItem value={"Dr"}>Dr</MenuItem>
                    <MenuItem value={"Mr"}>Mr</MenuItem>
                    <MenuItem value={"Mrs"}>Mrs</MenuItem>
                    <MenuItem value={"Ms"}>Ms</MenuItem>
                    <MenuItem value={"Miss"}>Miss</MenuItem>
                    <MenuItem value={"Mx"}>Mx</MenuItem>
                    <MenuItem value={"Rev"}>Rev</MenuItem>
                    <MenuItem value={"Sir"}>Sir</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  required
                  autoComplete="given-name"
                  name="firstName"
                  id="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  size="small"
                  value={firstName}
                  onChange={handleChange("firstName")}
                  {...(errors["firstName"] && {
                    error: true,
                    helperText: errors["firstName"],
                  })}
                />
                <TextField
                  required
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Enter last name"
                  size="small"
                  value={lastName}
                  onChange={handleChange("lastName")}
                  {...(errors["lastName"] && {
                    error: true,
                    helperText: errors["lastName"],
                  })}
                />
              </Stack>
              <Box component="form" noValidate onSubmit={handleFirebaseUpdate}>
                <Avatar
                  alt={`${firstName} ${lastName}`}
                  src={profilePhoto}
                  sx={{ width: 100, height: 100 }}
                ></Avatar>
                <Button containerelement="label" size="small">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageAsFile}
                    ref={inputFile}
                  ></input>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  type="submit"
                >
                  update
                  {profilePhotoUploading && (
                    <CircularProgress
                      sx={{ ml: 2 }}
                      color="inherit"
                      size={20}
                    />
                  )}
                </Button>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <FormControl sx={{ minWidth: 80 }} size="small">
                  <InputLabel id="demo-experience">Experience</InputLabel>
                  <Select
                    labelId="demo-experience"
                    id="demo-experience"
                    value={yearsOfExperience}
                    label="Experience"
                    name="yearsOfExperience"
                    onChange={handleChange("yearsOfExperience")}
                  >
                    {experienceDropDownValues.map((experience, index) => (
                      <MenuItem key={index} value={experience}>
                        {experience}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  required
                  id="clinicName"
                  label="Clinic Name"
                  name="clinicName"
                  placeholder="Enter clinic name"
                  size="small"
                  value={clinicName}
                  onChange={handleChange("clinicName")}
                  {...(errors["clinicName"] && {
                    error: true,
                    helperText: errors["clinicName"],
                  })}
                />
                <TextField
                  disabled
                  id="email"
                  label="Email Address"
                  name="email"
                  size="small"
                  value={email}
                />
                <TextField
                  id="aboutClinician"
                  label="Introduction"
                  name="aboutClinician"
                  placeholder="Add about yourself..."
                  size="small"
                  multiline
                  rows={5}
                  value={aboutClinician}
                  sx={{ width: 500 }}
                  onChange={handleChange("aboutClinician")}
                  {...(errors["aboutClinician"] && {
                    error: true,
                    helperText: errors["aboutClinician"],
                  })}
                />
              </Stack>
              <Stack direction="row" sx={{ mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={(newValue) => {
                      setValues({
                        ...values,
                        dateOfBirth: newValue,
                      });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <TextField
                  id="address1"
                  label="address1"
                  name="address1"
                  placeholder="Enter Address"
                  size="small"
                  value={clinicAddress.address1}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clinicAddress: {
                        ...values.clinicAddress,
                        address1: e.target.value,
                      },
                    })
                  }
                  {...(errors["address1"] && {
                    error: true,
                    helperText: errors["address1"],
                  })}
                />
                <TextField
                  id="address2"
                  label="address2"
                  name="address2"
                  placeholder="Enter Address"
                  size="small"
                  value={clinicAddress.address2}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clinicAddress: {
                        ...values.clinicAddress,
                        address2: e.target.value,
                      },
                    })
                  }
                  {...(errors["address2"] && {
                    error: true,
                    helperText: errors["address2"],
                  })}
                />
                <TextField
                  id="city"
                  label="city"
                  name="city"
                  placeholder="Enter city"
                  size="small"
                  value={clinicAddress.city}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clinicAddress: {
                        ...values.clinicAddress,
                        city: e.target.value,
                      },
                    })
                  }
                  {...(errors["city"] && {
                    error: true,
                    helperText: errors["city"],
                  })}
                />
              </Stack>
              <div>{gender}</div>
              <div> {affiliatedFrom}</div>
              <div> {clinicContact}</div>
              <div> {clinicRegistrationNo}</div>
              <div> {clinicianProfessionalCourses}</div>
              <div> {clinicName}</div>
              <div> {clinicianSpecialization}</div>
              <div> {clinicianTrainedLocation}</div>
              <div> Account created on{createdAt}</div>
              <div> Account Last updated on {updatedAt}</div>
              <div>{socialMediaHandles.facebook}</div>
              <div>{socialMediaHandles.twitter}</div>
              <div>{socialMediaHandles.linkedin}</div>
              <div>{socialMediaHandles.instagram}</div>
              <div>userId : {_id}</div>
              <div>Role : {role}</div>
              <div>Registered Year : {clinicRegisteredYear}</div>
              <div>username : {username}</div>
              {/* {JSON.stringify(values)} */}
            </Grid>
            <Grid item xs={12} md={6} lg={4}></Grid>
          </Grid>
        </Box>
      )}
    </Fragment>
  );
};

export default UserEditProfile;
