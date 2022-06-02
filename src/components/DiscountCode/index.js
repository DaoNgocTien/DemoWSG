import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import DiscountCodeUI from "./views/main-view";

class DiscountCode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getDiscountCode();
  }

  render() {
    return (
      <DiscountCodeUI
        data={this.props.data.discountCodes}
        loading={this.props.loading}
        getDiscountCode={this.props.getDiscountCode}
        createDiscountCode={this.props.createDiscountCode}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.discountReducer.loading,
    data: state.discountReducer.data,
    error: state.discountReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDiscountCode: async () => {
      await dispatch(action.getDiscountCode());
    },

    createDiscountCode: async (record) => {
      await dispatch(action.createDiscountCode(record));
      await dispatch(action.getDiscountCode());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscountCode);
