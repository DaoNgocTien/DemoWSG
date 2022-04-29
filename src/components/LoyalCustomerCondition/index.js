import React, { Component } from "react";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import action from "./modules/action";
import LoyalCustomerUI from "./views/main-view";

class LoyalCustomerCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getLoyalCustomerCondition();
  }

  render() {
    // //console.log(this.props);
    return (
      <LoyalCustomerUI
        data={this.props.data.LoyalCustomers}
        loading={this.props.loading}
        getLoyalCustomerCondition={this.props.getLoyalCustomerCondition}
        ordersInCampaign={this.props.data.order}
        productList={this.props.data.products}
        createLoyalCustomerCondition={this.props.createLoyalCustomerCondition}
        updateLoyalCustomerCondition={this.props.updateLoyalCustomerCondition}
        deleteLoyalCustomerCondition={this.props.deleteLoyalCustomerCondition}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loyalCustomerConditionReducer.loading,
    data: state.loyalCustomerConditionReducer.data,
    error: state.loyalCustomerConditionReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLoyalCustomerCondition: async () => {
      await dispatch(action.getLoyalCustomerCondition());
    },

    createLoyalCustomerCondition: async (record) => {
      // //console.log(record);
      await dispatch(action.createLoyalCustomerCondition(record));
      // await dispatch(action.getLoyalCustomerCondition());
    },

    updateLoyalCustomerCondition: async (record, id) => {
      // //console.log(record);
      await dispatch(action.updateLoyalCustomerCondition(record, id));
      // await dispatch(action.getLoyalCustomerCondition());
    },

    deleteLoyalCustomerCondition: async (id) => {
      alert(id);
      await dispatch(action.deleteLoyalCustomerCondition(id));
      // await dispatch(action.getLoyalCustomerCondition());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoyalCustomerCondition);
