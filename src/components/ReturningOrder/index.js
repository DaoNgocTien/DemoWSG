import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import OrderReturningUI from "./views/main-view";

class OrderReturning extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getOrder();
  }

  render() {
    return (
      <OrderReturningUI
        data={this.props.data.orders}
        loading={this.props.loading}
        updateStatusOrder={this.props.updateStatusOrder}
        createCampaign={this.props.createCampaign}
        rejectOrder={this.props.rejectOrder}
        confirmReceived={this.props.confirmReceived}
        storeRecord={this.props.storeRecord}
      />
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    loading: state.returningReducer.loading,
    data: state.returningReducer.data,
    error: state.returningReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrder: async () => await dispatch(action.getOrder()),
    updateStatusOrder: async (data) => {
      await dispatch(action.updateStatusOrder(data));
      await dispatch(action.getOrder());
    },
    rejectOrder: async (orderCode, reasonForCancel, imageProof) => {
      await dispatch(action.rejectOrder(orderCode, reasonForCancel, imageProof));
      await dispatch(action.getOrder());
    },
    storeRecord: async (record) => {
      await dispatch(action.storeRecord(record));
      await dispatch(action.getOrder());
    },

    confirmReceived: async (orderCode, type, orderId) => {
      await dispatch(action.confirmReceived(orderCode, type, orderId));
      await dispatch(action.getOrder());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderReturning);
