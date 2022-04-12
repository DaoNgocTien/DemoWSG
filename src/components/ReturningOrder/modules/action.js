import Axios from "axios";
import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_COMPLAIN_ORDER
} from "./constant";

const getOrder = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [returning, returned, campaigns] = await Promise.all([
        Axios({
          url: `/order/supplier/status?status=returning`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
        Axios({
          url: `/order/supplier/status?status=returned`,
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
      const orders = [];
      orders.push(...returning.data.data, ...returned.data.data);
    //  console.log(orders);
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
    //  console.log(error);
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
          .then((response) => { })
          .catch((err) => {
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
  const user = JSON.parse(localStorage.getItem("user"));

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

const storeComplainRecord = (record) => {
//  console.log("storeComplainRecord action");
//  console.log(record);
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
  getOrder,
  updateStatusOrder,
  rejectOrder,
  storeComplainRecord,
  confirmReceived,
};

export default action;
