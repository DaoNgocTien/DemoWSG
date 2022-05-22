import Axios from "axios";
import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_SETTLING_PAYMENT
} from "./constant";

const getTransaction = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [transactions] = await Promise.all([
        Axios({
          url: `/transaction`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      if (transactions.data.redirectUrl) {
        console.log(transactions.data)
        localStorage.clear()
        window.location = transactions.data.redirectUrl
      }
      return dispatch(
        getSuccess({
          transactions: transactions.data.data,
        })
      );
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const updateTransaction = (transaction) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
        url: `/transaction/createWithdrawableRequest/`,
        method: "POST",
        data: transaction,
        withCredentials: true,
      })
      .then((response) => {})
      .catch((err) => {
        return dispatch(getFailed());
      })
      .finally(() => {});
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

const storePaymentList = (data) => {
  return {
    type: STORE_SETTLING_PAYMENT,
    payload: data,
  };
};

const action = {
  getTransaction,
  updateTransaction,
};

export default action;