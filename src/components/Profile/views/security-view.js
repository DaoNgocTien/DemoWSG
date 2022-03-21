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
  Modal,
} from "antd";

import { LoadingOutlined, PlusOutlined, UserOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";
import moment from "moment";
import action from "../modules/action";
import { connect } from "react-redux";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { uuid } = require('uuidv4');
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
    user: null,
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    price: 0,
    productSelected: {},
    phoneAvailable: true,
    OTPMessage: null,
  };
  formRef = React.createRef();
  phoneRef = React.createRef();
  OTPRef = React.createRef();


  componentDidMount() {
    this.props.getProfile();
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

  changePassword = (values) => {
    let password = values.password;
    let user = JSON.parse(localStorage.getItem("user"));
    this.props.changePassword(user.id, password);
  }

  updatePhone = (values) => {
    console.log(values);
    let phone = this.phoneRef.current.value;
    this.props.checkPhoneNumber(phone);
  }

  checkOTP = e => {
    const value = e.target.value;

    if (value === this.props.phoneValidation.phoneOTP && this.phoneRef.current.value === this.props.phoneValidation.phone) {
      this.setState({
        phoneAvailable: true,
        OTPMessage: null,
      });
      let data = this.props.data;
      const user = {
        phone: this.phoneRef.current.value,
        avatar: data.avt,
        name: data.name,
        email: data.email,
        address: data.address,

      }
      this.props.updateProfile(user);
    }
    else {
      this.setState({
        phoneAvailable: false,
        OTPMessage: "OTP token is not correct!",
      });
    }
  }

  updateIdentifcation = (values) => {
    console.log(values);

    values.identificationimage =
      this.state.fileList.length === 0 && this.props.record
        ? JSON.parse(this.props.record?.image)
        : this.state.fileList;
    this.props.updateIdentifcation(values);
  }

  render() {
    const { load, imageUrl, phoneAvailable, OTPMessage } = this.state;
    const { data, phoneValidation, identificationValidation } = this.props;
    const {
      checkPhoneMessage,
      phone,
      phoneOTP,
      changePhoneMessage,
    } = phoneValidation;
    const {
      identificationChangeMessage,
    } = identificationValidation;
    const {
      changePasswordMessage,
    } = data;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    console.log(data);
    return (
      <>
        <Title style={{ textAlign: "center", marginTop: "30px" }} level={3}>MANAGE PASSWORD</Title>
        <Title type="success" style={{ textAlign: "center", }} level={3}> {changePasswordMessage ? `${changePasswordMessage}` : ""}</Title>

        <Form
          id="updatePassword"
          ref={this.formRef}
          onFinish={this.changePassword}
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

        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>MANAGE PHONE NUMBER</Title>
        <Title type="success" style={{ textAlign: "center", }} level={3}> {changePhoneMessage ? `${changePhoneMessage}` : ""}</Title>

        <Form
          // key={uuid()}
          id="updatePhoneNumber"
          ref={this.formRef}
          onFinish={this.updatePhone}
          {...formItemLayout}
        >
          <Form.Item label="Phone Number">
            <Row >
              <Col flex={4}>
                <Form.Item
                  name="phone"
                  // label="Phone Number"
                  hasFeedback
                  tooltip={"We make sure phone number is available!"}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your new phone',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !checkPhoneMessage) {
                          return Promise.resolve();
                        }
                        if (value.length > 11 || value.length < 10) {
                          return Promise.reject(new Error(`Phone number is between 10-11 characters`));
                        }
                        return Promise.reject(new Error(`${checkPhoneMessage}`));
                      },
                    }),
                    {
                      pattern: /[0-9]{10,11}/,
                      message: 'Phone number is between 10-11 characters',
                    }
                  ]}
                // initialValue={phone}
                // validateStatus={message === null ? "success" : "error"}
                // help={message === null ? "We make sure phone number is available!" : message}
                >
                  <InputNumber
                    // disabled={data.phoneOTP?? "false"}
                    // onChange={this.onChangePhoneNumber}
                    ref={this.phoneRef}
                    // addonBefore={this.prefixSelector}
                    style={{ width: "100%" }}
                    placeholder="10-11 characters"
                  />

                </Form.Item>
              </Col>
              <Col flex={1}></Col>
              <Col flex={2}>
                <Button
                  type="primary"
                  form="updatePhoneNumber"
                  onClick={this.updatePhone}
                //   disabled={phoneAvailable}
                >
                  Send OTP
                </Button>
              </Col>
            </Row>

          </Form.Item>

          <Form.Item
            label="OTP"
            validateStatus={OTPMessage === null ? "success" : "error"}
            help={OTPMessage === null ? "Correct OTP Token will let you fill the rest of registration form!" : OTPMessage}
          // hidden={phoneOTP ? "false" : "true"}
          >
            <Input
              onChange={e => this.checkOTP(e)}
              ref={this.OTPRef}
              disable={phoneAvailable ?? "true"}
            />

          </Form.Item>
          {/* 
          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            
          </Form.Item> */}

        </Form>

        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>MANAGE IDENTIFICATION CARD</Title>
        <Title type="success" style={{ textAlign: "center", }} level={3}> {identificationChangeMessage ? `${identificationChangeMessage}` : ""}</Title>

        <Form
          id="updateIdentifcation"
          ref={this.formRef}
          onFinish={this.updateIdentifcation}
          {...formItemLayout}
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
          }}
        >
          <Form.Item
            name="identificationcard"
            label="Identification Card"
            rules={[{ required: true, message: 'Please input your Identification Card!' }]}
          >
            <Input type="number" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="identificationimage"
            label="Identification Image"
            rules={[{ required: true, message: 'Please input your Identification Image!' }]}
          >
            <>
              <Upload
                name="file"
                action="/files/upload"
                listType="picture-card"
                // fileList={
                //   this.state.fileList.length === 0 && data
                //     ? JSON.parse(data.avt)
                //     : this.state.fileList
                // }
                fileList={this.state.fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                style={{ width: "60vh" }}
              >
                {this.state.fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal
                visible={this.state.previewVisible}
                title={this.state.previewTitle}
                footer={null}
                onCancel={this.handleCancelUploadImage}
              >
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={this.state.previewImage}
                />
              </Modal>
            </>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Button
              type="primary"
              form="updateIdentifcation"
              key="submit"
              htmlType="submit"
            >
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
    phoneValidation: state.profileReducer.phoneValidation,
    identificationValidation: state.profileReducer.identificationValidation,
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

    getProfile: async () => {
      // console.log("get campaign");
      await dispatch(action.getProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordTab);
