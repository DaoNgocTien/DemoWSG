import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS } from "./constant";
import Axios from "axios";
import APIMethods from "../../../redux/url/APIMethods";

const getCampaign = () => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      const [campaigns, products] = await Promise.all([
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

      return dispatch(
        getSuccess({
          campaigns: campaigns.data.data.map((campaign) => {
            return {
              key: campaign.id,
              ...campaign,
            };
          }),
          products: products.data.data,
        })
      );
    } catch (error) {
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
      .then((response) => {
        if (response.status === 200) {
          // console.log(response);
          // return window.location.reload();
        }
      })
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

export default {
  getCampaign,
  createCampaign,
};
