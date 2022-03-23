import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_COMPLAIN_ORDER,
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
      // orders.data.data.map((order) => {
      //   let campL = [(campaigns.data.data).filter(camp => {
      //     return order.campaignid ?? camp.id == order.campaignid;
      //   }



      //   )](0);
      //   console.log(campL);
      // });
      // console.log(orders.data.data.length);
      const completedOrder = orders.data.data.filter(order => {
        return order.status === "completed" || order.status === "returned" || order.status === "cancelled";
      });
      return dispatch(
        getSuccess({
          orders: completedOrder.data.data.map((order) => {
            return {
              campaign: (campaigns.data.data).filter(camp => {
                return camp.id == order.campaignid;
              }),
              key: completedOrder.id,
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
          .then((response) => {
          })
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
          .then((response) => {
          })
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
              campaign: (campaigns.data.data).filter(camp => {
                return camp.id == order.campaignid;
              }),
              key: order.id,
              ...order,
            };
          }),
        }))
    } catch (error) {
      return dispatch(getFailed());
    }
  }
};

const storeComplainRecord = (record) => {
  console.log("storeComplainRecord action");
  console.log(record);
  return async (dispatch) => {
    try {
      return dispatch(
        getComplainRecord({ complainRecord: record })
      );
    } catch (error) {
      return dispatch(getFailed());
    }
  }
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
};

export default action;
