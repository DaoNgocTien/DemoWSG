import Axios from "axios";
import { Redirect } from 'react-router';
import {
  AUTH_PAGE_FAILED, AUTH_PAGE_REQUEST,
  AUTH_PAGE_SUCCESS, GOOGLE_OAUTH2,
  PROFILE,
  REGISTRATION
} from "./constant";
import { GET_DATA_SUCCESS } from "../../../components/Profile/modules/constant"
const onLogin = () => {
  return async (dispatch) => {
    dispatch(getFailed(null));

  };
}
const actLoginApi = (user, history) => {
  return async (dispatch) => {
    dispatch(getRequest());
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
        dispatch(getSuccess(result.data));
        if (result.data.status === "success") {
          if (result.data.data.user.rolename !== "Supplier") {
            return history.push("/login");
          } else {
            let user = {
              ...result.data.data.user,
              ...result.data.data.info,

            }
            localStorage.setItem("user", JSON.stringify(user));
            return history.push("/");
          }
        }
      })
      .catch((err) => {
      //  console.log(err);
        return dispatch(getFailed("Invalid username or password!"));
      });
  };
};

const googleOAuth2 = (googleResponse) => {
  return async (dispatch) => {
    dispatch(getRequest());
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
          dispatch(getSuccess(response.data));
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
          return dispatch(getFailed(err));
        });
    }

    dispatch({ type: GOOGLE_OAUTH2, googleResponse });
  };
};

const phoneNumberValidation = phone => {
//  console.log((phone));
  return async (dispatch) => {
    if ((phone + "").length > 11 || (phone + "").length < 10) {
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
      dispatch(getRequest());

      const [phoneValidation] = await Promise.all([
        Axios({
          url: `/users/${phone}`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);

    //  console.log(phoneValidation.data.data[0]);
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
      return dispatch(getFailed(error));
    }
  };
};

const checkPhoneNumberForgotPassword = phone => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [phoneValidation] = await Promise.all([
        Axios({
          url: `/users/${phone}`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);

    //  console.log(phoneValidation.data.data[0]);
      const exist = phoneValidation.data.data[0] ? true : false;
      if (exist) {
        return dispatch(
          storeCheckingResult({
            profile: phoneValidation.data.data[0],
            phone: phone,
            OTP: "12345",
            message: null,
          })
        );
      }
      else {
        //  Send OTP to phone number through Firebase
        return dispatch(
          storeCheckingResult({
            phone: null,
            OTP: null,
            message: "Phone number not exist!",
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
      return dispatch(getFailed(error));
    }
  };
};

const registration = data => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      const [registrationResponse, login] = await Promise.all([
        Axios({
          url: `/users/register`,
          method: "POST",
          data: data,
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);

    //  console.log(registrationResponse);
      dispatch(
        storeProfile({
          profile: registrationResponse.data.data,
        })
      );
    } catch (error) {
      // console.log(error);
      return dispatch(getFailed(error));
    }
  };
};

const getProfile = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      // console.log("test");
      const [profile] = await Promise.all([
        Axios({
          url: `/users/profile/me`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),

      ]);
      if (profile.status === 200) {

        return dispatch(
          getSuccess({
            profile: profile.data.data,
          }));
      }
      return dispatch(getFailed());

    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const resetFields = () => {
  return async (dispatch) => {
    dispatch(
      changePasswordMessage({
        changePasswordMessage: null,

      }));
    return dispatch(
      storeCheckingResult({
        phone: null,
        OTP: null,
        message: null,
      })
    );
  };
};

const updateBusinessCondition = data => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());

      // const [response] = await Promise.all([
      //   Axios({
      //     url: `/users/register`,
      //     method: "POST",
      //     data: data,
      //     withCredentials: true,
      //     exposedHeaders: ["set-cookie"],
      //   }),

      // ]);

      // if (response.status === 200) {
      dispatch(getSuccess({ profile: {} }));
      return (<Redirect to="/" />);
      // }
    }
    catch (error) {
      return dispatch(getFailed(error));
    }

  };
}

const getRequest = () => {
  return {
    type: AUTH_PAGE_REQUEST,
  };
};

const getSuccess = (data) => {
  return {
    type: AUTH_PAGE_SUCCESS,
    payload: data,
  };
};

const getFailed = (err) => {
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

const changePasswordMessage = (data) => {
  // console.log(data);
  return {
    type: GET_DATA_SUCCESS,
    payload: data,
  };
};

const action = {
  googleOAuth2,
  actLoginApi,
  checkPhoneNumber,
  registration,
  phoneNumberValidation,
  getProfile,
  updateBusinessCondition,
  resetFields,
  checkPhoneNumberForgotPassword,
  onLogin
};

export default action;
