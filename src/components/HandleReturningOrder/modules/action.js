import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_COMPLAIN_ORDER,
} from "./constant";
import Axios from "axios";
import { Redirect } from "react-router";

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
      console.log(order);
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

const rejectOrder = (data) => {
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

      return window.location.replace("/returning")
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

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
  getData,
  storeComplainRecord,
  rejectOrder,
};

export default action;
