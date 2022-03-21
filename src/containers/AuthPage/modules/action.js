import {
  AUTH_PAGE_REQUEST,
  AUTH_PAGE_SUCCESS,
  AUTH_PAGE_FAILED,
  GOOGLE_OAUTH2,
  PROFILE,
  REGISTRATION,
} from "./constant";
import Axios from "axios";
import { Redirect } from 'react-router';
// 
// import APISettings from "../../../redux/url/APISettings";

const actLoginApi = (user, history) => {
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

const googleOAuth2 = (googleResponse) => {
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

const phoneNumberValidation = phone => {
  return async (dispatch) => {
    if (phone.length > 11 || phone.length < 10) {
      return dispatch(
        storeCheckingResult({
          phone: null,
          OTP: null,
          message: "Phone number must be 10 - 11 characters!",
        })
      );
    }
    return dispatch(
      storeCheckingResult({
        phone: null,
        OTP: null,
        message: null,
      })
    );
  }
}

const checkPhoneNumber = phone => {
  return async (dispatch) => {
    try {
      dispatch(actLoginRequest());

      const [phoneValidation] = await Promise.all([
        Axios({
          url: `/users/${phone}`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);

      console.log(phoneValidation.data.data[0]);
      const exist = phoneValidation.data.data[0] ? true : false;
      if (exist) {
        return dispatch(
          storeCheckingResult({
            phone: null,
            OTP: null,
            message: "Phone number exists!",
          })
        );
      }
      else {
        //  Send OTP to phone number through Firebase
        return dispatch(
          storeCheckingResult({
            phone: phone,
            OTP: "12345",
            message: null,
          })
        );
      }
      // return dispatch(
      //   storeProfile({
      //     profile: phoneValidation.data.data.length !== 0 ? phoneValidation.data.data[0] : null,
      //   })
      // );
    } catch (error) {
      // console.log(error);
      return dispatch(actLoginFailed(error));
    }
  };
};

const registration = data => {
  return async (dispatch) => {
    try {
      dispatch(actLoginRequest());

      const [registrationResponse, login] = await Promise.all([
        Axios({
          url: `/users/register`,
          method: "POST",
          data: data,
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);

      console.log(registrationResponse);
      dispatch(
        storeProfile({
          profile: registrationResponse.data.data,
        })
      );
    } catch (error) {
      // console.log(error);
      return dispatch(actLoginFailed(error));
    }
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

const storeCheckingResult = data => {
  return {
    type: PROFILE,
    payload: data,
  };
}


const storeProfile = data => {
  return {
    type: REGISTRATION,
    payload: data,
  };
}

const action = {
  googleOAuth2,
  actLoginApi,
  checkPhoneNumber,
  registration,
  phoneNumberValidation,
};

export default action;
