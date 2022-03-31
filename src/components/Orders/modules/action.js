import Axios from "axios";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";

const getOrder = (status) => {
  console.log(status)
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

const updateStatusOrder = (data, image) => {
  console.log(data);
  console.log(image);
  return async (dispatch) => {
    dispatch(getRequest());
    switch (data.status) {
      case "created": {
        Axios({
          url: `/order/status/supplier/processing`,
          method: "PUT",
          data: {
            orderCode: data.ordercode,
            orderId: data.id,
            type: data.campaignid !== null ? "campaign" : "retail",
            // image: image
          },
          withCredentials: true,
        })
          .then((response) => { })
          .catch((err) => {
            return dispatch(getFailed(err));
          });

        break;
      }
      case "processing": {
        Axios({
          url: `/order/status/supplier/delivering`,
          method: "PUT",
          data: {
            orderCode: data.ordercode,
            orderId: data.id,
            type: data.campaignid !== null ? "campaign" : "retail",
            image: image
          },
          withCredentials: true,
        })
          .then((response) => { })
          .catch((err) => {
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
  console.log(reject);
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
