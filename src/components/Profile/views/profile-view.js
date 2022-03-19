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
  Modal,
  Typography,
  DatePicker,
  Cascader,
  AutoComplete,
  Tooltip,
} from "antd";

import { LoadingOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";
import moment from "moment";

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

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
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
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    price: 0,
    autoCompleteResult: [],
  };
  formRef = React.createRef();

  componentDidMount() {
    this.setState({
      productSelected: this.props.productList[0],
    });
  }

  handleCreateAndClose = (data) => {

    this.props.closeModal();
  };

  handleCreate = (data) => {
    this.props.createProduct(data);
    this.formRef.current.resetFields();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

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
    const { load, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>USER PROFILE</Title>
        <Form
          {...formItemLayout}
          // form={form}
          name="register"
          onFinish={this.onFinish}
          initialValues={{
            residence: ['zhejiang', 'hangzhou', 'xihu'],
            prefix: '86',
          }}
          scrollToFirstError
        >

          <Form.Item
            name="firstname"
            label="Firstname"
            tooltip="What is your firstname?"
            rules={[{ required: true, message: 'Please input your firstname!', whitespace: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastname"
            label="Lastname"
            tooltip="What is your lastname?"
            rules={[{ required: true, message: 'Please input your lastname!', whitespace: true }]}
          >
            <Input />
          </Form.Item>

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
                fileList={
                  this.state.fileList.length === 0 && this.props.record
                    ? JSON.parse(this.props.record?.image)
                    : this.state.fileList
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

          <Form.Item name="avatar" label="Avatar">
            <>
              <Upload
                name="file"
                action="/files/upload"
                listType="picture-card"
                fileList={
                  this.state.fileList.length === 0 && this.props.record
                    ? JSON.parse(this.props.record?.image)
                    : this.state.fileList
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
            name="role"
            label="Role name"
            tooltip="User's role in WSG System"
          >
            <Tooltip placement="topLeft" title="Suppliers are those who use the WSG System and website to process their business. Their main role is to cooperate with the WSG system to do business">
              <Tag color="blue">Role</Tag>
            </Tooltip>

          </Form.Item>

          <Form.Item
            name="loggingMethod"
            label="Logging Method"
            tooltip="User's logging method in WSG System"
          >
            <Tooltip placement="topLeft" title="Logging by username / Logging by Google Mail">
              <Tag color="red">Logging Method</Tag>
            </Tooltip>

          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid username!',
              },
              // {
              //   required: true,
              //   message: 'Please input your username!',
              // },
            ]}

          >
            <Input disabled="true" />
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
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
          // rules={[{ required: true, message: 'Please input Intro' }]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
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
export default memo(ProfileTab, arePropsEqual);
