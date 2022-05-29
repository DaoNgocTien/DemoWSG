import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_RECORD } from "./constant";
import Axios from "axios";

const getDiscountCode = (id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [discountCodes] = await Promise.all([
        Axios({
          url: `/discountcode?supplierId=${JSON.parse(localStorage.getItem('user'))?.id ?? null}`,
          method: "GET",
          withCredentials: true,
        }),
      ]);
      if (discountCodes.status === 200) {
        let record = id ? discountCodes.data.data.find((item) => {
          return item.id === id;
        }) : {};
        dispatch(storeRecord({
          record: id ? {
            key: record.id,
            ...record,
          } : {}
        }));
        return dispatch(
          getSuccess({
            discountCodes: discountCodes.data.data.map((item) => {
              return {
                key: item.id,
                ...item,
              };
            })
          })
        );
      }
    } catch (error) {
      return dispatch(getFailed(error));
    }
  };
};

const createDiscountCode = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/discountcode/`,
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

const updateDiscountCode = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/discountcode/${record.id}`,
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

const deleteDiscountCode = (id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [deleteResponse] = await Promise.all([
        Axios({
          url: `/discountcode/${id}`,
          method: "DELETE",
          withCredentials: true,
        }),
        // Axios({
        //   url: `/discountcode/supplier`,
        //   method: "GET",
        //   withCredentials: true,
        // }),
      ]);

      if (deleteResponse.status === 200) {
        return window.location = "/discount/discount-codes"
      }

      return dispatch(
        getSuccess({})
      );
    } catch (error) {
      return dispatch(getFailed(error));
    }
  };
};

const getDiscountCodeById = id => {

}

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
    type: STORE_RECORD,
    payload: data,
  };
};

const action = {
  getDiscountCode,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  getDiscountCodeById,
};

export default action;
