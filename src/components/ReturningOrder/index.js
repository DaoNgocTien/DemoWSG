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
    // console.log(this.props);
  }

  render() {
    return (
      <OrderReturningUI
        data={this.props.data.orders}
        loading={this.props.loading}
        updateStatusOrder={this.props.updateStatusOrder}
        createCampaign={this.props.createCampaign}
        rejectOrder={this.props.rejectOrder}
        storeComplainRecord={this.props.storeComplainRecord}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.ReturningOrderReducer.loading,
    data: state.ReturningOrderReducer.data,
    error: state.ReturningOrderReducer.err,
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

    storeComplainRecord: async (record) => {
      console.log("storeComplainRecord");
      console.log(record);
      await dispatch(action.storeComplainRecord(record));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderReturning);
