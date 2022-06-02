import React, { Component } from "react";
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
    return (
      <LoyalCustomerUI
        data={this.props.data.LoyalCustomers}
        loading={this.props.loading}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLoyalCustomerCondition: async () => {
      await dispatch(action.getLoyalCustomerCondition());
    },

    createLoyalCustomerCondition: async (record) => {
      await dispatch(action.createLoyalCustomerCondition(record));
      await dispatch(action.getLoyalCustomerCondition());
    },

    updateLoyalCustomerCondition: async (record, id) => {
      await dispatch(action.updateLoyalCustomerCondition(record, id));
      await dispatch(action.getLoyalCustomerCondition());
    },

    deleteLoyalCustomerCondition: async (id) => {
      await dispatch(action.deleteLoyalCustomerCondition(id));
      await dispatch(action.getLoyalCustomerCondition());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoyalCustomerCondition);
