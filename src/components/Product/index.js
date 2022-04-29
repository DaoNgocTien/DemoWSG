import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import { default as campaignAction } from "../Campaign/modules/action";
import { default as orderAction } from "../Orders/modules/action";

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
    const category = new URLSearchParams(search).get("category");
    //console.log(category);
    this.props.getAllProduct(category);
  }

  render() {
    return (
      <>
        <ProductUI
          data={this.props.data}
          loading={this.props.loading}
          createProduct={this.props.createProduct}
          updateProduct={this.props.updateProduct}
          deleteProduct={this.props.deleteProduct}
          categoryList={this.props.categoryList}
          campaignList={this.props.campaignList.campaigns}
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
    campaignList: state.campaignReducer.data,
    orderList: state.orderReducer.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProduct: async (category) => {
      await dispatch(action.getAllProduct(category));
      await dispatch(campaignAction.getCampaign());
      await dispatch(orderAction.getOrder());
    },
    createProduct: async (record) => {
      await dispatch(action.createProduct(record));
      await dispatch(action.getAllProduct());
    },
    updateProduct: async (record) => {
      await dispatch(action.updateProduct(record));
      await dispatch(action.getAllProduct());
    },
    deleteProduct: async (id) => {
      await dispatch(action.deleteProduct(id));
      await dispatch(action.getAllProduct());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
