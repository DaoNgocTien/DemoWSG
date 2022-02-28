import React, { Component, memo } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Descriptions,
  Switch,
} from "antd";
import PropTypes from "prop-types";
import { Select, Upload } from "antd";
import moment from "moment";

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
  closeModal: () => {},
  createCampaign: () => {},
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
    price: 0,
    productSelected: {},
  };
  formRef = React.createRef();

  componentDidMount() {
    this.setState({
      productSelected: this.props.productList[0],
    });
  }

  handleCreateAndClose = (data) => {
    console.log("Campaign create");
    console.log(this.state.productSelected);
    const productSelected =
      this.state.productSelected === {} || !this.state.productSelected
        ? this.props.productList[0]
        : this.state.productSelected;
    let newCampaign = {
      productId: data.productId,
      fromDate: data.date[0],
      toDate: data.date[1],
      quantity: data.quantity,
      price: (data.wholesalePercent * productSelected.retailprice) / 100,
      isShare: data.isShare,
      maxQuantity: data.maxQuantity,
    };
    // console.log(newCampaign);
    this.props.createCampaign(newCampaign);
    // data.image = this.state.fileList;
    // this.props.createProduct(data);
    // this.formRef.current.resetFields();
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

  onChange = (dates, dateStrings) => {
    // console.log("From: ", dates[0], ", to: ", dates[1]);
    // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
  };

  onSelectProduct = (value) => {
    // console.log(value);
    this.setState({
      productSelected: this.props.productList?.find(
        (element) => element.id === value
      ),
    });
  };

  onChangePrice = (value) => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      price: value,
    });
  };

  render() {
    const { openModal } = this.props;

    const { productList } = this.props;
    const { productSelected = this.props.productList[0], price = 0 } =
      this.state;
    // console.log(productSelected);
    return (
      <>
        <Form
          id="createCampaignForm"
          ref={this.formRef}
          onFinish={this.handleCreateAndClose}
        >
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
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Campaign duration">
                <Form.Item
                  name="date"
                  initialValue={[moment(), moment().add(1, "days")]}
                >
                  <RangePicker
                    ranges={{
                      Today: [moment(), moment()],
                      "This Week": [
                        moment().startOf("week"),
                        moment().endOf("week"),
                      ],
                      "This Month": [
                        moment().startOf("month"),
                        moment().endOf("month"),
                      ],
                    }}
                    defaultValue={[moment(), moment().add(1, "days")]}
                    format="MM/DD/YYYY"
                    onChange={this.onChange}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item name="productId" initialValue={productList[0]?.id}>
                  <Select onChange={this.onSelectProduct}>
                    {productList.map((item) => {
                      return (
                        <Select.Option key={item.key} value={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                <Form.Item name="quantity" initialValue={1}>
                  <InputNumber addonAfter=" products" defaultValue={1} />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Max Quantity">
                <Form.Item name="maxQuantity" initialValue={1}>
                  <InputNumber addonAfter=" products" defaultValue={1} />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Share">
                <Form.Item name="isShare">
                  <Switch />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale percent">
                <Form.Item name="wholesalePercent" initialValue={0}>
                  <InputNumber
                    addonAfter=" %"
                    defaultValue={0}
                    onChange={this.onChangePrice}
                    min={0}
                    max={100}
                  />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions bordered title="Product in campaign" column={2}>
              <Descriptions.Item label="Name">
                {productSelected?.name ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {productSelected?.categoryname ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity in stock">
                {productSelected?.quantity ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity in campaign">
                {productSelected?.name ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Retail price">
                {productSelected?.retailprice ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Wholesale price">
                {(price * productSelected?.retailprice) / 100 ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                <Input.TextArea
                  value={productSelected?.description}
                  rows={5}
                  bordered={false}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Image">
                <Upload
                  name="file"
                  action="/files/upload"
                  listType="picture-card"
                  fileList={
                    productSelected?.image
                      ? JSON.parse(productSelected?.image)
                      : []
                  }
                  // onPreview={this.handlePreview}
                  // onChange={this.handleChange}
                >
                  {/* {this.state.fileList.length >= 8 ? null : uploadButton} */}
                </Upload>
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
