import Axios from "axios";
import { Redirect } from "react-router-dom";
import {
  GET_DATA_FAIL,
  GET_DATA_REQUEST,
  GET_DATA_SUCCESS,
  STORE_CAMPAIGN,
} from "./constant";

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

      if (products.data.redirectUrl) { 
        if (products.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = products.data.redirectUrl 
      }

      let availableProducts = products.data.data.filter((p) => {
        let max = 0;
        campaigns.data.data.map((c) => {
          max += c.productid === p.id ? Number(c.maxquantity) : 0;
        });
        return p.quantity - max >= 10;
      });
      const campaignsList = campaigns.data.data.length == 0 ? [] : campaigns.data.data?.map((campaign) => {
        return {
          key: campaign.id,

          ...campaign,
          range: JSON.parse(campaign.range),
        };
      })
      const productList = availableProducts.map((p) => {
        let max = 0;
        if (campaigns.data.data.length !== 0)
          campaigns.data.data.map((c) => {
            max += c.productid === p.id ? Number(c.maxquantity) : 0;
          });
        if (Number((p.quantity - max)) * Number(p.retailprice) >= 10000 && p.status !== "deactivated") {
          return {
            key: p.id,
            maxquantity: max,
            ...p,
          }
        }
      });

      return dispatch(
        getSuccess({
          campaigns: campaignsList,
          products: productList,
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
      if (products.data.redirectUrl) { 
        if (products.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = products.data.redirectUrl 
      }

      if (createResponse.data.message) {
        alert(createResponse.data.message);
      }

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
  console.log(record)
  return async (dispatch) => {
    Axios({
      url: `/campaigns/${record.id}`,
      method: "PUT",
      data: {
        status: "ready",
        productId: record.productId,
        fromdate: record.fromDate,
        todate: record.toDate,
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
        if (result.data.redirectUrl) { 
          if (result.data.redirectUrl === '/login') {
            localStorage.clear()
          }
          return window.location = result.data.redirectUrl 
        }

        if (result.status === 200) {
          if (result.data.message) {
            alert(result.data.message);
          }
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
    try {
      let deleteResponse = {};
      dispatch(getRequest());
      [deleteResponse] = await Promise.all([
        Axios({
          url: `/campaigns/${id}`,
          method: "DELETE",
          withCredentials: true,
        }),
      ]);

      if (deleteResponse.data.redirectUrl) { 
        if (deleteResponse.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = deleteResponse.data.redirectUrl 
      }

      dispatch(
        getSuccess({
          campaigns: [],
        })
      );
      return <Redirect to="/discount/campaigns" />;
    }
    catch (error) {
      return dispatch(getFailed());
    }
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
      if (response.data.redirectUrl) { 
        if (response.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = response.data.redirectUrl 
      }

      if (response.status === 200) {
        if (!response.data.data) {
          alert(response.data.message);
        }
      }
      dispatch(
        getSuccess({
          campaigns: [],
        })
      );
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const doneCampaignBeforeHand = (id) => {
  return async (dispatch) => {
    dispatch(getRequest());
    try {
      const [response] = await Promise.all([
        Axios({
          url: `/campaigns/supplier/doneCampaign`,
          method: "PUT",
          data: {
            campaignId: id,
          },
          withCredentials: true,
        }),
      ]);

      if (response.data.redirectUrl) { 
        if (response.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = response.data.redirectUrl 
      }

      dispatch(
        getSuccess({
          campaigns: [],
        })
      );
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const getCampaignById = (id) => {
  return async (dispatch) => {
    try {
      let [campaign, orders, products, campaigns] = await Promise.all([
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
        Axios({
          url: `/products/All`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
        Axios({
          url: `/campaigns/All`,
          method: "GET",
          withCredentials: true,
          exposedHeaders: ["set-cookie"],
        }),
      ]);
      if (products.data.redirectUrl) { 
        if (products.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = products.data.redirectUrl 
      }
      //  Get all product with available quantity >= 10
      let availableProducts = products.data.data.filter((p) => {
        let max = 0;
        campaigns.data.data.map((c) => {
          max += c.productid === p.id ? Number(c.maxquantity) : 0;
        });
        return p.quantity - max >= 10;
      });
      return dispatch(
        storeRecord({
          record: {
            key: campaign.data.data.campaign.id,
            productname: campaign.data.data.product.name,
            productimage: campaign.data.data.product.image,
            numorder: orders.data?.data.length,
            product: campaign.data.data.product,
            ...campaign.data.data.campaign,
          },

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

const action = {
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  startCampaignBeforeHand,
  doneCampaignBeforeHand,
  getCampaignById,
};

export default action;
