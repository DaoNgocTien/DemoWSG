import {
  AUTH_PAGE_REQUEST,
  AUTH_PAGE_SUCCESS,
  AUTH_PAGE_FAILED,
  GOOGLE_OAUTH2,
} from "./constant";
import Axios from "axios";
// 
// import APISettings from "../../../redux/url/APISettings";

export const actLoginApi = (user, history) => {
  return async (dispatch) => {
    dispatch(actLoginRequest());
    Axios({
      url: `/users/login`,
      method: "POST",
      headers: {
        Authorization: "JWT_TOKEN",
        "Content-Type": "application/json",
      },
      data: user,
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        dispatch(actLoginSuccess(result.data));
        if (result.data.status === "success") {
          if (result.data.data.user.rolename === "Customer" || result.data.data.user.rolename === "Deliverer") {
            return history.push("/login");
          } else {
            localStorage.setItem("user", JSON.stringify(result.data.data.user));
            return history.push("/");
          }
        }
      })
      .catch((err) => {
        return dispatch(actLoginFailed(err));
      });
  };
};

export const googleOAuth2 = (googleResponse) => {
  return async (dispatch) => {
    dispatch(actLoginRequest());
    if (typeof googleResponse === "undefined") {
      googleResponse = [];
    }
    // console.log(googleResponse)
    if (googleResponse && !googleResponse.error) {
      Axios({
        url: `/users/login/google`,
        method: "POST",
        headers: {
          Authorization: "JWT_TOKEN",
          "Content-Type": "application/json",
        },
        data: {
          googleId: googleResponse.googleId,
          lastName: googleResponse.profileObj.name,
          email: googleResponse.profileObj.email,
          // phone: "0",
          roleName: "Supplier",
        },
        withCredentials: true,
        exposedHeaders: ["set-cookie"],
      })
        .then((response) => {
          dispatch(actLoginSuccess(response.data));
          if (response.data.status === "success") {
            if (response.data.data.user.rolename === "Supplier") {
              localStorage.setItem("user", JSON.stringify(response.data.data.user));
              return window.location.replace("/");
            } else {
              return window.location.replace("/login");
            }
          }
        })
        .catch((err) => {
          return dispatch(actLoginFailed(err));
        });
    }

    dispatch({ type: GOOGLE_OAUTH2, googleResponse });
  };
};

const actLoginRequest = () => {
  return {
    type: AUTH_PAGE_REQUEST,
  };
};

const actLoginSuccess = (data) => {
  return {
    type: AUTH_PAGE_SUCCESS,
    payload: data,
  };
};

const actLoginFailed = (err) => {
  return {
    type: AUTH_PAGE_FAILED,
    payload: err,
  };
};
