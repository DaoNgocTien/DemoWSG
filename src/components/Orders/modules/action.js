import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";

const getOrder = () => {
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

      return dispatch(
        getSuccess({
          orders: orders.data.data.map((orders) => {
            return {
              key: orders.id,
              ...orders,
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
            if (response.status === 200) {
            }
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
            if (response.status === 200) {
            }
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
};

export default action;
