import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
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
    return (
      <LoyalCustomerUI
        data={this.props.data.LoyalCustomers}
        loading={this.props.loading}
        updateLoyalCustomer={this.props.updateLoyalCustomer}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loyalCustomerReducer.loading,
    data: state.loyalCustomerReducer.data,
    error: state.loyalCustomerReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLoyalCustomer: async () => {
      await dispatch(action.getLoyalCustomer());
    },

    updateLoyalCustomer: async (record, id) => {
      await dispatch(action.updateLoyalCustomer(record, id));
      await dispatch(action.getLoyalCustomer());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoyalCustomer);
