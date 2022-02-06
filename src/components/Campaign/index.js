import React, { Component } from "react";
import action from "./modules/action";
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
        products={this.props.data.products}
        loading={this.props.loading}
        createCampaign={this.props.createCampaign}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.campaignReducer.loading,
    data: state.campaignReducer.data,
    error: state.campaignReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCampaign: async () => await dispatch(action.getCampaign()),
    createCampaign: async (data) => {
      await dispatch(action.createCampaign(data));
      await dispatch(action.getCampaign());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);
