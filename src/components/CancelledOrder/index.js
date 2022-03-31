import React, { Component } from "react";
import action from "./modules/action";
import { connect } from "react-redux";
import CancelledOrderUI from "./views/main-view";

class CancelledOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getOrder();
  }

  render() {
    return (
      <CancelledOrderUI
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
    loading: state.cancelledOrderReducer.loading,
    data: state.cancelledOrderReducer.data,
    error: state.cancelledOrderReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrder: async () => await dispatch(action.getOrder()),
    updateStatusOrder: async (data) => {
      await dispatch(action.updateStatusOrder(data));
      await dispatch(action.getOrder());
    },
    rejectOrder: async (orderCode, reasonForCancel, imageProof, requester) => {
      await dispatch(
        action.rejectOrder(orderCode, reasonForCancel, imageProof, requester)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelledOrder);
