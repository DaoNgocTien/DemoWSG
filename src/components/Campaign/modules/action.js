import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
} from "./constant";
import Axios from "axios";

export const getAllProduct = () => {
  return async (dispatch) => {
    dispatch(getProductRequest());
    Axios({
      url: `/products/All`,
      method: "GET",
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        console.log(result);
        return dispatch(getProductSuccess(result.data.data));
      })
      .catch((err) => {
        return dispatch(getProducFail(err));
      });
  };
};

const getProductRequest = () => {
  return {
    type: GET_DATA_REQUEST,
  };
};

const getProductSuccess = (data) => {
  console.log(data)
  return {
    type: GET_DATA_SUCCESS,
    payload: data,
  };
};

const getProducFail = (err) => {
  return {
    type: GET_DATA_FAIL,
    payload: err,
  };
};
