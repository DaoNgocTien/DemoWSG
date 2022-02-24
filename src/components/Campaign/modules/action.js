import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";

const getCampaign = (campaignId) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      let campaigns,
        products,
        order = {};
      if (!campaignId) {
        console.log('test');
        [campaigns, products] = await Promise.all([
          Axios({
            url: `/campaigns/All`,
            method: "GET",
            withCredentials: true,
            exposedHeaders: ["set-cookie"],
          }),
          Axios({
            url: `/products/All`,
            method: "GET",
            withCredentials: true,
            exposedHeaders: ["set-cookie"],
          }),
        ]);
      } else {
        [campaigns, products, order] = await Promise.all([
          Axios({
            url: `/campaigns/All`,
            method: "GET",
            withCredentials: true,
            exposedHeaders: ["set-cookie"],
          }),
          Axios({
            url: `/products/All`,
            method: "GET",
            withCredentials: true,
            exposedHeaders: ["set-cookie"],
          }),
          Axios({
            url: `/order/supplier/campaign/${campaignId}`,
            method: "GET",
            withCredentials: true,
            exposedHeaders: ["set-cookie"],
          }),
        ]);
      }
      // console.log(order);
      return dispatch(
        getSuccess({
          campaigns: campaigns.data.data.map((campaign) => {
            return {
              key: campaign.id,
              ...campaign,
            };
          }),
          products: products.data.data,
          order:
            order !== {}
              ? order.data?.data.map((item) => {
                return {
                  key: item.id,
                  ...item,
                };
              })
              : {},
        })
      );
    } catch (error) {
      // console.log(error);
      return dispatch(getFailed());
    }
  };
};

const createCampaign = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/campaigns/`,
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

const updateCampaign = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());
    Axios({
      url: `/campaigns/${record.id}`,
      method: "PUT",
      data: {
        productId: record.productId,
        fromDate: record.fromDate,
        toDate: record.toDate,
        quantity: record.quantity,
        price: record.price,
      },
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
  getCampaign,
  createCampaign,
  updateCampaign,
};

export default action;
