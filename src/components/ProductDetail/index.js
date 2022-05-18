import React, { Component } from "react";
import { connect } from "react-redux";
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
    this.props.getOneProduct(this.props.match.params.id);
  }

  render() {
    const { loading, data } = this.props;
    if (loading) return <></>;
    return (
      <>
        <ProductUI
          record={this.props.data}
          loading={this.props.loading}
          activeProduct={this.props.activeProduct}
          updateProduct={this.props.updateProduct}
          deleteProduct={this.props.deleteProduct}
          categoryList={this.props.categoryList}
          campaignList={this.props.campaignList}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.productDetailReducer.loading,
    data: state.productDetailReducer.data.product,
    error: state.productDetailReducer.err,
    categoryList: state.productDetailReducer.data.categories,
    campaignList: state.productDetailReducer.data.campaigns,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOneProduct: async (id) => {
      await dispatch(action.getOneProduct(id));
      // await dispatch(campaignAction.getCampaign());
    },
    updateProduct: async (record) => {
      await dispatch(action.getOneProduct(record.id));
    },
    deleteProduct: async (id) => {
      await dispatch(action.getOneProduct(id));
    },
    activeProduct: async (id) => {
      await dispatch(action.getOneProduct(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
