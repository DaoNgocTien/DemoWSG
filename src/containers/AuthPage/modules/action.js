import {
  AUTH_PAGE_REQUEST,
  AUTH_PAGE_SUCCESS,
  AUTH_PAGE_FAILED,
} from "./constant";
import Axios from "axios";

export const actLoginApi = (user, history) => {
  return async (dispatch) => {
    dispatch(actLoginRequest());
    Axios({
      url: `/users/login`,
      method: "POST",
      headers: {
        'Authorization': "JWT_TOKEN",
        'Content-Type': 'application/json'
      },
      data: user,
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        dispatch(actLoginSuccess(result.data));
        if (result.data.status === "success") {
          if (result.data.data.user.RoleName === "Admin") {
            console.log(result.data.data.user)
            localStorage.setItem("user", JSON.stringify(result.data.data.user))
            return history.push("/");
          } else {
            return history.goBack();
          }
        }
      })
      .catch((err) => {
        return dispatch(actLoginFailed(err));
      });
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
