import { GET_DATA_FAIL, GET_DATA_REQUEST, GET_DATA_SUCCESS, STORE_CAMPAIGN } from "./constant";
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
        // console.log("test");
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
      order.data?.data.filter(order => order.status !== "notAdvanced");
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

      // console.log(order);

      dispatch(
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
      return (<Redirect to="/discount/campaigns" />);
    } catch (error) {
      // console.log(error);
      return dispatch(getFailed());
    }
  };
};

const updateCampaign = (record) => {
  return async (dispatch) => {
    // dispatch(getRequest());
    Axios({
      url: `/campaigns/${record.id}`,
      method: "PUT",
      data: {
        productId: record.productId,
        fromDate: record.fromDate,
        toDate: record.toDate,
        quantity: record.quantity,
        price: record.price,
        maxQuantity: record.maxQuantity,
        isShare: record.isShare,
        advanceFee: record.advanceFee,
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
          })
          return (<Redirect to="/discount/campaigns" />);

        }
        return (<Redirect to="/discount/campaigns" />);

      })
      .catch((err) => {
        // return dispatch(getFailed(err));
      });
  };
};

const deleteCampaign = id => {
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
      // Axios({
      //   url: `/campaigns/All`,
      //   method: "GET",
      //   withCredentials: true,
      //   exposedHeaders: ["set-cookie"],
      // }),
      // Axios({
      //   url: `/products/All`,
      //   method: "GET",
      //   withCredentials: true,
      //   exposedHeaders: ["set-cookie"],
      // }),
      // Axios({
      //   url: `/order/supplier/campaign/${id}`,
      //   method: "GET",
      //   withCredentials: true,
      //   exposedHeaders: ["set-cookie"],
      // }),
    ]);

    dispatch(
      getSuccess({
        campaigns: [],
      }));
    return (<Redirect to="/discount/campaigns" />);

    //     Axios({
    //       url: `/campaigns/${id}`,
    //       method: "DELETE",
    //       withCredentials: true,
    //     }).then((response) => {
    //       // console.log(response);
    //       if (response.status === 200) {
    //         // console.log(response);
    //         // return window.location.reload();
    //       }
    //     }).catch((err) => {
    //       // console.log(err);
    //       return dispatch(getFailed());
    //     });
  };
}

const startCampaignBeforeHand = id => {
  return async (dispatch) => {
    //  console.log(id);
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
        }));
      return (<Redirect to="/discount/campaigns" />);
    } catch (error) {
      return dispatch(getFailed());
    }
  };
};

const storeCampaign = record => {
  return async (dispatch) => {
    // dispatch(getRequest());
    dispatch(
      storeRecord({
        record: record
      })
    );
    return <Redirect to="/discount/orders-in-campaign" />;
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

const storeRecord = (data) => {
  // console.log(data);
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
  storeCampaign,
};

export default action;
