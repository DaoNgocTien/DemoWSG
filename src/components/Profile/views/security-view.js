import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Col, Form, Input, Modal, Row, Typography, Upload
} from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import action from "../modules/action";
import Loader from "./../../../components/Loader";

const { Title } = Typography;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14,
  },
};

class PasswordTab extends Component {
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
    this.props.closeModal();
  };

  changePassword = (values) => {
    let password = values.password;
    let user = JSON.parse(localStorage.getItem("user"));
    this.props.changePassword(user.id, password);
  }

  onChangePhoneNumber = e => {
    const phone = e.target.value;
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
    let phone = this.state.phone;
    this.props.checkPhoneNumber(phone);
  }

  checkOTP = e => {
    const value = e.target.value;
    if (value === this.props.phoneValidation.phoneOTP && this.state.phone === this.props.phoneValidation.phone) {
      this.setState({
        phoneAvailable: true,
        OTPMessage: null,
      });
      let data = this.props.data;
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
                  hasFeedback
                  tooltip={"We make sure phone number is available!"}
                  
                  initialValue={this.state.phone}
                  validateStatus={checkPhoneMessage == null ? "success" : "error"}
                  help={checkPhoneMessage == null ? "We make sure phone number is available!" : checkPhoneMessage}
                >
                  <Input
                    type="number"
                    addonBefore="+84"
                    onChange={(e) => this.onChangePhoneNumber(e)}
                    ref={this.phoneRef}
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
         
          >
            <Input
              onChange={e => this.checkOTP(e)}
              ref={this.OTPRef}
              disable={phoneAvailable ? "true" : "false"}
            />

          </Form.Item>

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
      await dispatch(action.getProfile());
    },
    checkingPhoneNumber: async (message) => {
      await dispatch(action.checkingPhoneNumber(message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordTab);
