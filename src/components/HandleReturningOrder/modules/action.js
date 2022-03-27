import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_COMPLAIN_ORDER,
} from "./constant";
import Axios from "axios";



const storeComplainRecord = (record) => {
  console.log("storeComplainRecord action");
  console.log(record);
  return async (dispatch) => {
    try {
      return dispatch(getComplainRecord({ complainRecord: record }));
    } catch (error) {
      return dispatch(getFailed());
    }
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

const getComplainRecord = (record) => {
  return {
    type: STORE_COMPLAIN_ORDER,
    payload: record,
  };
};

const getFailed = (err) => {
  return {
    type: GET_DATA_FAIL,
    payload: err,
  };
};

const action = {
  storeComplainRecord,
};

export default action;
