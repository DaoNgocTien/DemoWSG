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
    // console.log(this.props);
    return (
      <DiscountCodeUI
        data={this.props.data.discountCodes}
        loading={this.props.loading}
        getDiscountCode={this.props.getDiscountCode}
        ordersInCampaign={this.props.data.order}
        productList={this.props.data.products}
        createDiscountCode={this.props.createDiscountCode}
        updateDiscountCode={this.props.updateDiscountCode}
        deleteDiscountCode={this.props.deleteDiscountCode}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.discountCodeReducer.loading,
    data: state.discountCodeReducer.data,
    error: state.discountCodeReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDiscountCode: async () => {
      await dispatch(action.getDiscountCode());
    },

    createDiscountCode: async (record) => {
      // console.log(record);
      await dispatch(action.createDiscountCode(record));
      await dispatch(action.getDiscountCode());
    },

    updateDiscountCode: async (record, id) => {
      // console.log(record);
      await dispatch(action.updateDiscountCode(record, id));
      await dispatch(action.getDiscountCode());
    },

    deleteDiscountCode: async (id) => {
      await dispatch(action.deleteDiscountCode(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscountCode);
