import React, { Component } from "react";
import action from "./modules/action";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import LoyalCustomerUI from "./views/main-view";

class LoyalCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getLoyalCustomer();
  }

  render() {
    // console.log(this.props);
    return (
      <LoyalCustomerUI
        data={this.props.data.LoyalCustomers}
        loading={this.props.loading}
        getLoyalCustomer={this.props.getLoyalCustomer}
        ordersInCampaign={this.props.data.order}
        productList={this.props.data.products}
        createLoyalCustomer={this.props.createLoyalCustomer}
        updateLoyalCustomer={this.props.updateLoyalCustomer}
        disableLoyalCustomer={this.props.disableLoyalCustomer}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loyalCustomerReducer.loading,
    data: state.loyalCustomerReducer.data,
    error: state.loyalCustomerReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLoyalCustomer: async () => {
      await dispatch(action.getLoyalCustomer());
    },

    createLoyalCustomer: async (record) => {
      // console.log(record);
      await dispatch(action.createLoyalCustomer(record));
      await dispatch(action.getLoyalCustomer());
    },

    disableLoyalCustomer: async (id) => {
      // console.log(record);
      await dispatch(action.disableLoyalCustomer(id));
      await dispatch(action.getLoyalCustomer());
    },

    updateLoyalCustomer: async (record, id) => {
      // console.log(record);
      await dispatch(action.updateLoyalCustomer(record, id));
      await dispatch(action.getLoyalCustomer());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoyalCustomer);
