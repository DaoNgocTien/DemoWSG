import { InboxOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import {
  Modal, Button, Checkbox, Col, DatePicker, Descriptions, Form, Input, InputNumber, PageHeader, Radio, Rate, Row, Select, Slider, Space, Statistic, Switch, Table, Tag, Typography, Upload
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { connect } from "react-redux";
import action from "../modules/action";



const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
//  prototype
const propsProTypes = {
  createCampaign: PropTypes.func,
};

//  default props
const propsDefault = {
  createCampaign: () => { },
};

class BusinessConditionUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
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
  //  //console.log(data);
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

  handleOk = () => {
    // this.setState({ loading: true });
    // setTimeout(() => {
    //   this.setState({ loading: false, visible: false });
    // }, 3000);

  //  //console.log("handleOk");
  };

  handleCancel = () => {
  //  //console.log("handleCancel");
    // this.setState({ visible: false });
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
            // onCancel={this.handleCancel}
            footer={[
              // <Button key="back" onClick={this.handleCancel}>
              //   Return
              // </Button>,
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
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: async (id, password) => {
      // await dispatch(action.changePassword(id, password));
    },

    checkPhoneNumber: async phone => {
      // await dispatch(action.checkPhoneNumber(phone));
    },

    updateProfile: async profile => {
      // await dispatch(action.updateProfile(profile));
      // await dispatch(action.getProfile());

    },

    updateIdentifcation: async card => {
      // await dispatch(action.updateIdentifcation(card));
      // await dispatch(action.getProfile());

    },


    updateBusinessCondition: async data => {
      await dispatch(action.updateBusinessCondition(data));
      await dispatch(action.getProfile());

    },


    getProfile: async () => {
      // //console.log("get campaign");
      await dispatch(action.getProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessConditionUI);