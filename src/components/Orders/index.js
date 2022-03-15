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
    // console.log(this.props);
  }

  render() {
    return (
      <OrderUI
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
    getOrder: async () => await dispatch(action.getOrder()),
    updateStatusOrder: async (data) => {
      await dispatch(action.updateStatusOrder(data));
      await dispatch(action.getOrder())
    },
    rejectOrder: async (orderCode, reasonForCancel, imageProof) => {
      await dispatch(action.rejectOrder(orderCode, reasonForCancel, imageProof));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
