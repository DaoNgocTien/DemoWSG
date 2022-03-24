import {
  GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_SETTLING_PAYMENT,
} from "./constant";
import Axios from "axios";

const getOrder = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [orders, campaigns] = await Promise.all([
        Axios({
          url: `/order/supplier`,
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
      // const completedOrder = orders.data.data.filter(order => {
      //   return order.status === "completed" || order.status === "returned" || order.status === "cancelled";
      // });
      return dispatch(
        getSuccess({
          orders: orders.map((order) => {
            return {
              campaign: (campaigns.data.data).filter(camp => {
                return camp.id == order.campaignid;
              }),
              key: order.id,
              ...order,
            };
          }),
        })
      );
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

const getFailed = (err) => {
  return {
    type: GET_DATA_FAIL,
    payload: err,
  };
};

const storePaymentList = (data) => {
  return {
    type: STORE_SETTLING_PAYMENT,
    payload: data,
  };
};

const action = {
  getOrder,

};

export default action;
