import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "../../components/Loader";
import { default as campaignAction } from "../Campaign/modules/action";
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
          campaignList={this.props.campaignList.campaigns?.filter(
            (element) => element.productid === data.id
          )}
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
