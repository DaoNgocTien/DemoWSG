import React, { Component } from "react";
import action from "./modules/action";
import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import CampaignUI from "./views/main-view";

class Campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log("test campaigns");
    this.props.getCampaign();
  }

  render() {
    return <CampaignUI
      data={this.props.data}
      loading={this.props.loading}
      orderList={this.props.orderList}
      productList={this.props.productList}
      createCampaign={this.props.createCampaign}
    />;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.campaignReducer.loading,
    data: state.campaignReducer.data,
    error: state.campaignReducer.err,
    productList: state.productReducer.data,
    orderList: [],

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCampaign: async () => {
      await dispatch(action.getCampaign());
      await dispatch(productAction.getAllProduct());
      await dispatch(action.getCampaign());
    },

    getOrdersInCampaign: async (campaignID) => {
      console.log("getOrdersInCampaign final");
      console.log(campaignID);
      // await dispatch(action.createProduct(record));
      // await dispatch(action.getAllProduct());
    },

    createCampaign: async (record) => {
      console.log("createProduct final");
      console.log(record);
      await dispatch(action.createCampaign(record));
      await dispatch(action.getCampaign());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);
