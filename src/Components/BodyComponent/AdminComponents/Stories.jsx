import React, { useState, useEffect, Fragment } from "react";
import { getCookie } from "../../../Common/helpers";
import axios from "axios";
import { Link } from "react-router-dom";
import { ref, deleteObject, getStorage } from "firebase/storage";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import NavBreadCrumb from "../NavBreadCrumb";
import DeleteIcon from "@mui/icons-material/Delete";
import storyDefaultImage from "../../../media/storyDefaultImage.png";
import ImageList from "@mui/material/ImageList";

const Stories = () => {
  const [values, setValues] = useState({
    stories: [],
  });
  const { stories } = values;
  const token = getCookie("token");

  useEffect(() => {
    getAllStories();
  });

  const getAllStories = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/story`,
    })
      .then((response) => {
        setValues({ ...values, stories: response.data });
      })
      .catch((error) => {
        console.log("Stories ERROR", error.response.data.error);
      });
  };
  const deleteImageFromFirebase = (url) => {
    const storage = getStorage();
    const desertRef = ref(storage, `${url}`);
    deleteObject(desertRef)
      .then(() => {
        console.log("image Deleted successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteStory = (storyId, url) => {
    // Check if a story has a previous coverPhoto
    let story = stories.find((x) => x._id === storyId);
    if (story.coverPhoto !== "") {
      deleteImageFromFirebase(url);
    }
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API}/admin/story/${storyId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        getAllStories();
      })
      .catch((error) => {
        console.log("Stories ERROR", error);
      });
  };

  return (
    <Fragment>
      <NavBreadCrumb
        path="/admin/stories"
        name="/admin/stories"
      ></NavBreadCrumb>
      <ImageList cols={4}>
        {stories.length > 0
          ? stories.map((story, key) => (
              <Card key={story._id} sx={{ maxWidth: 350 }} m={1}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {story.title}
                    </Typography>
                  </CardContent>
                  {story.coverPhoto ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={story.coverPhoto}
                      alt="no-image"
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="140"
                      image={storyDefaultImage}
                      alt="no-image"
                    />
                  )}
                  <CardContent>
                    {story.link ? <p>{story.link}</p> : ""}
                    <Typography gutterBottom variant="h6" component="div">
                      {story.heading}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {story.content}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {story._id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Story added at : {story.createdAt}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last updated at : {story.updatedAt}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Link
                    to={`/admin/story/update/${story._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Button variant="outlined" size="small" color="primary">
                      Edit
                    </Button>
                  </Link>
                  <span
                    onClick={() => {
                      deleteStory(story._id, story.coverPhoto);
                    }}
                  >
                    <DeleteIcon></DeleteIcon>
                  </span>
                </CardActions>
              </Card>
            ))
          : "No Stories Found"}
      </ImageList>
    </Fragment>
  );
};

export default Stories;
