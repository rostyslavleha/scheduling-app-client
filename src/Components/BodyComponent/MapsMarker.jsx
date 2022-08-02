import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const AnyReactComponent = ({ text }) => (
  <div>
    <LocationOnIcon></LocationOnIcon>
  </div>
);

const SimpleMap = () => {
  const [center, setCenter] = useState({
    lat: 53.54584000191787,
    lng: -113.49200754415118,
  });

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "44vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyDxW5xyCco6Abf-TkW4EVwWWW-9Jp3WYoY",
        }}
        defaultCenter={center}
        defaultZoom={15}
      >
        <AnyReactComponent lat={center.lat} lng={center.lng} text="Location" />
      </GoogleMapReact>
    </div>
  );
};

export default SimpleMap;
