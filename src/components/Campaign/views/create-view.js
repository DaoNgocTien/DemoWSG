import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select, Switch, Upload, Tooltip
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";

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
    price: 0,
    productSelected: {},
    availableQuantity: 10,
    minQuantity: 10,
    maxQuantity: 10,
  };
  formRef = React.createRef();

  componentDidMount() {
    this.setState({
      productSelected: this.props.productList[0],
    });
  }

  handleCreateAndClose = (data) => {
    // console.log("Campaign create");
    // console.log(this.state.productSelected);
    const productSelected =
      this.state.productSelected === {} || !this.state.productSelected
        ? this.props.productList[0]
        : this.state.productSelected;
    // console.log(data);
    let newCampaign = {
      productId: data.productId,
      fromDate: data.date[0],
      toDate: data.date[1],
      quantity: data.quantity,
      price: (data.wholesalePercent * productSelected.retailprice) / 100,
      isShare: data.isShare ? true : false,
      maxQuantity: data.maxQuantity,
      advanceFee: data.advancePercent,
      description: data.description,
    };
    // console.log(newCampaign);
    this.props.createCampaign(newCampaign);
    // data.image = this.state.fileList;
    // this.props.createProduct(data);
    // this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  onSelectProduct = (value) => {
    //  Get selected product
    let productSelected = this.props.productList?.find(
      (element) => element.id === value
    );
    //  Get campaign list of selected product
    let campaignListOfSelectedProduct = [];
    let campaignList = this.props.campaingList ? this.props.campaingList : [];
    campaignListOfSelectedProduct = campaignList.filter(camp => {
      return camp.productid === value && (camp.status === "ready" || camp.status === "active");
    });
    //  Get quantity of product in exist active campaign
    let productQuantityOfExistCampaign = 0;
    campaignListOfSelectedProduct.map(camp => productQuantityOfExistCampaign += Number(camp.maxquantity))

    //  Set selected product and available quantity into state
    this.setState({
      productSelected: productSelected,
      availableQuantity: productSelected.quantity - productQuantityOfExistCampaign,
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

  onChangeQuantity = (value, str) => {
    switch (str) {
      case "min":
        this.setState({
          minQuantity: value,
        })
        break;
      case "max":
        this.setState({
          maxQuantity: value,
        })
        break;
    }

  }
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  render() {
    const { openModal } = this.props;

    const { productList } = this.props;
    const {
      productSelected,
      price = 0,
      availableQuantity,
      minQuantity,
      maxQuantity
    } =
      this.state;
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

            <Descriptions layout="vertical" column={2}>
              {/* <Descriptions.Item label="Name">
                <Form.Item name="description"
                  rules={[
                    // {
                    //   required: true,
                    // },
                    () => ({
                      validator(_, value) {

                        // if (listName.includes(value)) {
                        //   return Promise.reject(new Error('Product Name exists!'));
                        // }
                        if (value.length > 0 && value.length <= 50) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Name is required, length is 1-50 characters!'));

                        // validator(_, value) {

                        //   if (Number(value) > 9) {
                        //     return Promise.resolve();
                        //   }

                        //   return Promise.reject(new Error('Number of product is positive number!'));
                        // },
                      }
                    }),
                  ]}
                >
                  <Input style={{ width: "60vh" }} placeholder="Name is required, length is 1-50 characters" />
                </Form.Item>
              </Descriptions.Item> */}
              <Descriptions.Item label="Campaign duration">
                <Form.Item
                  name="date"
                  initialValue={[moment(), moment().add(1, "days")]}
                  rules={[
                    {
                      required: true,
                      // message: 'Name is required!',
                    },
                    // () => ({
                    // validator(_, value) {

                    //   if (listName.includes(value)) {
                    //     return Promise.reject(new Error('Product Name exists!'));
                    //   }
                    // if (value.length > 0 && value.length <= 200) {
                    //   return Promise.resolve();
                    // }

                    // return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                    //   validator(_, value) {

                    //     if (Number(value) > 0) {
                    //       return Promise.resolve();
                    //     }

                    //     return Promise.reject(new Error('Discount price is positive number!'));
                    //   },
                    // }),
                  ]}
                // tooltip="Discount price is 1000 -> product retail price!"
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
                    // defaultValue={[moment(), moment().add(1, "days")]}
                    format="MM/DD/YYYY"
                    onChange={this.onChange}
                    style={{ width: "60vh" }}
                    disabledDate={this.disabledDate}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item name="productId"
                  initialValue={productList[0]?.id}
                  rules={[
                    {
                      required: true,
                      // message: 'Name is required!',
                    },
                    // () => ({
                    // validator(_, value) {

                    //   if (listName.includes(value)) {
                    //     return Promise.reject(new Error('Product Name exists!'));
                    //   }
                    // if (value.length > 0 && value.length <= 200) {
                    //   return Promise.resolve();
                    // }

                    // return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                    //   validator(_, value) {

                    //     if (Number(value) > 0) {
                    //       return Promise.resolve();
                    //     }

                    //     return Promise.reject(new Error('Discount price is positive number!'));
                    //   },
                    // }),
                  ]}
                // help="Discount price is 1000 -> product retail price!"
                >
                  <Select
                    onChange={this.onSelectProduct}
                    style={{ width: "60vh" }}
                  >
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
                <Form.Item name="quantity" initialValue={10}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Name is required!',
                    // },
                    ({ getFieldValue }) => ({
                      // validator(_, value) {

                      //   if (listName.includes(value)) {
                      //     return Promise.reject(new Error('Product Name exists!'));
                      //   }
                      // if (value.length > 0 && value.length <= 200) {
                      //   return Promise.resolve();
                      // }

                      // return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                      validator(_, value) {
                        if (getFieldValue('maxQuantity') < value) {
                          return Promise.reject(new Error('Quantity can not bigger than max quantity!'));
                        }
                        if (Number(value) > 9) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Number of product is positive number!'));
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    addonAfter=" products"
                    min={10}
                    max={availableQuantity}
                    style={{ width: "60vh" }}
                    placeholder="Quantity is 10 -> maximum available quantity in stock!"
                    onChange={(e) => this.onChangeQuantity(e, "min")}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Max Quantity">
                <Form.Item name="maxQuantity" initialValue={10}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Name is required!',
                    // },
                    ({ getFieldValue }) => ({
                      // validator(_, value) {

                      //   if (listName.includes(value)) {
                      //     return Promise.reject(new Error('Product Name exists!'));
                      //   }
                      // if (value.length > 0 && value.length <= 200) {
                      //   return Promise.resolve();
                      // }

                      // return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                      validator(_, value) {
                        if (getFieldValue('quantity') > value) {
                          return Promise.reject(new Error('Maximum quantity can not lesser than quantity!'));
                        }
                        if (Number(value) > 9) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Maximum quantity is positive number!'));
                      },
                    }),
                  ]}
                // tooltip="Max quantity is 10 -> maximum available quantity in stock!"
                >
                  <InputNumber
                    addonAfter=" products"
                    min={10}
                    max={availableQuantity}
                    style={{ width: "60vh" }}
                    onChange={(e) => this.onChangeQuantity(e, "max")}

                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Advance Percent">
                <Form.Item name="advancePercent" initialValue={0}
                  rules={[
                    {
                      required: true,
                    },
                    // () => ({
                    // validator(_, value) {

                    //   if (listName.includes(value)) {
                    //     return Promise.reject(new Error('Product Name exists!'));
                    //   }
                    // if (value.length > 0 && value.length <= 200) {
                    //   return Promise.resolve();
                    // }

                    // return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                    // validator(_, value) {

                    //   if (Number(value) > 9) {
                    //     return Promise.resolve();
                    //   }

                    //   return Promise.reject(new Error('Number of product is positive number!'));
                    // },
                    // }),
                  ]}
                >
                  <InputNumber
                    addonAfter="%"
                    // defaultValue={0}
                    min={1}
                    max={99}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale percent">
                <Form.Item name="wholesalePercent" initialValue={0}
                  rules={[
                    {
                      required: true,
                    },
                    // () => ({
                    // validator(_, value) {

                    //   if (listName.includes(value)) {
                    //     return Promise.reject(new Error('Product Name exists!'));
                    //   }
                    // if (value.length > 0 && value.length <= 200) {
                    //   return Promise.resolve();
                    // }

                    // return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                    // validator(_, value) {

                    //   if (Number(value) > 9) {
                    //     return Promise.resolve();
                    //   }

                    //   return Promise.reject(new Error('Number of product is positive number!'));
                    // },
                    // }),
                  ]}
                >
                  <InputNumber
                    addonAfter=" %"
                    // defaultValue={0}
                    onChange={this.onChangePrice}
                    min={0}
                    max={100}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>


              <Descriptions.Item label="Share">
                <Form.Item name="isShare">
                  <Switch />
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
                {productSelected ? minQuantity + " -> " + maxQuantity : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Retail price">
                <NumberFormat
                  value={productSelected?.retailprice ?? ""}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />

              </Descriptions.Item>
              <Descriptions.Item label="Wholesale price">
                <NumberFormat
                  value={(price * productSelected?.retailprice) / 100 ?? ""}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />

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
