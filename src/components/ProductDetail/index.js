import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import { default as campaignAction } from "../Campaign/modules/action";
import { default as orderAction } from "../Orders/modules/action";
import Loader from "../../components/Loader";

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
    console.log(this.props);
    this.props.getOneProduct(this.props.match.params.id);
  }

  render() {
    console.log(this.props.data);
    const { loading, data } = this.props;
    if (loading) return <Loader />;
    return (
      <>
        <ProductUI
          record={this.props.data}
          // data={this.props.data}
          loading={this.props.loading}
          // createProduct={this.props.createProduct}
          updateProduct={this.props.updateProduct}
          deleteProduct={this.props.deleteProduct}
          categoryList={this.props.categoryList}
          campaignList={this.props.campaignList.campaigns?.filter(element => element.productid === data.id)}
          // orderList={this.props.orderList.orders}
          // url={this.props.location.search}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.productDetailReducer.loading,
    data: state.productDetailReducer.data,
    error: state.productDetailReducer.err,
    categoryList: state.categoryReducer.data,
    campaignList: state.campaignReducer.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOneProduct: async (id) => {
      await dispatch(action.getOneProduct(id));
      await dispatch(campaignAction.getCampaign());
    },
    updateProduct: async (record) => {
      await dispatch(action.updateProduct(record));
    },
    deleteProduct: async (id) => {
      await dispatch(action.deleteProduct(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
