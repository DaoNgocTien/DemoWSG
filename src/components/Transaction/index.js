import React, { Component } from "react";
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
    if (this.props.loading) return <></>;
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
      await dispatch(action.getTransaction());
    },
    updateTransaction: async (record) => {
      await dispatch(action.updateTransaction(record));
      await dispatch(action.getTransaction());
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
