import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";

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

const createLoyalCustomer = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/loyalCustomer/`,
      method: "POST",
      data: record,
      withCredentials: true,
    })
      .then((result) => {
        if (result.status === 200) {
          const data = result.data.data.map((category) => {
            return {
              key: category.id,
              ...category,
            };
          });
          return dispatch(getSuccess(data));
        }
      })
      .catch((err) => {
        return dispatch(getFailed(err));
      });
  };
};

const updateLoyalCustomer = (record, id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/loyalCustomer/${id}`,
      method: "PUT",
      data: record,
      withCredentials: true,
    })
      .then((result) => {
        if (result.status === 200) {
          const data = result.data.data.map((category) => {
            return {
              key: category.id,
              ...category,
            };
          });
          return dispatch(getSuccess(data));
        }
      })
      .catch((err) => {
        return dispatch(getFailed(err));
      });
  };
};

const getRequest = () => {
  return {
    type: GET_DATA_REQUEST,
  };
};

const getSuccess = (data) => {
  // console.log(data);
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
  createLoyalCustomer,
  updateLoyalCustomer,
};

export default action;
