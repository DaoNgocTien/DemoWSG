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

class PasswordTab extends Component {
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
  }

  handleUpdateAndClose = (data) => {
    // console.log("Campaign create");
    // console.log(this.state.productSelected);
    console.log(data);
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
    return (
      <>
        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>PASSWORD SETTING</Title>

        <Form
          id="updatePassword"
          ref={this.formRef}
          onFinish={this.handleUpdateAndClose}
          {...formItemLayout}
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
          }}
        >

          {/* <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="1-255 characters" />
          </Form.Item> */}

          <Form.Item
            name="password"
            label="New Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback

          >
            <Input.Password placeholder="1-255 characters" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}

          >
            <Input.Password placeholder="1-255 characters" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Button type="primary" htmlType="submit" form="updatePassword"
              key="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>PHONE NUMBER</Title>

        <Form
          id="updatePhoneNumber"
          ref={this.formRef}
          onFinish={this.handleUpdatePhoneNumberAndClose}
          {...formItemLayout}
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
          }}
        >
          <Form.Item
            name="phone"
            label="Phone Number"
          // initialValue={phone}
          // validateStatus={message === null ? "success" : "error"}
          // help={message === null ? "We make sure phone number is available!" : message}
          >
            <InputNumber
              // disabled={phoneAvailable}
              // onChange={this.changePhoneNumber}
              // ref={this.phoneRef}
              // addonBefore={this.prefixSelector}
              style={{ width: "100%" }}
              placeholder="10-11 characters"
            />

          </Form.Item>

          <Form.Item
            label="OTP"
          // validateStatus={OTPMessage === null ? "success" : "error"}
          // help={OTPMessage === null ? "Correct OTP Token will let you fill the rest of registration form!" : OTPMessage}
          // hidden={phone === null || OTP === null}

          >
            <Input
            // onChange={e => this.checkOTP(e)}
            // ref={this.OTPRef}
            // disable={phoneAvailable}
            />

          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Button
              type="primary"
            //  onClick={this.onCheckPhoneNumber}
            //   disabled={phoneAvailable}
            >
              {/* {phone !== null && OTP !== null ? "Re-sent OTP" : "Send OTP"} */}Submit
            </Button>
          </Form.Item>

        </Form>
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(PasswordTab, arePropsEqual);
