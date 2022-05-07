import Axios from "axios";
import { default as categoryAction } from "../../Category/modules/action";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";

const getOneProduct = (id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/products/${id}`,
      method: "GET",
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        if (result.status === 200) {
          const data = result.data.data;
          dispatch(categoryAction.getAllCategory());
          return dispatch(getSuccess(data));
        }
      })
      .catch((err) => {
        return dispatch(getFailed(err));
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

const action = {
  getOneProduct: getOneProduct,
};

export default action;
