import React, { Component } from "react";
import { actLoginApi } from "./modules/action";
import { connect } from "react-redux";
import Loader from "./../../components/Loader";
import { Input, message } from "antd";

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  openMessage = () => {
    const key = "updatable";
    message.error({ content: "Can't Access !", key, duration: 2 });
    setTimeout(() => {
      window.history.back();
    }, 1000);
  };

  handleOnChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleLogin = (e) => {
    console.log(this.state);
    e.preventDefault();
    this.props.login(this.state, this.props.history);
  };

  renderNoti = () => {
    const { error } = this.props;
    if (error) {
      return <div className="alert alert-danger">{error.response.data}</div>;
    }
  };

  render() {
    const { loading } = this.props;
    if (loading) return <Loader />;
    if (localStorage.getItem("User") || localStorage.getItem("UserAdmin")) {
      this.openMessage();
    } else {
      return (
        // <div className="bg-gradient-primary">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-9">
              <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div class="col-lg-6 center-item my-primary-color">
                      <h1
                        style={{
                          fontFamily: "Montserrat",
                          fontStyle: "italic",
                          fontWeight: "900",
                          fontSize: "36px",
                        }}
                        className="my-grandient-text"
                      >
                        CosmeSis
                      </h1>
                    </div>

                    <div className="col-lg-6">
                      <div className="p-5">
                        <div className="text-center">
                          <h1 className="h4 text-gray-900 mb-4">
                            Welcome CosmeSis!
                          </h1>
                        </div>
                        <form className="user" onSubmit={this.handleLogin}>
                          <div className="form-group">
                            <Input
                              type="text"
                              className="form-control form-control-user"
                              id="exampleInputEmail"
                              aria-describedby="emailHelp"
                              placeholder="Enter Email Address..."
                              name="username"
                              onChange={this.handleOnChange}
                            />
                          </div>
                          <div className="form-group">
                            <Input
                              type="password"
                              className="form-control form-control-user"
                              id="exampleInputPassword"
                              placeholder="Password"
                              name="password"
                              onChange={this.handleOnChange}
                            />
                          </div>
                          <div className="form-group">
                            <div className="custom-control custom-checkbox small">
                              <Input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck"
                                name="checkbox"
                              />
                              <label
                                className="custom-control-label"
                                for="customCheck"
                              >
                                Remember Me
                              </label>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-user btn-block"
                            style={{
                              backgroundColor: "rgba(123, 120, 242, 1)",
                            }}
                          >
                            Login
                          </button>
                          {/* <hr />
                            <a
                              href="#"
                              className="btn btn-facebook btn-user btn-block"
                            >
                              <i className="fab fa-facebook-f fa-fw"></i> Login
                              with Facebook
                            </a> */}
                        </form>
                        <hr />
                        <div className="text-center">
                          <a className="small" href="forgot-password.html">
                            Forgot Password?
                          </a>
                        </div>
                        <div className="text-center"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        // </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.authReducer.loading,
    error: state.authReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user, history) => {
      dispatch(actLoginApi(user, history));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
