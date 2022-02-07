import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";
import action from "../../Category/modules/action";

const getAllProduct = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/products/All`,
      method: "GET",
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        if (result.status === 200) {
          console.log("getAllProduct: ");
          console.log(result.data.data);
          const data = (result.data.data).map(product => {
            return {
              key: product.id,
              ...product
            }
          });
          dispatch(action.getAllCategory());
          return dispatch(getSuccess(data));
        }
      })
      .catch((err) => {
        return dispatch(getFailed(err));
      });
  };
};

const createProduct = record => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/products/`,
      method: "POST",
      data: record,
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        console.log(response.data.data);
      }
    })
      .catch((err) => {
        // console.log(err);
        // console.log(typeof (err));
        return dispatch(getFailed());
      })
      .finally(() => {
      });
  };
}

const updateProduct = (record) => {
  console.log(record);
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/products/${record.id}`,
      method: "PUT",
      data: {
        name: record.name,
        retailPrice: record?.retailPrice,
        quantity: record?.quantity,
        description: record?.description
      },
      withCredentials: true,
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        // console.log(response);
        // return window.location.reload();
        console.log(response.data.data);
      }
    }).catch((err) => {
      console.log(err);
      console.log(typeof (err));
      return dispatch(getFailed());
    });
  };
}

const deleteProduct = id => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/products/${id}`,
      method: "DELETE",
      withCredentials: true,
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        console.log(response);
        // return window.location.reload();
      }
    }).catch((err) => {
      console.log(err);
      console.log(typeof (err));
      return dispatch(getFailed());
    });
  };
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

export default {
  getAllProduct: getAllProduct,
  createProduct: createProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
}