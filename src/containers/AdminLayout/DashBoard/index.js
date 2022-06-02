import React, { Component } from "react";

import { connect } from "react-redux";
import action from "../../../components/Orders/modules/action";
import DashboardUI from "./views/main-view";

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getOrder();
  }

  render() {
    return (
      <DashboardUI data={this.props.data.orders ?? []} loading={this.props.loading} />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
