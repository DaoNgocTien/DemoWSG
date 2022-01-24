import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";

export const getCategory = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/categories/All`,
      method: "GET",
      withCredentials: true,
    })
      .then((result) => {
        if (result.status === 200) {
          return dispatch(getSuccess(result.data.data));
        }
      })
      .catch((err) => {
        return dispatch(getFailed());
      });
  };
};

const getRequest = () => {
  return {
    type: GET_DATA_REQUEST,
  };
};

const getSuccess = (data) => {
  return {
    type: GET_DATA_SUCCESS,
    payload: data,
  };
};

const getFailed = (err) => {
  return {
    type: GET_DATA_FAIL,
    payload: err,
  };
};
