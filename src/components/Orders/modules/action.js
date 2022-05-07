import Axios from "axios";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_ORDER } from "./constant";

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

const updateStatusOrder = (data, image) => {
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
          },
          withCredentials: true,
        })
          .then(() => { })
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
          .then(() => { })
          .catch((err) => {
            return dispatch(getFailed(err));
          });

        break;
      }
      default: {
        break;
      }
    }
  };
};

const getOrderByCampaignId = (campaignId) => {
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
      //  Remove order in notAdvanced
      const ordersort = orders.data?.data.filter(order => order.status.toUpperCase() !== "NOTADVANCED");
      //  Remove order not belong to campaign
      const orderInCampaign = ordersort.data.data.filter(order => {
        return campaignId === order.campaignid;
      });
      return dispatch(
        getSuccess({
          orders: orderInCampaign.map((order) => {
            return {
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

const getFailed = (err) => {
  return {
    type: GET_DATA_FAIL,
    payload: err,
  };
};

const storeRecord = (data) => {
  return {
    type: STORE_ORDER,
    payload: data,
  };
};

const action = {
  getOrder,
  updateStatusOrder,
  getOrderByCampaignId,
  getOrderById,
};

export default action;
