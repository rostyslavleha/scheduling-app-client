import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth, getCookie, signout } from "../../Common/helpers";
import Box from "@mui/material/Box";
import NavBreadCrumb from "./NavBreadCrumb";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import { CardContent, CardHeader, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { height } from "@mui/system";

const UserProfile = ({ history }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
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
    dateOfBirth: "",
    yearsOfExperience: 0,
    _id: "",
    loading: false,
  });

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
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    loadUserProfile();
  }, []);

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
        console.log(response);
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
          profilePhoto,
          socialMediaHandles,
          title,
          username,
          dateOfBirth,
          yearsOfExperience,
          _id,
          loading: false,
        });
      })
      .catch((error) => {
        setValues({ ...values, loading: false });
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
      <NavBreadCrumb path="/profile" name="/Profile"></NavBreadCrumb>
      {loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={8}>
          <Card
            sx={{ borderTopLeftRadius: 0, 
                  borderTopRightRadius: 0, 
                  background: "lightgrey", 
                  mb: 4,
                  border: 2,
                  borderColor: "#4dabf5" }}>
              <CardHeader
                title={`${(title ? title : "")} ${(firstName ? firstName: "")} ${(lastName ? lastName : "")} ${(gender ? gender : "")}`}
                titleTypographyProps={{ align: "center" }}
                sx={{ clipPath: "polygon(0 0,100% 0,100% 100%,36px 100%,18px calc(100% - 18px),0 calc(100% - 36px))",
                      background: "#4dabf5",
                      height: 5}}
              />

            <Grid container justifyContent="space-evenly">
              <Grid item xs={12} sm={6} md={4}>
                <img
                  src={`${isAuth().profilePhoto}`}
                  style={{ width: "75%", height: "200px", marginTop: "20px", marginBottom: "20px" }}
                ></img>

                <Card elevation={3}
                      sx={{ width: "65%", height: "30px", ml: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", marginTop: "-11px" }}>
                        {role}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>

                <Box sx={{ width: "62.5%", height: "15px", background: "#4dabf5", ml: 3 }}></Box>

                <Card elevation={3}
                      sx={{ width: "65%", height: "30px", ml: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", marginTop: "-11px" }}>
                        {clinicianSpecialization}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>

                <Box sx={{ width: "62.5%", height: "15px", background: "#4dabf5", ml: 3 }}></Box>

                <Card elevation={3}
                      sx={{ width: "65%", height: "30px", ml: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", marginTop: "-11px" }}>
                        {yearsOfExperience}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>

                <Box sx={{ width: "62.5%", height: "15px", background: "#4dabf5", ml: 3 }}></Box>

                <Card elevation={3}
                      sx={{ width: "65%", height: "30px", ml: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", marginTop: "-11px" }}>
                        {affiliatedFrom}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>

                <Box sx={{ width: "62.5%", height: "15px", background: "#4dabf5", ml: 3 }}></Box>

                <Card elevation={3}
                      sx={{ width: "65%", height: "30px", ml: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ marginTop: "-11px", marginLeft: "-10px" }}>
                        {email}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>

                <Box sx={{ width: "62.5%", height: "15px", background: "#4dabf5", ml: 3 }}></Box>

                <Card sx={{ width: "65%", height: "30px", ml: 2.5 }}>
                    <CardContent>
                      <Typography>
                        <div style={{ textAlign: "center", marginTop: "-11px" }}>
                          Languages
                        </div>
                      </Typography>
                    </CardContent>
                </Card>
              </Grid>
          
            <Grid item xs={12} sm={6} md={8}>
              <Card elevation={3}
                    sx={{ width: "85%", mt: 2.5, height: "250px" }}>
                <CardHeader
                  title="Biography"
                  titleTypographyProps={{ align: "center" }}
                  sx={{ clipPath: "polygon(0 0,100% 0,100% 100%,36px 100%,18px calc(100% - 18px),0 calc(100% - 36px))",
                        background: "#4dabf5",
                        height: 5}}>
                </CardHeader>
                <CardContent>
                  <div>
                    {aboutClinician}
                  </div>
                </CardContent>
              </Card>
              <Card elevation={3}
                    sx={{ width: "85%", height: "220px", mt: 1, mr: 1}}>
                <CardHeader
                  title="Training/Professional Courses"
                  titleTypographyProps={{ align: "center" }}
                  sx={{ clipPath: "polygon(0 0,100% 0,100% 100%,36px 100%,18px calc(100% - 18px),0 calc(100% - 36px))",
                        background: "#4dabf5",
                        height: 5}}>
                </CardHeader>
                <CardContent>
                  <div>
                    {clinicianProfessionalCourses}
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
              <div> {affiliatedFrom}</div>
              <div> {clinicianTrainedLocation}</div>
              <div>{socialMediaHandles.facebook}</div>
              <div>{socialMediaHandles.twitter}</div>
              <div>{socialMediaHandles.linkedin}</div>
              <div>{socialMediaHandles.instagram}</div>
              <div>userId: {_id}</div>

            <Grid item xs={12} md={12} lg={8}></Grid>
            <IconButton component={Link} to="/edit-profile">
              <EditIcon></EditIcon>
            </IconButton>
            </Grid>
          </Card>
          </Grid>

        <Grid item sm={6} md={3}>
          <Card elevation={3}
              sx={{ height: "275px",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    border: 2,
                    borderColor: "#4dabf5" }}>
            <CardHeader
                title= "Clinic"
                titleTypographyProps={{ align: "center" }}
                sx={{ clipPath: "polygon(0 0,100% 0,100% 100%,36px 100%,18px calc(100% - 18px),0 calc(100% - 36px))",
                      background: "#4dabf5",
                      height: 5}}
            />
            <CardContent>

            </CardContent>
          </Card>

          <Card elevation={3}
                sx={{ background: "lightgrey", 
                      height: "275px", 
                      mt: 2.5,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      border: 2,
                      borderColor: "#4dabf5" }}>
            <CardHeader
                title= "User Information"
                titleTypographyProps={{ align: "center" }}
                sx={{ background: "#4dabf5",
                      height: 5}}
            />
              <Card elevation={3}
                    sx={{ width: "87%", height: "30px", ml: 2, mt: 4.5 }}>
                      <CardContent>
                      <Typography>
                        <div style={{ textAlign: "center", marginTop: "-11px" }}>
                          {username}
                        </div>
                      </Typography>
                    </CardContent>
              </Card>

              <Box sx={{ width: "84.5%", height: "15px", background: "#4dabf5", ml: 2.5 }}></Box>

              <Card elevation={3}
                    sx={{ width: "87%", height: "30px", ml: 2}}>
                      <CardContent>
                      <Typography>
                        <div style={{ textAlign: "center", marginTop: "-11px" }}>
                          {dateOfBirth}
                        </div>
                      </Typography>
                    </CardContent>
              </Card>

              <Box sx={{ width: "84.5%", height: "15px", background: "#4dabf5", ml: 2.5 }}></Box>

              <Card elevation={3}
                    sx={{ width: "87%", height: "30px", ml: 2}}>
                      <CardContent>
                      <Typography>
                        <div style={{ textAlign: "center", marginTop: "-11px" }}>
                          Created: {createdAt}
                        </div>
                      </Typography>
                    </CardContent>
              </Card>

              <Box sx={{ width: "84.5%", height: "15px", background: "#4dabf5", ml: 2.5 }}></Box>

              <Card elevation={3}
                    sx={{ width: "87%", height: "30px", ml: 2}}>
                      <CardContent>
                        <Typography>
                          <div style={{ textAlign: "center", marginTop: "-11px" }}>
                            Updated: {updatedAt}
                          </div>
                        </Typography>
                    </CardContent>
              </Card>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={11}>
          <Card elevation={3}
                sx={{ 
                      mt: -2.5, 
                      borderTopLeftRadius: 0, 
                      borderTopRightRadius: 0, 
                      background: "lightgrey", 
                      border: 2,
                      borderColor: "#4dabf5" }}>
            <CardHeader
              title="Clinic Information"
              titleTypographyProps={{ align: "center" }}
                    sx={{ background: "#4dabf5",
                          height: 5}}>
            </CardHeader>

            <Grid container spacing={2} justifyContent="space-evenly" alignItems="center">
              <Grid item md={5}>
                <Card elevation={3} sx={{ mt: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", height: "0px", marginTop: "-8px" }}>
                        {clinicName}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item md={5}>
                <Card elevation={3} sx={{ mt: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", height: "0px", marginTop: "-8px"}}>
                        {clinicRegisteredYear}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item md={8}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", height: "0px", marginTop: "-8px" }}>
                        {clinicAddress.address1}
                        {clinicAddress.address2}
                        {clinicAddress.city}
                        {clinicAddress.postCode}
                        {clinicAddress.provinice}
                        {clinicAddress.country}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item md={5}>
                <Card elevation={3} sx={{ mb: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", height: "0px", marginTop: "-8px" }}>
                        {clinicContact}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item md={5}>
                <Card elevation={3} sx={{ mb: 2.5 }}>
                  <CardContent>
                    <Typography>
                      <div style={{ textAlign: "center", height: "0px", marginTop: "-8px" }}>
                        {clinicRegistrationNo}
                      </div>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Card>
        </Grid>
      </Grid>
      )}
    </Fragment>
  );
};

export default UserProfile;
