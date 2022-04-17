import React, { Component } from "react";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import action from "./modules/action";
import { default as orderAction } from "../Orders/modules/action";
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
        // orderList={this.props.orderList}
        productList={this.props.data.products}
        updateCampaign={this.props.updateCampaign}
        createCampaign={this.props.createCampaign}
        deleteCampaign={this.props.deleteCampaign}
        startCampaignBeforeHand={this.props.startCampaignBeforeHand}
        storeCampaign={this.props.storeCampaign}
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
    // orderList: state.orderReducer.data.orders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCampaign: async (campaignId) => {
      // console.log("get campaign");
      await dispatch(action.getCampaign(campaignId));
      // await dispatch(orderAction.getOrder());
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
      await dispatch(action.getCampaign());
    },


    startCampaignBeforeHand: async (id) => {
      await dispatch(action.startCampaignBeforeHand(id));
      await dispatch(action.getCampaign());
    },

    
    storeCampaign: async (record) => {
      await dispatch(action.storeCampaign(record));
      await dispatch(action.getCampaign());
    },
    // rejectOrder: async (orderCode, reasonForCancel, imageProof, requester) => {
    //   await dispatch(orderAction.rejectOrder(orderCode, reasonForCancel, imageProof, requester));
    //   await dispatch(orderAction.getOrder());
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);
