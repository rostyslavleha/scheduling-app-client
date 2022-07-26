import React, { useState, useEffect, useRef, Fragment } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { getCookie } from "../../../Common/helpers";
import axios from "axios";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import NavBreadCrumb from "../NavBreadCrumb";
import ButtonBase from "@mui/material/ButtonBase";
import ImageListItem from "@mui/material/ImageListItem";
import { CardHeader, Typography } from "@mui/material";
import Card from '@mui/material/Card';

const UpdateStory = ({ match }) => {
  const allInputs = { imgUrl: "" };
  const [values, setValues] = useState({
    storyTitle: "",
    storyHeading: "",
    storyContent: "",
    storyLink: "",
    storyImageAsUrl: "",
    loading: false,
    imageUploadLoading: false,
  });
  const inputFile = useRef(null);
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const {
    storyTitle,
    storyHeading,
    storyContent,
    storyLink,
    storyImageAsUrl,
    loading,
    imageUploadLoading,
  } = values;

  const token = getCookie("token");

  const getStory = (storyId) => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/story/${storyId}`,
    })
      .then((response) => {
        setValues({
          ...values,
          storyTitle: response.data.title,
          storyHeading: response.data.heading,
          storyContent: response.data.content,
          storyLink: response.data.link,
          storyImageAsUrl: response.data.coverPhoto,
        });
      })
      .catch((error) => {
        console.log("Stories ERROR", error.response.data.error);
      });
  };
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  console.log(imageAsFile);
  const handleImageAsFile = (event) => {
    const image = event.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/admin/story/${match.params.storyId}`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        storyTitle,
        storyHeading,
        storyContent,
        storyLink,
        storyImageAsUrl,
      },
    })
      .then((response) => {
        console.log("Created Stories", response.data);
        setValues({ ...values, loading: false });

        toast.success("Story updated successfully");
      })
      .catch((error) => {
        console.log("Stories ERROR", error);
        setValues({ ...values, loading: false });
        toast.error(error.response.data.error);
      });
  };

  const handleFirebaseUpdate = (event) => {
    event.preventDefault();
    console.log("start of upload");
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    console.log(imageAsFile.name);
    setValues({ ...values, imageUploadLoading: true });
    const storageRef = ref(storage, `/storyImages/${imageAsFile.name}`);
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
            storyImageAsUrl: url,
            imageUploadLoading: false,
          });
        });
      }
    );
  };

  useEffect(() => {
    getStory(match.params.storyId);
  }, [match.params.storyId]);

  return (
    <Fragment>
      <NavBreadCrumb
        path={`${`/admin/story/update/${match.params.storyId}`}`}
        name="/admin/updateStory"
      ></NavBreadCrumb>
      <ToastContainer></ToastContainer>
      <Container component="main" maxWidth="maxWidth">
        <Card fullwidth>
          <CardHeader
            title="Edit Story"
            titleTypographyProps={{variant:'h7'}}
            sx={{ textAlign: "center", clipPath: "polygon(0 0,100% 0,100% 100%,36px 100%,18px calc(100% - 18px),0 calc(100% - 36px))", background: "#4dabf5", height: 5 }}
            >
            </CardHeader>
        <Box
          component="form"
          noValidate
          onSubmit={handleFirebaseUpdate}
          sx={{ mt: 3 }}
        >
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item>
              <ButtonBase
                xs={12}
                sm={6}
                md={4}
                sx={{ width: 275, height: 275, ml: 4 }}
              >
                <ImageListItem>
                  <img src={storyImageAsUrl} alt="" loading="lazy" />
                </ImageListItem>{" "}
              </ButtonBase>
            </Grid>

            <Grid item xs={8}>
              <TextField
                required
                fullWidth
                multiline
                rows={10}
                id="storyContent"
                label="Story Content"
                name="storyContent"
                value={storyContent}
                onChange={handleChange("storyContent")}
              />
            </Grid>
            
            <Grid item xs={6} sm={3} md={4}>
              <Button containerelement="label" size="small">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageAsFile}
                  ref={inputFile}
                ></input>{" "}
              </Button>
            </Grid>
            <Grid item xs={6} sm={3} md={0}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                type="submit"
              >
                Upload
                {imageUploadLoading ? (
                  <CircularProgress sx={{ ml: 2 }} color="inherit" size={20} />
                ) : null}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="storyTitle"
                label="Story Title"
                name="storyTitle"
                value={storyTitle}
                onChange={handleChange("storyTitle")}
                sx={{ width: "93.5%", ml: 4 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="storyHeading"
                label="Story Heading"
                name="storyHeading"
                value={storyHeading}
                onChange={handleChange("storyHeading")}
                sx={{ width: "93.5%", ml: 4 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="storyLink"
                label="Story URL"
                name="storyLink"
                value={storyLink}
                onChange={handleChange("storyLink")}
                sx={{ width: "93.5%", ml: 4 }}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, ml: 4 }}>
            Submit
            {loading ? (
              <CircularProgress sx={{ ml: 3 }} color="inherit" size={20} />
            ) : null}
          </Button>
        </Box>
        </Card>
      </Container>
    </Fragment>
  );
};

export default UpdateStory;
