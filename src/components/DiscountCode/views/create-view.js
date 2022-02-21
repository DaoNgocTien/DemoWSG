import React, { Component, memo } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Descriptions,
} from "antd";
import PropTypes from "prop-types";
import { Select, Upload } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  createDiscountCode: PropTypes.func,
  openModal: PropTypes.bool,
  productList: PropTypes.array,
};

//  default props
const propsDefault = {
  closeModal: () => {},
  createDiscountCode: () => {},
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
  };
  formRef = React.createRef();

  componentDidMount() {}

  handleCreateAndClose = (data) => {
    console.log("DiscountCode create");
    console.log(data);
    let newDiscountCode = {
      productId: data.productId,
      startDate: data.date[0],
      endDate: data.date[1],
      quantity: data.quantity,
      discountPrice: data.discountPrice,
      minimunPriceCondition: data.minimunPrice,
      status: data.status,
      code: data.code
    };

    console.log(newDiscountCode);
    this.props.createDiscountCode(newDiscountCode);
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
          id="createDiscountCodeForm"
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
                form="createDiscountCodeForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Discount Code duration">
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

              <Descriptions.Item label="Code">
                <Form.Item name="code">
                  <Input/>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Discount price">
                <Form.Item name="discountPrice" initialValue={1}>
                  <InputNumber defaultValue={1} />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Minimun price">
                <Form.Item name="minimunPrice" initialValue={1}>
                  <InputNumber defaultValue={1} />
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

              <Descriptions.Item label="Status">
                <Form.Item name="status" initialValue={"public"}>
                  <Select>
                    <Select.Option key="public" value="public">
                      Public
                    </Select.Option>
                    <Select.Option key="private" value="private">
                      Private
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                <Form.Item name="quantity" initialValue={1}>
                  <InputNumber defaultValue={1} />
                </Form.Item>
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