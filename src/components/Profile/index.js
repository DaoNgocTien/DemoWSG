import React, { Component } from "react";
import { connect } from "react-redux";
import action from "./modules/action";
import ProfileUI from "./views/main-view";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getProfile();
  }

  render() {
    return (
      <ProfileUI
        data={this.props.data}
        loading={this.props.loading}
        getProfile={this.props.getProfile}
        productList={this.props.data.products}
        changePassword={this.props.changePassword}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.profileReducer.loading,
    data: state.profileReducer.data,
    error: state.profileReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: async () => {
      await dispatch(action.getProfile());
    },

    changePassword: async (id, password) => {
      await dispatch(action.changePassword(id, password));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
