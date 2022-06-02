import Axios from "axios";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_LOYAL_CUSTOMER_CONDITION } from "./constant";

const getLoyalCustomerCondition = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [LoyalCustomers] = await Promise.all([
        Axios({
          url: `/loyalCustomer`,
          method: "GET",
          withCredentials: true,
        })
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

const getLoyalCustomerConditionById = id => {

  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [LoyalCustomers] = await Promise.all([
        Axios({
          url: `/loyalCustomer`,
          method: "GET",
          withCredentials: true,
        })
      ]);
      if (LoyalCustomers.data.redirectUrl) { 
        if (LoyalCustomers.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = LoyalCustomers.data.redirectUrl 
      }
      return dispatch(
        storeRecord({
          record: LoyalCustomers.data.data?.find(l => l.id === id)
        })
      );
    } catch (error) {
      return dispatch(getFailed());
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

const storeRecord = (data) => {
  return {
    type: STORE_LOYAL_CUSTOMER_CONDITION,
    payload: data,
  };
};


const action = {
  getLoyalCustomerCondition,
  createLoyalCustomerCondition,
  updateLoyalCustomerCondition,
  deleteLoyalCustomerCondition,
  getLoyalCustomerConditionById,
};

export default action;
