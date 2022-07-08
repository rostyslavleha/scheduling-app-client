import axios from "axios";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import PropTypes from "prop-types";

const GoogleAuth = ({ informParent }) => {
  const responseGoogle = (response) => {
    // console.log(response.tokenId);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.tokenId },
    })
      .then((response) => {
        console.log("GOOGLE SIGNIN SUCCESS", response);
        //inform parent about the signIn and redirect to home page based on user role
        informParent(response);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  return (
    <GoogleLogin
      clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

GoogleAuth.propTypes = {
  informParent: PropTypes.func.isRequired,
};
export default GoogleAuth;
