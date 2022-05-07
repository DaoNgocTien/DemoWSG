import Axios from "axios";
import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_COMPLAIN_ORDER,
} from "./constant";

const getData = (orderCode) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [orderHistories, order] = await Promise.all([
        Axios({
          url: `/history/orderCode`,
          method: "POST",
          data: {
            orderCode: orderCode,
          },
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
        Axios({
          url: `/order/getOrderByCode?orderCode=${orderCode}`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      return dispatch(
        getSuccess({
          orderHistories: orderHistories.data.data.map((orderHistory) => {
            return {
              key: orderHistory.id,
              ...orderHistory,
            };
          }),
          order: {
            ...order.data.data.order,
          },
          customerAccId: { ...order.data.data.customerId },
          supplierAccId: { ...order.data.data.supplierId },
        })
      );
    } catch (error) {
      console.error(error);
      return dispatch(getFailed());
    }
  };
};

const rejectRequest = (data) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [rejectResponse] = await Promise.all([
        Axios({
          url: `/order/status/supplier/delivered`,
          method: "PUT",
          data: {
            ...data,
          },
          withCredentials: true,
        }),
      ]);

      return dispatch(getSuccess(rejectResponse));
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const storeComplainRecord = (record) => {
  return async (dispatch) => {
    try {
      return dispatch(getComplainRecord({ complainRecord: record }));
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const acceptRequest = (orderCode, type, image = [], orderId) => {
  const user = JSON.parse(localStorage.getItem("user"));

  let body = {
    orderId: orderId,
    orderCode: orderCode,
    type: type,
    description:
      "has been accepted by " +
      user.rolename +
      " for: Customer requests to return order",
    image: image,
    status: "requestAccepted",
  };
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [acceptRequestResponse] = await Promise.all([
        Axios({
          url: `/history/status`,
          method: "POST",
          data: body,
          withCredentials: true,
        }),
      ]);

      return dispatch(getSuccess(acceptRequestResponse));
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
  getData,
  storeComplainRecord,
  rejectRequest,
  acceptRequest,
};

export default action;
