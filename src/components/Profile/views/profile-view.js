import React, { Component } from "react";
import {
  Button,
  Input,
  Form,
  Select,
  Upload,
  Tag,
  Modal,
  Typography,
  DatePicker,
  Tooltip,
} from "antd";

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";

import action from "./../modules/action";
import { connect } from "react-redux";
import Loader from "./../../../components/Loader";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  createCampaign: PropTypes.func,
  openModal: PropTypes.bool,
  productList: PropTypes.array,
};

//  default props
const propsDefault = {
  closeModal: () => { },
  createCampaign: () => { },
  openModal: false,
  productList: [],
};

class ProfileTab extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    user: {
      username: "",
      googleId: "",
      loginMethod: "",
      rolename: "",
      phone: "",
    },
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    price: 0,
    autoCompleteResult: [],
  };
  formRef = React.createRef();

  componentDidMount() {
    this.props.getProfile();
    let storedUser = JSON.parse(localStorage.getItem("user"));
    this.setState({
      user: {
        username: storedUser.username,
        googleId: storedUser.googleid,
        loginMethod: storedUser.googleid ? "BY GOOGLE MAIL" : "BY USERNAME",
        phone: storedUser.phone,
        ...this.props.data
      }
    });
  }

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  onFinish = (values) => {
    values.avatar =
      this.state.fileList.length === 0 && this.props.record
        ? JSON.parse(this.props.record?.image)
        : this.state.fileList;
    this.setState({
      user: {
        phone: "035497658",
        avatar: values.avatar,
        name: values.name,
        email: values.email,
        address: values.address,
      }
    });
    this.props.updateProfile(this.state.user);
  };


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

  handleChange = ({ fileList, file, event }) => {
    // fileList = fileList.slice(-2);
    // console.log(fileList);
    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response[0].url;
        file.name = file.response[0].name;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };

  render() {
    const { loading } = this.props;
    if (loading) return <Loader />;

    const { load, imageUrl, user } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    const { data } = this.props;
    let storedUser = data
    console.log(data);
    return (
      <>
        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>USER PROFILE</Title>
        <Form
          {...formItemLayout}
          // form={form}
          name="register"
          onFinish={this.onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Username"
            tooltip="Username can not be channged!"

          >
            <Tag color="green">{storedUser.username ?? storedUser.username}</Tag>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role name"
            tooltip="User's role in WSG System"
          >
            <Tooltip placement="topLeft" title="Suppliers are those who use the WSG System and website to process their business. Their main role is to cooperate with the WSG system to do business">
              <Tag color="blue">{storedUser.rolename ?? storedUser.rolename}</Tag>
            </Tooltip>

          </Form.Item>

          <Form.Item
            name="loggingMethod"
            label="Logging Method"
            tooltip="User's logging method in WSG System"
          >
            <Tooltip placement="topLeft" title="Logging by username / Logging by Google Mail">
              <Tag color="red">{storedUser.username ? "BY USERNAME" : "BY EMAIL"}</Tag>
            </Tooltip>

          </Form.Item>

          <Form.Item
            name="name"
            label="Fullname"
            tooltip="What is your fullname?"
            rules={[{ required: true, message: 'Please input your fullname!', whitespace: true }]}
            initialValue={data.name}
          >
            <Input />
          </Form.Item>

          <Form.Item name="avatar" label="Avatar">
            <>
              <Upload
                name="file"
                action="/files/upload"
                listType="picture-card"
                fileList={
                  this.state.fileList.length === 0 && data.avt
                    ? JSON.parse(data.avt) :
                    this.state.fileList
                }
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
            name="email"
            label="E-mail"
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
            initialValue={data.email}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            initialValue={data.address}
          // rules={[{ required: true, message: 'Please input Intro' }]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Update Profile
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
    // productList: state.productReducer.data,
    // orderList: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: async () => {
      // console.log("get campaign");
      await dispatch(action.getProfile());
    },

    checkPhoneNumber: async phone => {
      await dispatch(action.checkPhoneNumber(phone));
    },

    updateProfile: async profile => {
      await dispatch(action.updateProfile(profile));
      // await dispatch(action.getProfile());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileTab);

