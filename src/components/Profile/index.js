import React, { Component } from "react";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import action from "./modules/action";
import ProfileUI from "./views/main-view";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getProfile();
  }

  render() {
    return (
      <ProfileUI
        data={this.props.data}
        loading={this.props.loading}
        getProfile={this.props.getProfile}
        productList={this.props.data.products}
        changePassword={this.props.changePassword}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.profileReducer.loading,
    data: state.profileReducer.data,
    error: state.profileReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: async () => {
      // //console.log("get campaign");
      await dispatch(action.getProfile());
    },

    getOrdersInCampaign: async (campaignID) => {
      // //console.log("getOrdersInCampaign final");
      // //console.log(campaignID);
    },

    createCampaign: async (record) => {
      // //console.log("createProduct final");
      // //console.log(record);
      await dispatch(action.createCampaign(record));
      // await dispatch(action.getCampaign());
    },

    updateCampaign: async (record) => {
      await dispatch(action.updateCampaign(record));
      // await dispatch(action.getCampaign());
    },

    deleteCampaign: async (id) => {
      await dispatch(action.deleteCampaign(id));
    },

    changePassword: async (id, password) => {
      await dispatch(action.changePassword(id, password));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
