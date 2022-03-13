import React, { Component } from "react";
import action from "./modules/action";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import CampaignUI from "./views/main-view";

class Campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getCampaign();
  }

  render() {
    return (
      <CampaignUI
        data={this.props.data.campaigns}
        loading={this.props.loading}
        getCampaign={this.props.getCampaign}
        ordersInCampaign={this.props.data.order}
        productList={this.props.data.products}
        updateCampaign={this.props.updateCampaign}
        createCampaign={this.props.createCampaign}
        deleteCampaign={this.props.deleteCampaign}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.campaignReducer.loading,
    data: state.campaignReducer.data,
    error: state.campaignReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCampaign: async (campaignId) => {
      // console.log("get campaign");
      await dispatch(action.getCampaign(campaignId));
    },

    getOrdersInCampaign: async (campaignID) => {
      // console.log("getOrdersInCampaign final");
      // console.log(campaignID);
    },

    createCampaign: async (record) => {
      // console.log("createProduct final");
      // console.log(record);
      await dispatch(action.createCampaign(record));
      await dispatch(action.getCampaign());
    },

    updateCampaign: async (record) => {
      await dispatch(action.updateCampaign(record));
      await dispatch(action.getCampaign());
    },

    deleteCampaign: async (id) => {
      await dispatch(action.deleteCampaign(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);
