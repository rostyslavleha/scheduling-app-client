import React, { Fragment, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storage from "../../../firebase";
import { getCookie } from "../../../Common/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
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
import storyDefaultImage from "../../../media/storyDefaultImage.png";

const NewStory = ({ history }) => {
  const allInputs = { imgUrl: "" };
  const [values, setValues] = useState({
    storyTitle: "",
    storyHeading: "",
    storyContent: "",
    storyLink: "",
    loading: false,
    imageUploadLoading: false,
  });
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const [preview, setPreview] = useState();

  const {
    storyTitle,
    storyHeading,
    storyContent,
    storyLink,
    loading,
    imageUploadLoading,
  } = values;
  const token = getCookie("token");

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleImageAsFile = (event) => {
    const image = event.target.files[0];
    setImageAsFile((imageFile) => image);
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const storyImageUrl = imageAsUrl.imgUrl;
    setValues({ ...values, loading: true });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/admin/story`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        storyTitle,
        storyHeading,
        storyContent,
        storyLink,
        storyImageUrl,
      },
    })
      .then((response) => {
        setValues({
          ...values,
          storyTitle: "",
          storyHeading: "",
          storyContent: "",
          storyLink: "",
          loading: false,
        });
        console.log("Created Stories", response.data);
        toast.success("Story added successfully");
        history.push("/admin/stories");
      })
      .catch((error) => {
        console.log("Stories ERROR", error);
      });
  };

  const handleFirebaseUpload = (event) => {
    event.preventDefault();
    console.log("start of upload");
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    // console.log("Image file name", imageAsFile.name);
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
          setValues({ ...values, imageUploadLoading: false });
          toast.success("Image uploaded successfully");
        });
      }
    );
  };

  return (
    <Fragment>
      <NavBreadCrumb
        path="/admin/newStory"
        name="/admin/newStory"
      ></NavBreadCrumb>
      <ToastContainer></ToastContainer>
      <Container component="main" maxWidth="maxWidth">
        <Box
          component="form"
          noValidate
          onSubmit={handleFirebaseUpload}
          sx={{ mt: 2 }}
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
                sx={{ width: 125, height: 125 }}
              >
                <ImageListItem>
                  <img src={`${preview}`} alt="" loading="lazy" />
                </ImageListItem>{" "}
              </ButtonBase>
            </Grid>
            <Grid item xs={6} sm={3} md={4}>
              <Button containerElement="label" size="small">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageAsFile}
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
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="storyLink"
                label="Story URL"
                name="storyLink"
                value={storyLink}
                onChange={handleChange("storyLink")}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            Submit
            {loading ? (
              <CircularProgress sx={{ ml: 3 }} color="inherit" size={20} />
            ) : null}
          </Button>
        </Box>
      </Container>
    </Fragment>
  );
};

export default NewStory;
