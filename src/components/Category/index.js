import React, { Component } from "react";
import action from "./modules/action";
import { connect } from "react-redux";
import CategoryUI from "./views/main-view";

class categoryPage extends Component {
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
    this.props.getCategory();
  }

  render() {
    return (
      <>
        <CategoryUI
          data={this.props.data}
          createCategory={this.props.createCategory}
          updateCategory={this.props.updateCategory}
          deleteCategory={this.props.deleteCategory}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCategory: async () => await dispatch(action.getCategory()),
    createCategory: async (record) => {
      alert("createCategory final");
      console.log(record);
      await dispatch(action.createCategory(record));
      await dispatch(action.getCategory());
    },
    updateCategory: async (record) => {
      alert("updateCategory final");
      await dispatch(action.updateCategory(record));
      await dispatch(action.getCategory());
    },
    deleteCategory: async (id) => {
      alert("deleteCategory final" + id);
      await dispatch(action.deleteCategory(id));
      await dispatch(action.getCategory());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(categoryPage);

