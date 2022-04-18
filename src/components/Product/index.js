import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import { default as campaignAction } from "../Campaign/modules/action";
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
    this.props.getAllProduct();
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
    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // getCategory: async () => await dispatch(getCategory()),
    getAllProduct: async () => {
      await dispatch(action.getAllProduct());
      await dispatch(campaignAction.getCampaign());
    },
    createProduct: async (record) => {
      // console.log("createProduct final");
      // console.log(record);
      await dispatch(action.createProduct(record));
      await dispatch(action.getAllProduct());
    },
    updateProduct: async (record) => {
      // console.log("updateProduct final");
      await dispatch(action.updateProduct(record));
      await dispatch(action.getAllProduct());
    },
    deleteProduct: async (id) => {
      // console.log("deleteProduct final" + id);
      await dispatch(action.deleteProduct(id));
      await dispatch(action.getAllProduct());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);

