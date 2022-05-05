import React, { Component } from "react";
import { connect } from "react-redux";
import { default as productAction } from "../Product/modules/action";
import action from "./modules/action";
import CategoryUI from "./views/main-view";

class CategoryPage extends Component {
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
    this.props.getAllCategory();
  }

  render() {
    return (
      <>
        <CategoryUI
          data={this.props.data}
          loading={this.props.loading}
          createCategory={this.props.createCategory}
          updateCategory={this.props.updateCategory}
          deleteCategory={this.props.deleteCategory}
          productList={this.props.productList}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.categoryReducer.loading,
    data: state.categoryReducer.data,
    error: state.categoryReducer.err,
    productList: state.productReducer.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCategory: async () => {
      await dispatch(action.getAllCategory());
      await dispatch(productAction.getAllProduct());
    },
    createCategory: async (record) => {
      await dispatch(action.createCategory(record));
      await dispatch(action.getAllCategory());
    },
    updateCategory: async (record) => {
      await dispatch(action.updateCategory(record));
      await dispatch(action.getAllCategory());
    },
    deleteCategory: async (id) => {
      await dispatch(action.deleteCategory(id));
      await dispatch(action.getAllCategory());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);

