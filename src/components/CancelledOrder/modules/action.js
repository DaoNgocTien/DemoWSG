import Axios from "axios";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";

const getOrder = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [orders, campaigns] = await Promise.all([
        Axios({
          url: `/order/supplier/status?status=cancelled`,
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
      return dispatch(
        getSuccess({
          orders: orders.data.data.map((order) => {
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
      return dispatch(getFailed());
    }
  };
};

const updateStatusOrder = (data) => {
  return async (dispatch) => {
    dispatch(getRequest());
    switch (data.status) {
      case "created": {
        Axios({
          url: `/order/supplier`,
          method: "PUT",
          data: { orderCode: data.ordercode },
          withCredentials: true,
        })
          .then(() => { })
          .catch(() => {
            return dispatch(getFailed());
          });

        break;
      }
      case "processing": {
        Axios({
          url: `/order/supplier/delivering`,
          method: "PUT",
          data: { orderCode: data.ordercode },
          withCredentials: true,
        })
          .then(() => { })
          .catch(() => {
            return dispatch(getFailed());
          });

        break;
      }
      default: {
        break;
      }
    }
  };
};

const rejectOrder = (orderCode, reasonForCancel, imageProof, requester) => {
  let reject = {
    orderCode: orderCode,
    reasonForCancel: reasonForCancel,
    imageProof: imageProof,
    cancellingRequester: requester,
  }
  
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [rejectResponse, orders, campaigns] = await Promise.all([
        Axios({
          url: `/order/supplier/cancel`,
          method: "PUT",
          data: reject,
          withCredentials: true,
        }),
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
      return dispatch(
        getSuccess({
          orders: orders.data.data.map((order) => {
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

const action = {
  getOrder,
  updateStatusOrder,
  rejectOrder,
};

export default action;
