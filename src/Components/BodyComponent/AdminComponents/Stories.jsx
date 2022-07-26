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
import Divider from '@mui/material/Divider';

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
      <ImageList cols={3}>
        {stories.length > 0
          ? stories.map((story, key) => (
              <Card key={story._id} sx={{ maxWidth: 350, borderRadius: 0 }} m={1} elevation={2}>
                <CardActionArea>
                  <CardContent sx={{ clipPath: "polygon(0 0,100% 0,100% 100%,40px 100%,20px calc(100% - 20px),0 calc(100% - 40px))", background: '#4dabf5', height: 8 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: 18, mt: -1 }}>
                      {story.title}
                    </Typography>
                  </CardContent>
                  {story.coverPhoto ? (
                    <CardMedia
                      component="img"
                      height="250"
                      image={story.coverPhoto}
                      alt="no-image"
                      sx={{ mt: 1, width: '75%', ml: 5.5}}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="250"
                      image={storyDefaultImage}
                      alt="no-image"
                      sx={{ mt: 1, width: '75%', ml: 5.5 }}
                    />
                  )}
                  <CardContent>
                    
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: '#16609D', }}>
                      {story.heading}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Story added at : {story.createdAt}
                    </Typography>
                    <Divider variant="middle" /> 
                    <Typography variant="body2" color="text.secondary">
                      {story.content}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Link
                    to={`/admin/story/update/${story._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Button variant="outlined" size="small" color="primary" sx={{ ml: 1 }}>
                      Edit
                    </Button>
                  </Link>
                  <span
                    onClick={() => {
                      deleteStory(story._id, story.coverPhoto);
                    }}
                  >
                    <DeleteIcon sx={{ ml: 1 }}></DeleteIcon>
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
