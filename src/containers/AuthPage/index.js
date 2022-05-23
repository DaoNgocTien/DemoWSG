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
          <h2>Welcome back!</h2>
          <p className="create_account_title">Do not have an account yet?
            <a href="/registration" className="create_account_navigation">Create account</a>
          </p>
          <div className="form__wrapper">
            <div className="form__container">
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
              >
                <p className="form-item-title">
                  Username <p className="red_asterik">*</p>
                </p>
                <Form.Item

                  name="username"
                  rules={[
                    { required: true, message: "Please input your Username!" },
                  ]}
                >
                  <Input
                    className="form-item-input"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                  />
                </Form.Item>
                <p className="form-item-title">
                  Password <p className="red_asterik">*</p>
                </p>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <a
                    style={{
                      textDecoration: "none",
                      float: "right" 
                    }}
                    className="login-form-forgot"
                    href="/#"
                  >
                    <p className="forgot-password">Forgot Password ?</p>
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
                {/* <GoogleLogin
                  clientId="641513059325-n3suicaa1j3fsph5fqaft0okgh57gv2l.apps.googleusercontent.com"
                  buttonText="Sign in with Google"
                  onSuccess={this.props.googleOAuth2}
                  onFailure={this.props.googleOAuth2}
                  cookiePolicy={"single_host_origin"}
                  className="google-button"
                /> */}
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
    // googleOAuth2: (googleResponse) => {
    //   dispatch(action.googleOAuth2(googleResponse));
    // },
    onLogin: () => {
      dispatch(action.onLogin());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
