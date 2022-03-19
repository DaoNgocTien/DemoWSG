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
  }

  handleAddingAndClose = (data) => {
    console.log(data);
    this.props.closeModal();
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
        <Title style={{ textAlign: "center", padding: "30px"  }} level={3}>E-WALLET ACCOUNT</Title>
        <Form
          id="addEWalletAccount"
          ref={this.formRef}
          onFinish={this.handleAddingAndClose}
          {...formItemLayout}
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
          }}
        >

          <Form.Item
            name="code"
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
            name="secret"
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
            <Button type="primary" htmlType="submit" form="addEWalletAccount"
              key="submit">
              Submit
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
export default memo(EWalletTab, arePropsEqual);
