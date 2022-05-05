import { Button, Form, Input, Modal } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import action from "../modules/action";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
class BusinessConditionUI extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    price: 0,
    productSelected: {},
    loading: false,
    visible: true,
  };
  formRef = React.createRef();


  componentDidMount() {
    this.props.getProfile();

    const { email, ewalletcode, ewalletsecrect } = this.props.data;
    this.setState({
      visible: !(email && ewalletcode && ewalletsecrect),
    })

  }

  onFinish = (data) => {
    this.props.updateBusinessCondition({
      email: data.email,
      ewalletcode: data.ewalletcode,
      ewalletsecret: data.ewalletsecret
    })
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { eWalletValidation, data } = this.props;
    const {
      eWalletChangeMessage,
    } = eWalletValidation;
    const { visible, loading } = this.state;
    const { email, ewalletcode, ewalletsecrect } = data;
    return (
      <>

        <Form
          id="updateBusinessConditionForm"
          ref={this.formRef}
          onFinish={this.onFinish}
          {...formItemLayout}
        >
          <Modal
            visible={visible}
            title="Business Requirement"
            onOk={this.handleOk}
            footer={[
              <Button
                type="primary"
                form="updateBusinessConditionForm"
                key="submit"
                htmlType="submit">
                Update Business Information
              </Button>,
            ]}
          >

            <Form.Item
              name="email"
              label="Business Email"
              initialValue={email}
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
              hasFeedback
            >
              <Input placeholder="1-255 characters" disabled={email} />
            </Form.Item>

            <Form.Item
              name="ewalletcode"
              label="E-Wallet Code"
              rules={[
                {
                  required: true,
                  message: 'Please input your E-wallet code!',
                },
              ]}
              initialValue={ewalletcode ?? ""}

              hasFeedback
            >
              <Input.Password placeholder="1-255 characters" disabled={ewalletcode} />
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
              initialValue={ewalletsecrect || ""}

              hasFeedback

            >
              <Input.Password placeholder="1-255 characters" disabled={ewalletsecrect} />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 6,
              }}
            >
            </Form.Item>

          </Modal>
        </Form>
      </>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    loading: state.authReducer.loading,
    data: state.authReducer.data?.profile ?? {},
    error: state.authReducer.err,
    eWalletValidation: state.profileReducer.eWalletValidation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBusinessCondition: async data => {
      await dispatch(action.updateBusinessCondition(data));
      await dispatch(action.getProfile());

    },

    getProfile: async () => {
      await dispatch(action.getProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessConditionUI);