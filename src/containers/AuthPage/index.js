import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Typography } from "antd";
import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import { connect } from "react-redux";
import Loader from "./../../components/Loader";
import action from "./modules/action";
import ForgotPassword from "./views/forgot-password";
const { Text } = Typography;
class AuthPage extends Component {
  state = {
    openForgotPasswordModal: false,
  };
  openMessage = () => {
    const key = "updatable";
    message.error({ content: "Can't Access !", key, duration: 2 });
    setTimeout(() => {
      window.history.back();
    }, 1000);
  };

  onFinish = (e) => {
    this.props.login(e, this.props.history);
  };

  renderNoti = () => {
    const { error } = this.props;
    if (error) {
      return <div className="alert alert-danger">{error.response.data}</div>;
    }
  };
  closeModal = () => {
    this.setState({
      openForgotPasswordModal: false,
    });
  };
  openModal = () => {
    this.setState({
      openForgotPasswordModal: true,
    });
  };
  render() {
    const { openForgotPasswordModal } = this.state;

    const { loading, error } = this.props;
    if (loading) return <Loader />;
    if (!localStorage.getItem("user")) {
      return (
        <div className="main_form_body">
          <div className="form__wrapper">
            <div className="form__container">
              <h2 style={{ textAlign: "center" }}>LOGIN</h2>
              <Text type="danger" style={{ textAlign: "center" }}>
                {" "}
                {error}
              </Text>

              <ForgotPassword
                openModal={openForgotPasswordModal}
                closeModal={this.closeModal}
              />
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                // validateStatus={error === null ? "success" : "error"}
                // help={error ?? ""}
              >
                <Form.Item
                  name="username"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please enter your new phone',
                    // },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          (value + "").length > 50 ||
                          (value + "").length < 1
                        ) {
                          return Promise.reject(
                            new Error(`Username is between 1-50 characters!`)
                          );
                        }
                        // if (error) {
                        //   return Promise.reject(new Error(`Username or password is not correct!`));
                        // }
                        // if (!value || !checkPhoneMessage) {
                        return Promise.resolve();
                        // }

                        // return Promise.reject(new Error(`${checkPhoneMessage}`));
                      },
                    }),
                    // {
                    //   pattern: /[0-9]{10,11}/,
                    //   message: 'Phone number is between 10-12 characters',
                    // }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username is between 1-50 characters"
                    // onChange={this.props.onLogin}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please enter your new phone',
                    // },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          (value + "").length > 50 ||
                          (value + "").length < 1
                        ) {
                          return Promise.reject(
                            new Error(`Password is between 1-50 characters!`)
                          );
                        }
                        // if (error) {
                        //   return Promise.reject(new Error(`Username or password is not correct!`));
                        // }
                        // if (!value || !checkPhoneMessage) {
                        return Promise.resolve();
                        // }

                        // return Promise.reject(new Error(`${checkPhoneMessage}`));
                      },
                    }),
                    // {
                    //   pattern: /[0-9]{10,11}/,
                    //   message: 'Phone number is between 10-12 characters',
                    // }
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password is between 1-50 characters!"
                    // onChange={this.props.onLogin}
                  />
                </Form.Item>
                <Form.Item>
                  <a
                    className="login-form-forgot"
                    href="/#"
                    style={{ float: "right" }}
                  >
                    Forgot password
                  </a>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Log in
                  </Button>
                </Form.Item>
                <GoogleLogin
                  clientId="641513059325-n3suicaa1j3fsph5fqaft0okgh57gv2l.apps.googleusercontent.com"
                  buttonText="Sign in with Google"
                  onSuccess={this.props.googleOAuth2}
                  onFailure={this.props.googleOAuth2}
                  cookiePolicy={"single_host_origin"}
                  className="google-button"
                />
                <br />
                <a href="/registration" style={{ float: "right" }}>
                  Register now!
                </a>
              </Form>
            </div>
          </div>
        </div>
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
      dispatch(action.actLoginApi(user, history));
    },
    googleOAuth2: (googleResponse) => {
      dispatch(action.googleOAuth2(googleResponse));
    },
    onLogin: () => {
      dispatch(action.onLogin());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
