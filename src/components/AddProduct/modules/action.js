import {
  GET_DATA_FOR_PRODUCT_FAIL,
  GET_DATA_FOR_PRODUCT_REQUEST,
  GET_DATA_FOR_PRODUCT_SUCCESSS,
} from "./constant";
import Axios from "axios";

export const getAllDataForProduct = () => {
  return async (dispatch) => {
    dispatch(getDataForProductRequest());
    try {
      const [categories, brands] = await Promise.all([
        await Axios({
          url: `/categories`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      console.log(brands);
      return dispatch(
        getDataForProductSuccess({
          categories: categories.data.data,
        })
      );
    } catch (error) {
      console.log(error);
      return dispatch(getDataForProductFail(error));
    }
  };
};

const getDataForProductRequest = () => {
  return {
    type: GET_DATA_FOR_PRODUCT_REQUEST,
  };
};

const getDataForProductSuccess = (data) => {
  console.log(data);
  return {
    type: GET_DATA_FOR_PRODUCT_SUCCESSS,
    payload: data,
  };
};

const getDataForProductFail = (err) => {
  return {
    type: GET_DATA_FOR_PRODUCT_FAIL,
    payload: err,
  };
};
