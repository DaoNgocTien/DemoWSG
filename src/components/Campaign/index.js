import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
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
        record={this.props.record}
        productList={this.props.data.products}
        updateCampaign={this.props.updateCampaign}
        createCampaign={this.props.createCampaign}
        deleteCampaign={this.props.deleteCampaign}
        startCampaignBeforeHand={this.props.startCampaignBeforeHand}
        storeCampaign={this.props.storeCampaign}
        getCampaignById={this.props.getCampaignById}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.campaignReducer.loading,
    data: state.campaignReducer.data,
    error: state.campaignReducer.err,
    record: state.campaignReducer.record,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCampaign: async (campaignId) => {
      await dispatch(action.getCampaign(campaignId));
    },

    getCampaignById: async (campaignId) => {
      await dispatch(action.getCampaignById(campaignId));
    },

    createCampaign: async (record) => {
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

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);
