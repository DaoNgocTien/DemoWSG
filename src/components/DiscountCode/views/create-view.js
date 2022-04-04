import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

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
  closeModal: () => { },
  createDiscountCode: () => { },
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

  componentDidMount() { }

  handleCreateAndClose = (data) => {
    let newDiscountCode = {
      productId: data.productId,
      startDate: data.date[0],
      endDate: data.date[1],
      quantity: data.quantity,
      discountPrice: data.discountPrice,
      minimunPriceCondition: data.minimunPrice,
      code: data.code
    };
    this.props.createDiscountCode(newDiscountCode);
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  onSelectProduct = (value) => {
    // console.log(value);
    this.setState({
      productSelected: this.props.productList?.find(
        (element) => element.id === value
      ),
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
            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Discount Code duration">
                <Form.Item
                  name="date"
                  initialValue={[moment(), moment().add(1, "days")]}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <RangePicker
                    style={{ width: "60vh" }}
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
                <Form.Item name="code"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Name is required!',
                    // },
                    () => ({
                      validator(_, value) {

                        if (value.length > 0 && value.length <= 200) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                      },
                    }),
                  ]}
                >
                  <Input style={{ width: "60vh" }} placeholder="Code is required, length is 1-200 characters!" />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Discount price">
                <Form.Item name="discountPrice" initialValue={productSelected?.retailprice <= 999999999999 ? productSelected?.retailprice : 1000}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Name is required!',
                    // },
                    () => ({
                      // validator(_, value) {

                      //   if (listName.includes(value)) {
                      //     return Promise.reject(new Error('Product Name exists!'));
                      //   }
                      //   if (value.length >= 0 && value.length <= 20) {
                      //     return Promise.resolve();
                      //   }

                      //   return Promise.reject(new Error('Product Name is required, length is 1-20 characters!'));
                      validator(_, value) {
                        if (Number(value) > 0) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Discount price is positive number!'));
                      },
                    }),
                  ]}
                  help="Discount price is 1000 -> product retail price!"
                >
                  <InputNumber min={1000} max={productSelected?.retailprice <= 999999999999 ? productSelected?.retailprice : 999999999999} style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Minimun price">
                <Form.Item name="minimunPrice" initialValue={productSelected?.retailprice <= 999999999999 ? productSelected?.retailprice : 1000}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Name is required!',
                    // },
                    () => ({
                      // validator(_, value) {

                      //   if (listName.includes(value)) {
                      //     return Promise.reject(new Error('Product Name exists!'));
                      //   }
                      //   if (value.length >= 0 && value.length <= 20) {
                      //     return Promise.resolve();
                      //   }

                      //   return Promise.reject(new Error('Product Name is required, length is 1-20 characters!'));
                      validator(_, value) {
                        if (Number(value) > 0) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Minimum price is positive number!'));
                      },
                    }),
                  ]}
                  help="Minimum price is 1000!"

                >
                  <InputNumber style={{ width: "60vh" }} min={1000} max={999999999999} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item name="productId" initialValue={productList[0]?.id}>
                  <Select onChange={this.onSelectProduct} style={{ width: "60vh" }} >
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
                <Form.Item name="quantity" initialValue={1}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Name is required!',
                    // },
                    () => ({
                      // validator(_, value) {

                      //   if (listName.includes(value)) {
                      //     return Promise.reject(new Error('Product Name exists!'));
                      //   }
                      //   if (value.length >= 0 && value.length <= 20) {
                      //     return Promise.resolve();
                      //   }

                      //   return Promise.reject(new Error('Product Name is required, length is 1-20 characters!'));
                      validator(_, value) {
                        if (Number(value) > 0) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Quantity is positive number!'));
                      },
                    }),
                  ]}
                  help="Minimum quantity is 1!"

                >
                  <InputNumber defaultValue={1} style={{ width: "60vh" }} min={1} max={999999999999} />
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
