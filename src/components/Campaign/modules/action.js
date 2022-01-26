import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
} from "./constant";
import Axios from "axios";
import APIMethods from "../../../redux/url/APIMethods";

const getCampaign = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/campaigns/All`,
      method: "GET",
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        if (result.status === 200) {
          console.log(result.data.data);
          return dispatch(getSuccess(result.data.data));
        }
      })
      .catch((err) => {
        return dispatch(getProducFail(err));
      });
  };
};

const getRequest = () => {
  return {
    type: GET_DATA_REQUEST,
  };
};

const getSuccess = (data) => {
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

export default {
  getCampaign,
};
