import React, { Component } from "react";
import action from "./modules/action";
import { connect } from "react-redux";
import OrderUI from "./views/main-view";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getOrder();
  }

  render() {
    return (
      <OrderUI
        getOrder={this.props.getOrder}
        data={this.props.data.orders}
        loading={this.props.loading}
        updateStatusOrder={this.props.updateStatusOrder}
        createCampaign={this.props.createCampaign}
        rejectOrder={this.props.rejectOrder}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.orderReducer.loading,
    data: state.orderReducer.data,
    error: state.orderReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrder: async (status) => await dispatch(action.getOrder(status)),
    updateStatusOrder: async (data, image) => {
      await dispatch(action.updateStatusOrder(data, image));
      await dispatch(action.getOrder());
    },
    rejectOrder: async (orderCode, reasonForCancel, imageProof, requester) => {
      await dispatch(
        action.rejectOrder(orderCode, reasonForCancel, imageProof, requester)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
