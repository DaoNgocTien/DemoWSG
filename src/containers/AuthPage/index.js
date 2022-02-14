import React, { Component } from "react";
import { actLoginApi, googleOAuth2 } from "./modules/action";
import { connect } from "react-redux";
import Loader from "./../../components/Loader";
import { Input, message, Form, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

class AuthPage extends Component {
  openMessage = () => {
    const key = "updatable";
    message.error({ content: "Can't Access !", key, duration: 2 });
    setTimeout(() => {
      window.history.back();
    }, 1000);
  };

  onFinish = (e) => {
    // console.log(e);
    this.props.login(e, this.props.history);
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
    if (localStorage.getItem("user")) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="main_form_body">
          <div className="form__wrapper">
            <div className="form__container">
              <h2 style={{ textAlign: "center" }}>LOGIN</h2>
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your Username!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                  />
                </Form.Item>
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
                <a href="/#" style={{ float: "right" }}>
                  register now!
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
      dispatch(actLoginApi(user, history));
    },
    googleOAuth2: (googleResponse) => {
      dispatch(googleOAuth2(googleResponse));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
