import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import OrderManagement from "./views/order-management";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getOrder();
  }

  render() {
    return (
      <OrderManagement
        getOrder={this.props.getOrder}
        data={this.props.data.orders}
        loading={this.props.loading}
        updateStatusOrder={this.props.updateStatusOrder}
        createCampaign={this.props.createCampaign}
        confirmReceived={this.props.confirmReceived}
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
    rejectOrder: async (status) => {
      await dispatch(action.getOrder(status));
    },
    confirmReceived: async (orderCode, type, orderId) => {
      await dispatch(action.confirmReceived(orderCode, type, orderId));
      await dispatch(action.getOrder());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
