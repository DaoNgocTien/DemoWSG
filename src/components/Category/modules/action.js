import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";


const getAllCategory = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/categories/All`,
      method: "GET",
      withCredentials: true,
    })
      .then((result) => {
        if (result.status === 200) {
          const data = (result.data.data).map(category => {
            return {
              key: category.id,
              ...category
            }
          });
          // if (Array.isArray(data)) {
          //   data.map((item) => {
          //     // //console.log(item);
          //   })
          // }
          return dispatch(getSuccess(data));
        }
      })
      .catch((err) => {
        return dispatch(getFailed());
      });
  };
};

const createCategory = record => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/categories/`,
      method: "POST",
      data: record,
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        // //console.log(response);
        // return window.location.reload();
      }
    })
      .catch((err) => {
        return dispatch(getFailed());
      })
      .finally(() => {
      });
  };
}

const updateCategory = (record) => {
  // //console.log(record);
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/categories/${record.id}`,
      method: "PUT",
      data: { categoryName: record.categoryName },
      withCredentials: true,
    }).then((response) => {
      // //console.log(response);
      if (response.status === 200) {
        // // //console.log(response);
        // return window.location.reload();
      }
    }).catch((err) => {
      // //console.log(err);
      return dispatch(getFailed());
    });
  };
}

const deleteCategory = id => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/categories/${id}`,
      method: "DELETE",
      withCredentials: true,
    }).then((response) => {
      // //console.log(response);
      if (response.status === 200) {
        // //console.log(response);
        // return window.location.reload();
      }
    }).catch((err) => {
      // //console.log(err);
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
  getAllCategory: getAllCategory,
  createCategory: createCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory
}

export default action;