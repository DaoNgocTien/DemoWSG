import React, { Component } from "react";
import { connect } from "react-redux";
import { default as orderAction } from "../Orders/modules/action";
import action from "./modules/action";
import ProductUI from "./views/main-view";


class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CreateModel: false,
      EditModel: false,
      DeleteModel: false,
      editRecord: null,
    };
  }

  componentDidMount() {
    const search = this.props.location.search;
    const category = new URLSearchParams(search).get("category")
    this.props.getAllProduct(category);
  }

  render() {
    return (
      <>
        <ProductUI
          data={this.props.data}
          loading={this.props.loading}
          createProduct={this.props.createProduct}
          categoryList={this.props.categoryList}
          orderList={this.props.orderList.orders}
          url={this.props.location.search}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.productReducer.loading,
    data: state.productReducer.data,
    error: state.productReducer.err,
    categoryList: state.categoryReducer.data,
    orderList: state.orderReducer.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProduct: async (category) => {
      await dispatch(action.getAllProduct(category));
      await dispatch(orderAction.getOrder());
    },
    createProduct: async (record) => {
      await dispatch(action.createProduct(record));
      await dispatch(action.getAllProduct());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
