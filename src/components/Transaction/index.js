import React, { Component } from "react";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import action from "./modules/action";
import TransactionUI from "./views/main-view";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getTransaction();
  }

  render() {
  //  //console.log(this.props.data);
    return (
      <TransactionUI
        data={this.props.data.transactions}
        loading={this.props.loading}
        storeSettlingPaymentList={this.props.storeSettlingPaymentList}
        ordersInTransaction={this.props.data.order}
        productList={this.props.data.products}
        updateTransaction={this.props.updateTransaction}
        createTransaction={this.props.createTransaction}
        deleteTransaction={this.props.deleteTransaction}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.transactionReducer.loading,
    data: state.transactionReducer.data,
    error: state.transactionReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTransaction: async () => {
      // //console.log("get Transaction");
      await dispatch(action.getTransaction());
    },

    // storeSettlingPaymentList: async (list) => {
    //   // //console.log("get Transaction");
    //   await dispatch(action.storeSettlingPaymentList(list));
    // },

    // getOrdersInTransaction: async (TransactionID) => {
    //   // //console.log("getOrdersInTransaction final");
    //   // //console.log(TransactionID);
    // },

    // createTransaction: async (record) => {
    //   // //console.log("createProduct final");
    //   // //console.log(record);
    //   await dispatch(action.createTransaction(record));
    //   await dispatch(action.getTransaction());
    // },

    updateTransaction: async (record) => {
      await dispatch(action.updateTransaction(record));
      await dispatch(action.getTransaction());
    },

    // deleteTransaction: async (id) => {
    //   await dispatch(action.deleteTransaction(id));
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
