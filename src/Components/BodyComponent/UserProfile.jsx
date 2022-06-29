import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth, getCookie, signout } from "../../Common/helpers";
import Box from "@mui/material/Box";
import NavBreadCrumb from "./NavBreadCrumb";

const UserProfile = ({ history }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    aboutClinician: "",
    affiliatedFrom: "",
    clinicAddress: {},
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
    yearOfBirth: "",
    yearsOfExperience: 0,
    _id: "",
    loading: false,
  });

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    loading,
    role,
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
    yearOfBirth,
    yearsOfExperience,
    _id,
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
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
          yearOfBirth,
          yearsOfExperience,
          _id,
        } = response.data;
        setValues({
          ...values,
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
          yearOfBirth,
          yearsOfExperience,
          _id,
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
    <Box mt={2}>
      <NavBreadCrumb path="/profile" name="/Profile"></NavBreadCrumb>
      {JSON.stringify(values)}
    </Box>
  );
};

export default UserProfile;
