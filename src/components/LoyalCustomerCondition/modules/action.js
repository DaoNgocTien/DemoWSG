import Axios from "axios";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";

const getLoyalCustomerCondition = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [LoyalCustomers, products] = await Promise.all([
        Axios({
          url: `/loyalCustomer`,
          method: "GET",
          withCredentials: true,
        }),
        Axios({
          url: `/products/All`,
          method: "GET",
          withCredentials: true,
        }),
      ]);

      return dispatch(
        getSuccess({
          LoyalCustomers: LoyalCustomers.data.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          }),
          products: products.data.data.map((item) => {
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

const createLoyalCustomerCondition = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());

    try {
      const [createResponse, LoyalCustomers, products] = await Promise.all([
        Axios({
          url: `/loyalCustomer/`,
          method: "POST",
          data: record,
          withCredentials: true,
        }),
        Axios({
          url: `/loyalCustomer`,
          method: "GET",
          withCredentials: true,
        }),
        Axios({
          url: `/products/All`,
          method: "GET",
          withCredentials: true,
        }),
      ]);

      return dispatch(
        getSuccess({
          LoyalCustomers: LoyalCustomers.data.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          }),
          products: products.data.data.map((item) => {
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


const updateLoyalCustomerCondition = (record, id) => {
  return async (dispatch) => {
    dispatch(getRequest());

    try {
      const [updateResponse, LoyalCustomers, products] = await Promise.all([
        Axios({
          url: `/loyalCustomer/${id}`,
          method: "PUT",
          data: record,
          withCredentials: true,
        }),
        Axios({
          url: `/loyalCustomer`,
          method: "GET",
          withCredentials: true,
        }),
        Axios({
          url: `/products/All`,
          method: "GET",
          withCredentials: true,
        }),
      ]);

      return dispatch(
        getSuccess({
          LoyalCustomers: LoyalCustomers.data.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          }),
          products: products.data.data.map((item) => {
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

const deleteLoyalCustomerCondition = (id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [deleteResponse, LoyalCustomers, products] = await Promise.all([
        Axios({
          url: `/loyalCustomer/${id}`,
          method: "DELETE",
          withCredentials: true,
        }),
        Axios({
          url: `/loyalCustomer`,
          method: "GET",
          withCredentials: true,
        }),
        Axios({
          url: `/products/All`,
          method: "GET",
          withCredentials: true,
        }),
      ]);

      return dispatch(
        getSuccess({
          LoyalCustomers: LoyalCustomers.data.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          }),
          products: products.data.data.map((item) => {
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
  getLoyalCustomerCondition,
  createLoyalCustomerCondition,
  updateLoyalCustomerCondition,
  deleteLoyalCustomerCondition,
};

export default action;
