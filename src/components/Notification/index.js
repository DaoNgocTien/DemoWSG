import React, { Component } from "react";
// import {default as productAction} from "../Product/modules/action";
import { connect } from "react-redux";
import action from "./modules/action";
import NotificationUI from "./views/main-view";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }

  render() {
    return (
      <NotificationUI
        data={this.props.data.campaigns}
        loading={this.props.loading}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.campaignReducer.loading,
    data: state.campaignReducer.data,
    error: state.campaignReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
