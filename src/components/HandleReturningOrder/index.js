import React, { Component } from "react";
import action from "./modules/action";
import { connect } from "react-redux";
import HandleReturningOrderUI from "./views/main-view";

class HandleReturningOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const orderCode = this.props.match.params.orderCode;
    this.props.getReturningOrder(orderCode)
  }

  render() {
    return (
      <HandleReturningOrderUI
        data={this.props.data}
        loading={this.props.loading}
        getReturningOrder={this.props.getReturningOrder}
        acceptRequest={this.props.acceptRequest}
        rejectRequest={this.props.rejectRequest}
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
    getReturningOrder: async (orderCode) => await dispatch(action.getData(orderCode)),

    acceptRequest: async (data) => {
      console.log("Accept returning request");
      // await dispatch(action.updateStatusOrder(data));
      // await dispatch(action.getOrder())
    },
    rejectRequest: async (orderCode, reasonForCancel, imageProof) => {
      console.log("Reject returning request");
      // await dispatch(action.rejectOrder(orderCode, reasonForCancel, imageProof));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HandleReturningOrder);
