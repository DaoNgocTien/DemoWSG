import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_CAMPAIGN,
  STORE_CREATING_ERR,
} from "./constant";
import Axios from "axios";
import { Link, Redirect, Route } from "react-router-dom";

const getCampaign = (campaignId) => {
  return async (dispatch) => {
    try {
      dispatch(getRequest());
      let campaigns,
        products,
        order = {};
      if (!campaignId) {
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
            url: `/campaigns/ + ${campaignId}`,
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

      let availableProducts = products.data.data.filter((p) => {
        let max = 0;
        campaigns.data.data.map((c) => {
          max += c.productid === p.id ? Number(c.maxquantity) : 0;
        });
        return p.quantity - max >= 10;
      });

      order.data?.data.filter((order) => order.status !== "notAdvanced");

      return dispatch(
        getSuccess({
          campaigns: campaigns.data.data.map((campaign) => {
            return {
              key: campaign.id,

              ...campaign,
              range: JSON.parse(campaign.range),
            };
          }),
          products: availableProducts.map((p) => {
            let max = 0;
            campaigns.data.data.map((c) => {
              max += c.productid === p.id ? Number(c.maxquantity) : 0;
            });
            return {
              key: p.id,
              maxquantity: max,
              ...p,
            };
          }),
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
      return dispatch(getFailed());
    }
  };
};

const createCampaign = (record) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [createResponse, campaigns, products] = await Promise.all([
        Axios({
          url: `/campaigns/`,
          method: "POST",
          data: record,
          withCredentials: true,
        }),
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
      // if (createResponse.data.message) {
      //   dispatch(
      //     creatingErr({
      //       creatingMessage: createResponse.data.message,
      //       creatingErr: true
      //     })
      //   )
      // }
      alert(createResponse.data.message);
      dispatch(
        getSuccess({
          campaigns: campaigns.data.data.map((campaign) => {
            return {
              range: JSON.parse(campaign.range),
              key: campaign.id,
              ...campaign,
            };
          }),
          products: products.data.data,
        })
      );
      return <Redirect to="/discount/campaigns" />;
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const updateCampaign = (record) => {
  return async (dispatch) => {
    console.log(record);

    Axios({
      url: `/campaigns/${record.id}`,
      method: "PUT",
      data: {
        status: "ready",
        productId: record.productId,
        fromDate: record.fromDate,
        toDate: record.toDate,
        quantity: record.quantity,
        price: record.price,
        maxQuantity: record.maxQuantity,
        isShare: record.isShare,
        advanceFee: record.advanceFee,
        range: record.range,
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
        }
      })
      .catch((err) => {
        return dispatch(getFailed(err));
      });
  };
};

const deleteCampaign = (id) => {
  return async (dispatch) => {
    let deleteResponse,
      campaigns,
      products,
      order = {};
    dispatch(getRequest());
    [deleteResponse] = await Promise.all([
      Axios({
        url: `/campaigns/${id}`,
        method: "DELETE",
        withCredentials: true,
      }),
    ]);

    dispatch(
      getSuccess({
        campaigns: [],
      })
    );
    return <Redirect to="/discount/campaigns" />;
  };
};

const startCampaignBeforeHand = (id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [response] = await Promise.all([
        Axios({
          url: `/campaigns/update/active`,
          method: "PUT",
          data: {
            campaignId: id,
          },
          withCredentials: true,
        }),
      ]);

      dispatch(
        getSuccess({
          campaigns: [],
        })
      );
      return <Redirect to="/discount/campaigns" />;
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const storeCampaign = (record) => {
  return async (dispatch) => {
    console.log(record);
    dispatch(
      storeRecord({
        record: record,
      })
    );
    return <Redirect to="/discount/orders-in-campaign" />;
  };
};

const getCampaignById = (id) => {
  return async (dispatch) => {
    try {
      let [campaign, orders] = await Promise.all([
        Axios({
          url: `/campaigns/` + id,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
        Axios({
          url: `/order/supplier/campaign/${id}`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      console.log(campaign.data.data.campaign);
      return dispatch(
        storeRecord({
          record: {
            key: campaign.data.data.campaign.id,
            ...campaign.data.data.campaign,
          },
          isStartAbleMessage: campaign.data.data.reason,
          isStartAble: campaign.data.data.startable,
          orders:
            orders !== {}
              ? orders.data?.data.map((item) => {
                return {
                  key: item.id,
                  ...item,
                };
              })
              : {},
        })
      );
    } catch (error) {
      return dispatch(getFailed());
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
    type: STORE_CAMPAIGN,
    payload: data,
  };
};

const creatingErr = (data) => {
  return {
    type: STORE_CREATING_ERR,
    payload: data,
  };
};

const action = {
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  startCampaignBeforeHand,
  storeCampaign,
  getCampaignById,
};

export default action;
