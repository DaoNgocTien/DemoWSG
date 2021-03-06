import Axios from "axios";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";

const getLoyalCustomer = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [LoyalCustomers] = await Promise.all([
        Axios({
          url: `/loyalCustomer/customer`,
          method: "GET",
          withCredentials: true,
        }),
      ]);

      if (LoyalCustomers.data.redirectUrl) { 
        if (LoyalCustomers.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = LoyalCustomers.data.redirectUrl 
      }
      return dispatch(
        getSuccess({
          LoyalCustomers: LoyalCustomers.data.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          }),
        })
      );
    } catch (error) {
      return dispatch(getFailed(error));
    }
  };
};
const updateLoyalCustomer = (record, id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [, LoyalCustomers] = await Promise.all([
        Axios({
          url: `/loyalCustomer/customer/${id}`,
          method: "PUT",
          data: {
            ...record
          },
          withCredentials: true,
        }),
        Axios({
          url: `/loyalCustomer/customer`,
          method: "GET",
          withCredentials: true,
        }),
      ]);

      if (LoyalCustomers.data.redirectUrl) { 
        if (LoyalCustomers.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = LoyalCustomers.data.redirectUrl 
      }

      return dispatch(
        getSuccess({
          LoyalCustomers: LoyalCustomers.data.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          }),
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

const action = {
  getLoyalCustomer,
  updateLoyalCustomer,
};

export default action;
