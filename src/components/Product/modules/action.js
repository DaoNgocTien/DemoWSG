import Axios from "axios";
import { default as categoryAction } from "../../Category/modules/action";
import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";

const getAllProduct = (category) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/products/All?${category ? "categoryId=" + category : ""}`,
      method: "GET",
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        if (result.status === 200) {
          const data = (result.data.data).map(product => {
            return {
              key: product.id,
              ...product
            }
          });
          dispatch(categoryAction.getAllCategory());
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
        dispatch(getSuccess([]));
      }
    })
      .catch(() => {
        return dispatch(getFailed());
      })
  };
}

const updateProduct = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/products/${record.id}`,
      method: "PUT",
      data: {
        name: record.name,
        retailPrice: record?.retailPrice,
        quantity: record?.quantity,
        description: record?.description,
        categoryId: record?.categoryId,
        image: record?.image,
      },
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        dispatch(getSuccess([]));
      }
    }).catch(() => {
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
      if (response.status === 200) {
        dispatch(getSuccess([]));
      }
    }).catch(() => {
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

const action = {
  getAllProduct: getAllProduct,
  createProduct: createProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
}

export default action;