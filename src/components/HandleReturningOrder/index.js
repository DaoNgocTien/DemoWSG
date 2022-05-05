import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import HandleReturningOrderUI from "./views/main-view";

class HandleReturningOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const orderCode = this.props.match.params.orderCode;
    this.props.getReturningOrder(orderCode);
  }

  render() {
    return (
      <HandleReturningOrderUI
        data={this.props.data}
        loading={this.props.loading}
        getReturningOrder={this.props.getReturningOrder}
        acceptRequest={this.props.acceptRequest}
        rejectRequest={this.props.rejectRequest}
        rejectOrder={this.props.rejectOrder}
        record={this.props.record}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.handleReturningOrderReducer.loading,
    data: state.handleReturningOrderReducer.data,
    error: state.handleReturningOrderReducer.err,
    record: state.complainOrder.complainRecord,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getReturningOrder: async (orderCode) =>
      await dispatch(action.getData(orderCode)),

    acceptRequest: async (orderCode, type, image = [], orderId) => {
      await dispatch(
        action.acceptRequest(orderCode, type, (image = []), orderId)
      );
      await dispatch(action.getData(orderCode));
    },
    rejectRequest: async (data) => {
      await dispatch(action.rejectRequest(data));
      return window.location.reload();
    },

    rejectOrder: async (
      orderCode,
      type,
      description,
      image,
      orderId,
      requester
    ) => {
      await dispatch(
        action.rejectOrder(
          orderCode,
          type,
          description,
          image,
          orderId,
          requester
        )
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HandleReturningOrder);
