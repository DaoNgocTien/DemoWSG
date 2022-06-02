import Axios from "axios";
import { default as categoryAction } from "../../Category/modules/action";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";

const getOneProduct = (id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [product, campaigns, categories] = await Promise.all([Axios({
        url: `/products/${id}`,
        method: "GET",
        withCredentials: true,
        exposedHeaders: ["set-cookie"],
      }), Axios({
        url: `/campaigns/All?productId=${id}`,
        method: "GET",
        withCredentials: true,
        exposedHeaders: ["set-cookie"],
      }), Axios({
        url: `/categories/All`,
        method: "GET",
        withCredentials: true,
      })])

      if (product.data.redirectUrl) { 
        if (product.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = product.data.redirectUrl 
      }

      return dispatch(getSuccess({
        product: product.data.data, campaigns: campaigns.data.data, categories: categories.data.data
      }));

    } catch (error) {
      return dispatch(getFailed(error));
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
