import Axios from "axios";
import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_RECORD
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
      //  Sort order to get returning order only
      return dispatch(
        getSuccess({
          orders: orders.map((order) => {
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

const rejectOrder = (orderCode, reasonForCancel, imageProof) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [rejectResponse, orders, campaigns] = await Promise.all([
        Axios({
          url: `/order/supplier/cancel`,
          method: "PUT",
          data: {
            orderCode: orderCode,
            reasonForCancel: reasonForCancel,
            imageProof: imageProof,
          },
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

const confirmReceived = (orderCode, type, orderId) => {

  let body = {
    orderCode: orderCode,
    type: type,
    orderId: orderId,
    description: "has been returned",
  }
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [confirmReceivedResponse] = await Promise.all([
        Axios({
          url: `/order/status/supplier/returned`,
          method: "PUT",
          data: body,
          withCredentials: true,
        }),
        
      ]);
      return dispatch(
        getSuccess({
          orders: [],
        })
      );
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const getOrderById = id => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [orders] = await Promise.all([
        Axios({
          url: `/order/supplier`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      //  Remove order in notAdvanced
      const record = orders.data?.data?.find(o => o.status.toUpperCase() !== "NOTADVANCED" && o.id === id) ?? {};

      return dispatch(
        storeRecord({
          record: record
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

const storeRecord = (record) => {
  return {
    type: STORE_RECORD,
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
  storeRecord,
  getOrder,
  getOrderById,
  updateStatusOrder,
  rejectOrder,  
  confirmReceived,
};

export default action;
