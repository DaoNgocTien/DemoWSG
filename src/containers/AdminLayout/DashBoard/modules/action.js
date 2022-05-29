import Axios from "axios";
import {
  GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS
} from "./constant";

const getOrder = (status) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [orders, campaigns] = await Promise.all([
        !status
          ? Axios({
            url: `/order/supplier`,
            method: "GET",
            withCredentials: true,
            exposedHeaders: ["set-cookie"],
          })
          : Axios({
            url: `/order/supplier/status?status=${status}`,
            method: "GET",
            withCredentials: true,
            exposedHeaders: ["set-cookie"],
          }),
        Axios({
          url: `/campaigns/All`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      //  Sort order to remove NOTADVANCED
      const ordersort = orders.data?.data.filter(order => order.status.toUpperCase() !== "NOTADVANCED");
      return dispatch(
        getSuccess({
          orders: ordersort.map((order) => {
            return {
              campaign: campaigns.data.data.filter((camp) => {
                return camp.id == order.campaignid;
              }),
              key: order.id,
              ...order,
            };
          }),
        })
      );
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
  getOrder,

};

export default action;
