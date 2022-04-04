import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelledOrder);
