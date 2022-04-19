import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "./../../../components/Loader";
import action from "./../modules/action";

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

const propsProTypes = {
  closeModal: PropTypes.func,
  createCampaign: PropTypes.func,
  openModal: PropTypes.bool,
  productList: PropTypes.array,
};

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
    fileList: undefined,
    price: 0,
    autoCompleteResult: [],
  };
  formRef = React.createRef();

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

  onFinish = (values) => {
    console.log(values);
    values.avatar =
      this.state.fileList?.length === 0 && this.props.record
        ? JSON.parse(this.props.record?.avt)
        : this.state.fileList;
    this.setState({
      user: {
        phone: this.props.data.phone,
        avatar: values.avatar,
        name: values.name,
        email: values.email,
        address: values.address,
      },
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

  handleChange = ({ fileList }) => {
    console.log(fileList);
    this.props.onChangeUpdateProfile();
    console.log(fileList);
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
    const { load, fileList = JSON.parse(data?.avt || "[]") } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    let storedUser = data;
    console.log(this.props);
    return (
      <>
        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>
          USER PROFILE
        </Title>
        <Title type="success" style={{ textAlign: "center", }} level={3}> {changeProfileMessage ? `${changeProfileMessage}` : ""}</Title>

        <Form
          {...formItemLayout}
          name="register"
          onFinish={this.onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Username"
            tooltip="Username can not be channged!"
          >
            <Tag color="green">{data.username ?? "Unavailable"}</Tag>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role name"
            tooltip="User's role in WSG System"
          >
            <Tooltip
              placement="topLeft"
              title="Suppliers are those who use the WSG System and website to process their business. Their main role is to cooperate with the WSG system to do business"
            >
              <Tag color="blue">{data.rolename ?? ""}</Tag>
            </Tooltip>
          </Form.Item>

          <Form.Item
            name="loggingMethod"
            label="Logging Method"
            tooltip="User's logging method in WSG System"
          >
            <Tooltip
              placement="topLeft"
              title="Logging by username / Logging by Google Mail"
            >
              <Tag color="red">
                {data.username ? "BY USERNAME" : "BY EMAIL"}
              </Tag>
            </Tooltip>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
          // tooltip="User's logging method in WSG System"
          >
            <Tooltip
              placement="topLeft"
              title="Logging by username / Logging by Google Mail"
            >
              <Tag color="green">
                {this.state.user.phone}
              </Tag>
            </Tooltip>
          </Form.Item>

          <Form.Item
            name="name"
            label="Fullname"
            tooltip="What is your fullname?"
            rules={[
              {
                required: true,
                message: "Please input your fullname!",
                whitespace: true,
              },
              {
                max: 50,
                message: "Length: 1-50 characters",
                whitespace: true,
              }
            ]}
            initialValue={data.name}
          >
            <Input onChange={this.props.onChangeUpdateProfile}/>
          </Form.Item>

          <Form.Item name="avatar" label="Avatar">
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

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
            initialValue={data.email}
          >
            <Input onChange={this.props.onChangeUpdateProfile}/>
          </Form.Item>

          <Form.Item name="address" label="Address" initialValue={data.address}>
            <Input.TextArea showCount maxLength={100} onChange={this.props.onChangeUpdateProfile}/>
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
    changeProfileMessage: state.profileReducer.phoneValidation.changeProfileMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: async () => {
      await dispatch(action.getProfile());
    },

    checkPhoneNumber: async (phone) => {
      await dispatch(action.checkPhoneNumber(phone));
    },

    updateProfile: async (profile) => {
      await dispatch(action.updateProfile(profile));
      await dispatch(action.getProfile());
    },

    onChangeUpdateProfile: async () => {
      await dispatch(action.onChangeUpdateProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileTab);
