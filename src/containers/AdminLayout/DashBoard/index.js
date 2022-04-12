import React, { Component } from "react";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import action from "./modules/action";
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
  //  console.log(this.props.data);
    return (
      <DashboardUI
        data={this.props.data.orders}
        loading={this.props.loading}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.dashboardReducer.loading,
    data: state.dashboardReducer.data,
    error: state.dashboardReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrder: async () => {
      // console.log("get campaign");
      await dispatch(action.getOrder());
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
