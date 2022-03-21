import React, { Component } from "react";
import action from "./modules/action";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import DashboardUI from "./views/main-view";

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getOrder();
  }

  render() {
    console.log(this.props.data);
    return (
      <DashboardUI
        data={this.props.data.orders}
        loading={this.props.loading}
        storeSettlingPaymentList={this.props.storeSettlingPaymentList}
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
    loading: state.dashboardReducer.loading,
    data: state.dashboardReducer.data,
    error: state.dashboardReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrder: async () => {
      // console.log("get campaign");
      await dispatch(action.getOrder());
    },

    storeSettlingPaymentList: async (list) => {
      // console.log("get campaign");
      await dispatch(action.storeSettlingPaymentList(list));
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

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
