import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";

const getDiscountCode = () => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [discountCodes, products] = await Promise.all([
        Axios({
          url: `/discountcode/supplier`,
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
          discountCodes: discountCodes.data.data.map((item) => {
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

const updateDiscountCode = (record, id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/discountcode/${id}`,
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

// const createCampaign = record => {
//   return async (dispatch) => {
//     dispatch(getRequest());
//     Axios({
//       url: `/campaigns/`,
//       method: "POST",
//       data: record,
//       withCredentials: true,
//     }).then((response) => {
//       if (response.status === 200) {
//         // console.log(response.data.data);
//       }
//     })
//       .catch((err) => {
//         // // console.log(err);
//         // // console.log(typeof (err));
//         return dispatch(getFailed());
//       })
//       .finally(() => {
//       });
//   };
// }

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
  getDiscountCode,
  createDiscountCode,
  updateDiscountCode
};

export default action;