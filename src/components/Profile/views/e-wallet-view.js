import {
  Button, Form, Input, Typography} from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import action from "../modules/action";

const { Title } = Typography;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class EWalletTab extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    price: 0,
    productSelected: {},
  };
  formRef = React.createRef();


  componentDidMount() {
    this.props.getProfile();
  }

  onFinish = (data) => {
    this.props.updateEWallet({
      ewalletcode: data.ewalletcode,
      ewalletsecret: data.ewalletsecret
    })
  };

  render() {
    const { eWalletValidation } = this.props;
    const {
      eWalletChangeMessage,
    } = eWalletValidation;
    return (
      <>
        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>E-WALLET ACCOUNT</Title>
        <Title type="success" style={{ textAlign: "center", }} level={3}> {eWalletChangeMessage ? `${eWalletChangeMessage}` : ""}</Title>


        <Form
          id="updateEWalletAccount"
          ref={this.formRef}
          onFinish={this.onFinish}
          {...formItemLayout}
        >

          <Form.Item
            name="ewalletcode"
            label="E-Wallet Code"
            rules={[
              {
                required: true,
                message: 'Please input your E-wallet code!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="1-255 characters" />
          </Form.Item>

          <Form.Item
            name="ewalletsecret"
            label="E-Wallet Secret"
            rules={[
              {
                required: true,
                message: 'Please input your E-wallet secret!',
              },
            ]}
            hasFeedback

          >
            <Input.Password placeholder="1-255 characters" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Button type="primary" htmlType="submit" form="updateEWalletAccount"
              key="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    loading: state.profileReducer.loading,
    data: state.profileReducer.data,
    error: state.profileReducer.err,
    eWalletValidation: state.profileReducer.eWalletValidation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: async (id, password) => {
      await dispatch(action.changePassword(id, password));
    },

    checkPhoneNumber: async phone => {
      await dispatch(action.checkPhoneNumber(phone));
    },

    updateProfile: async profile => {
      await dispatch(action.updateProfile(profile));
      await dispatch(action.getProfile());

    },

    updateIdentifcation: async card => {
      await dispatch(action.updateIdentifcation(card));
      await dispatch(action.getProfile());

    },

    updateEWallet: async card => {
      await dispatch(action.updateEWallet(card));
      await dispatch(action.getProfile());

    },

    getProfile: async () => {
      await dispatch(action.getProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EWalletTab);