import React, { Component, memo } from "react";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  PageHeader,
  Space,
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Rate,
  Checkbox,
  Avatar,
  Descriptions,
  Tag,
  Statistic,
  Typography,
  DatePicker,
} from "antd";

import { UserOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";
import moment from "moment";

import action from "../modules/action";
import { connect } from "react-redux";

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

class EWalletTab extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
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

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  onChange = (dates, dateStrings) => {
    // console.log("From: ", dates[0], ", to: ", dates[1]);
    // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
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
    // productList: state.productReducer.data,
    // orderList: [],
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
      // console.log("get campaign");
      await dispatch(action.getProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EWalletTab);