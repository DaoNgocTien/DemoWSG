import React, { Component } from "react";
import action from "./modules/action";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import DiscountCodeUI from "./views/main-view";

class DiscountCode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getDiscountCode();
  }

  render() {
    return (
      <DiscountCodeUI
        data={this.props.data.campaigns}
        loading={this.props.loading}
        getDiscountCode={this.props.getDiscountCode}
        ordersInCampaign={this.props.data.order}
        productList={this.props.data.products}
        createDiscountCode={this.props.createDiscountCode ? this.props.createDiscountCodethis : () => { }}

        updateDiscountCode={this.props.updateDiscountCode ? this.props.updateDiscountCodethis : () => { }}

        deleteDiscountCode={this.props.deleteDiscountCode ? this.props.deleteDiscountCode : () => { }}
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
    getDiscountCode: async (campaignId) => {
      // console.log("get DiscountCode");
      await dispatch(action.getCampaign(campaignId));
    },

    getOrdersInCampaign: async (campaignID) => {
      // console.log("getOrdersInCampaign final");
      // console.log(campaignID);
    },

    createDiscountCode: async (record) => {
      // console.log("createProduct final");
      // console.log(record);
      await dispatch(action.createCampaign(record));
      await dispatch(action.getCampaign());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscountCode);
