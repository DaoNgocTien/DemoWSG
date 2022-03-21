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
      const completedOrder = orders.data.data.filter(order => {
        return order.status === "completed" || order.status === "returned" || order.status === "cancelled";
      });
      return dispatch(
        getSuccess({
          orders: completedOrder.map((order) => {
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

const storeSettlingPaymentList = list => {

  return async (dispatch) => {
    try {
      dispatch(getRequest());

      return dispatch(
        storePaymentList({
          settlingList: list
        })
      );
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

// const createCampaign = (record) => {
//   return async (dispatch) => {
//     dispatch(getRequest());
//     try {
//       const [createResponse, campaigns, products, order] = await Promise.all([
//         Axios({
//           url: `/campaigns/`,
//           method: "POST",
//           data: record,
//           withCredentials: true,
//         }),
//         Axios({
//           url: `/campaigns/All`,
//           method: "GET",
//           withCredentials: true,
//           exposedHeaders: ["set-cookie"],
//         }),
//         Axios({
//           url: `/products/All`,
//           method: "GET",
//           withCredentials: true,
//           exposedHeaders: ["set-cookie"],
//         }),
//         Axios({
//           url: `/order/supplier/campaign/${record.id}`,
//           method: "GET",
//           withCredentials: true,
//           exposedHeaders: ["set-cookie"],
//         }),
//       ]);

//       // console.log(order);
//       return dispatch(
//         getSuccess({
//           campaigns: campaigns.data.data.map((campaign) => {
//             return {
//               key: campaign.id,
//               ...campaign,
//             };
//           }),
//           products: products.data.data,
//           order:
//             order !== {}
//               ? order.data?.data.map((item) => {
//                 return {
//                   key: item.id,
//                   ...item,
//                 };
//               })
//               : {},
//         })
//       );
//     } catch (error) {
//       // console.log(error);
//       return dispatch(getFailed());
//     }
//   };
// };

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
  storeSettlingPaymentList,

};

export default action;
