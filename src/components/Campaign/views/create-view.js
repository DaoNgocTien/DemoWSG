import React, { Component, memo } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Space,
  Row,
  Col,
  InputNumber,
  Slider,
  Descriptions,
} from "antd";
import PropTypes from "prop-types";
import { Select, Upload } from "antd";
import moment from "moment";
import Axios from "axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

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

class CreatModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    productSelected: {},
    price: 0,
  };
  formRef = React.createRef();


  componentDidMount() {
    console.log(this.props);
  }

  handleCreateAndClose = (data) => {
    console.log("Campaign create");
    console.log(data);
    let newCampaign = {
      productId: data.productId,
      fromDate: data.date[0],
      toDate: data.date[1],
      quantity: 100,
      price: 1000,
    };
    this.props.createCampaign(newCampaign);
    // data.image = this.state.fileList;
    // this.props.createProduct(data);
    // this.formRef.current.resetFields();
    // this.props.closeModal();
  };

  handleCreate = (data) => {
    this.props.createProduct(data);
    this.formRef.current.resetFields();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  onChange = (dates, dateStrings) => {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  onSelectProduct = value => {
    console.log(value);
  }

  onChangePrice = value => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      price: value * 10000 / 100,
    });
  };

  render() {
    const { openModal } = this.props;

    const { productList } = this.props;
    const { productSelected, price } = this.state;
    return (
      <>
        <Form id="createCampaignForm" ref={this.formRef} onFinish={this.handleCreateAndClose}>
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Add New"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="createCampaignForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >

            <Descriptions
              bordered
              column={2}
            >
              <Descriptions.Item label="Campaign duration">
                <Form.Item name="date">
                  <RangePicker
                    ranges={{
                      Today: [moment(), moment()],
                      'This Week': [moment().startOf('week'), moment().endOf('week')],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    onChange={this.onChange}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item
                  name="productId"
                  initialValues={{ value: productList[0] ? productList[0].name : "" }}
                >
                  <Select
                    onChange={this.onSelectProduct}
                  >
                    {productList.map((item) => {
                      console.log("Product in create campaign: ");
                      console.log(item);
                      return <Select.Option key={item.key} value={item.id}>
                        {item.name}
                      </Select.Option>
                    })}
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                <Form.Item name="quantity">
                  <InputNumber addonAfter=" products" defaultValue={1} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale percent">
                <Form.Item name="wholesalePercent">
                  <InputNumber addonAfter=" %" defaultValue={1} onChange={this.onChangePrice} />
                </Form.Item>
              </Descriptions.Item>

            </Descriptions>

            <Descriptions
              bordered
              title="Product in campaign"
              column={2}
            >
              <Descriptions.Item label="Name">{productSelected.name ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Category">{productSelected.categoryname ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Quantity in stock">{productSelected.quantity ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Quantity in campaign">{productSelected.name ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Retail price">{productSelected.price ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Wholesale price">{price ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Description">
                Data disk type: MongoDB
                <br />
                Database version: 3.4
                <br />
                Package: dds.mongo.mid
                <br />
                Storage space: 10 GB
                <br />
                Replication factor: 3
                <br />
                Region: East China 1<br />
              </Descriptions.Item>
              <Descriptions.Item label="Image">
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={productSelected.previewImage}
                />
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </Form>
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(CreatModal, arePropsEqual);
