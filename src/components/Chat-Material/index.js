// import { StrictMode } from "react";
// import ReactDOM from "react-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import App from "./App";

class ChatMaterial extends Component {
  render() {
    console.log(this.props);
    return <App />;
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.discountCodeReducer.loading,
    data: state.discountCodeReducer.data,
    error: state.discountCodeReducer.err,
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMaterial);
