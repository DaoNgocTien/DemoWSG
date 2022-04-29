import { InboxOutlined, LoadingOutlined, PlusOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar, Button, Checkbox, Col, DatePicker, Descriptions, Form, Input, InputNumber, Modal, PageHeader, Radio, Rate, Row, Select, Slider, Space, Statistic, Switch, Table, Tag, Typography, Upload
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { connect } from "react-redux";
import action from "../modules/action";
import Loader from "./../../../components/Loader";


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
    fileList: undefined,
    price: 0,
    productSelected: {},
    phoneAvailable: true,
    OTPMessage: null,
    phone: 0,
    phoneMessage: "",
  };
  formRef = React.createRef();
  phoneRef = React.createRef();
  OTPRef = React.createRef();


  componentDidMount() {
    this.props.getProfile();
    let storedUser = JSON.parse(localStorage.getItem("user"));
    this.setState({
      user: storedUser,
    });
  }

  handleCancel = () => {
//   this.formRef.current.resetFields();
    this.props.closeModal();
  };

  changePassword = (values) => {
    let password = values.password;
    let user = JSON.parse(localStorage.getItem("user"));
    this.props.changePassword(user.id, password);
  }

  onChangePhoneNumber = e => {
    const phone = e.target.value;
    // const checkPhoneMessage = this.props.phoneValidation.checkPhoneMessage;
    // // //console.log(phone);
    // // //console.log(this.props.phoneValidation.checkPhoneMessage);

    // if (phone.length > 11 || phone.length < 10) {
    //   return this.setState({
    //     phoneMessage: "Phone is required, 10-11 numbers!!",
    //   })
    // }
    // if (checkPhoneMessage?.length > 0) {
    //   return this.setState({
    //     phoneMessage: checkPhoneMessage,
    //   })
    // }
    if (phone.length > 11 || phone.length < 10) {
      return this.props.checkingPhoneNumber("Phone is required, 10-11 numbers!!");
    }
    this.setState({
      phone: e.target.value,
      phoneMessage: "",
    })
    this.props.checkingPhoneNumber(null);
  }

  updatePhone = (values) => {
    // //console.log(values.target.value);
    let phone = this.state.phone;
    // //console.log(phone);
    this.props.checkPhoneNumber(phone);
  }

  checkOTP = e => {
    const value = e.target.value;
    //  //console.log(JSON.parse(localStorage.getItem("user")));
    if (value === this.props.phoneValidation.phoneOTP && this.state.phone === this.props.phoneValidation.phone) {
      this.setState({
        phoneAvailable: true,
        OTPMessage: null,
      });
      let data = this.props.data;
      //console.log(this.props.data);
      const user = {
        phone:  "0" + String(this.state.phone),
        avatar: JSON.parse(data.avt),
        name: data.name,
        email: data.email,
        address: data.address,

      }
      this.props.updateProfile(user);
      data = {
        phone: this.state.phone,
        ...data
      }
      localStorage.setItem("user", JSON.stringify(data));
    }
    else {
      this.setState({
        phoneAvailable: false,
        OTPMessage: "OTP token is not correct!",
      });
    }
  }

  updateIdentifcation = (values) => {
    // //console.log(values);

    values.identificationimage =
      this.state.fileList.length === 0 && this.props.record
        ? JSON.parse(this.props.record?.image)
        : this.state.fileList;
    this.props.updateIdentifcation(values);
  }


  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleCancelUploadImage = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = ({ fileList }) => {
    //console.log(fileList);
    // this.props.onChangeUpdateProfile();
    //console.log(fileList);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response[0].url;
        file.name = file.response[0].name;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };


  render() {
    const { loading, changeProfileMessage } = this.props;
    if (loading) return <Loader />;

    const { data } = this.props;
    const { load, fileList = JSON.parse(data?.identificationimage || "[]") } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    const { imageUrl, phoneAvailable, OTPMessage, phoneMessage } = this.state;
    const { phoneValidation, identificationValidation } = this.props;
    const {
      checkPhoneMessage = "",
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
    // //console.log(checkPhoneMessage);
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
                  // rules={[
                  //   // {
                  //   //   required: true,
                  //   //   message: 'Please enter your new phone',
                  //   // },
                  //   ({ getFieldValue }) => ({
                  //     validator(_, value) {
                  //       if ((value + "").length > 11 || (value + "").length < 10) {
                  //         return Promise.reject(new Error(`Phone number is between 10-11 characters`));
                  //       }
                  //       // if (getFieldValue("phoneMessage").length > 0) {
                  //       //   return Promise.reject(new Error(`${getFieldValue("phoneMessage")}`));
                  //       // }
                  //       // //console.log(phoneValidation);
                  //       if (value && !checkPhoneMessage) {
                  //         return Promise.resolve();
                  //       }
                  //       return Promise.reject(new Error(`${checkPhoneMessage}`));

                  //     },
                  //   }),
                  //   // {
                  //   //   pattern: /[0-9]{10,11}/,
                  //   //   message: 'Phone number is between 10-12 characters',
                  //   // }
                  // ]}

                  initialValue={this.state.phone}
                  validateStatus={checkPhoneMessage == null ? "success" : "error"}
                  help={checkPhoneMessage == null ? "We make sure phone number is available!" : checkPhoneMessage}
                >
                  <Input
                    type="number"
                    addonBefore="+84"
                    // disabled={data.phoneOTP?? "false"}
                    onChange={(e) => this.onChangePhoneNumber(e)}
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
              disable={phoneAvailable ? "true" : "false"}
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
            rules={[
              {
                required: true,
                message: "Please input your Identification Card!",
                whitespace: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {

                  if (String(value).length >= 1 && String(value).length <= 20) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Identification Number is 1-20 characters"
                    )
                  );
                },
              }),
            ]}
            initialValue={data.identificationcard}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="identificationimage"
            label="Identification Image"
            rules={[
              // {
              //   required: true,
              //   message: 'Please confirm your password!',
              // },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (fileList.length >= 1) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Image required!!"));
                },
              }),
            ]}
          >
            <>
              <Upload
                //JSON.parse(data?.avt || "[]")
                name="file"
                action="/files/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                style={{ width: "60vh" }}
              >
                {fileList.length >= 1 ? null : uploadButton}
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


          {/* <Form.Item
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
                fileList={this.props.record ? fileList : []}
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
          </Form.Item> */}
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
      await dispatch(action.getProfile());
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
      // // //console.log("get campaign");
      await dispatch(action.getProfile());
    },
    checkingPhoneNumber: async (message) => {
      // // //console.log("get campaign");
      await dispatch(action.checkingPhoneNumber(message));
      // await dispatch(action.getProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordTab);
