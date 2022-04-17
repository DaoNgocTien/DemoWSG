import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Upload,
  Tooltip,
  Space,
  Typography,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo, createRef } from "react";
import NumberFormat from "react-number-format";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TimelineItem from "antd/lib/timeline/TimelineItem";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const propsProTypes = {
  closeModal: PropTypes.func,
  createCampaign: PropTypes.func,
  openModal: PropTypes.bool,
  productList: PropTypes.array,
};

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
    availableQuantity: 10,
    minQuantity: 10,
    maxQuantity: 10,
    switchState: true,
    minWholesalePrice: 500,
    advancePercent: 1,
    minSharedAdvancedPercent: 1,
    minSharedQuantityStep: 2,
    errStepArr: {
      errArr: [],
      compareArr: [],
    },
    errMes: "",
  };
  formRef = React.createRef();
  switchmRef = React.createRef();

  componentDidMount() {
    this.setState({
      productSelected: this.props.productList[0],
    });
  }

  handleCreateAndClose = (data) => {
    console.log(data);

    const productSelected =
      this.state.productSelected === {} || !this.state.productSelected
        ? this.props.productList[0]
        : this.state.productSelected;

    let newCampaign = {};
    if (this.state.switchState) {
      data.quantities = data.quantities.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.quantity === value.quantity && t.price <= value.price
          )
      );

      data.quantities.sort(function (a, b) {
        return b.quantity - a.quantity;
      });
      console.log(data.quantities);
      let errArr = [];
      let compareArr = [];
      data.quantities.map((item) => {
        data.quantities.map((item2) => {
          if (item.quantity != item2.quantity) {
            if (item.quantity > item2.quantity && item.price > item2.price) {
              errArr.push(item);
              compareArr.push(item2);
            }
          }
        });
      });
      if (errArr.length === 0) {
        data.quantities.map((item) => {
          return (item.price = (item.price * data.wholesalePrice) / 100);
        });
        newCampaign = {
          productId: data.productId,
          fromDate: data.date[0],
          toDate: data.date[1],
          quantity: 0,
          price: data.wholesalePrice,
          maxQuantity: data.maxQuantity,
          description: data.description,
          advanceFee: data.advancePercent,
          isShare: this.state.switchState ? true : false,
          range: [...data.quantities],
        };
        this.props.createCampaign(newCampaign);
        this.props.closeModal();
      } else {
        this.setState({
          errStepArr: {
            errArr: errArr,
            compareArr: compareArr,
          },
        });
      }
    } else {
      newCampaign = {
        productId: data.productId,
        fromDate: data.date[0],
        toDate: data.date[1],
        quantity: data.quantity,
        price: data.wholesalePrice,
        maxQuantity: data.maxQuantity,
        description: data.description,
        advanceFee: data.advancePercent,
        isShare: this.state.switchState ? true : false,
        range: [],
      };
      this.props.createCampaign(newCampaign);
      this.props.closeModal();
    }
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  onSelectProduct = (value) => {
    let productSelected = this.props.productList?.find(
      (element) => element.id === value
    );

    let campaignListOfSelectedProduct = [];
    let campaignList = this.props.campaingList ? this.props.campaingList : [];
    campaignListOfSelectedProduct = campaignList.filter((camp) => {
      return (
        camp.productid === value &&
        (camp.status === "ready" || camp.status === "active")
      );
    });

    let productQuantityOfExistCampaign = 0;
    campaignListOfSelectedProduct.map(
      (camp) => (productQuantityOfExistCampaign += Number(camp.maxquantity))
    );

    this.setState({
      productSelected: productSelected,
      availableQuantity:
        productSelected.quantity - productQuantityOfExistCampaign,
    });
  };

  onChangePrice = (value) => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      price: value,
      minWholesalePrice: value,
    });
  };

  onChangeQuantity = (value, str) => {
    switch (str) {
      case "min":
        this.setState({
          minQuantity: value,
        });
        break;
      case "max":
        this.setState({
          maxQuantity: value,
        });
        break;
    }
  };
  onChangeAdvancePercent = (value) => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      advancePercent: value,
    });
  };
  disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };
  toggleSwitch = () => {
    this.setState({
      switchState: !this.state.switchState,
    });
    this.state.switchState ?? this.formRef.setFieldsValue({ sights: [] });
  };
  showStepErr = () => {
    const { errArr = [], compareArr = [] } = this.state.errStepArr;
    let errMes = "";

    for (let index = 0; index < errArr.length; index++) {
      const element = errArr[index];
      errMes +=
        "Conflict step: " +
        errArr[index].quantity +
        " " +
        errArr[index].price +
        " - " +
        compareArr[index].quantity +
        " " +
        compareArr[index].price +
        "\n";
    }

    return <Text type="danger">{errMes}</Text>;
  };

  render() {
    const { openModal } = this.props;

    const { productList } = this.props;
    const {
      productSelected,
      price = 0,
      availableQuantity,
      minQuantity,
      maxQuantity,
      minWholesalePrice,
      advancePercent,
      minSharedAdvancedPercent,
      minSharedQuantityStep,
      switchState,
      formListErrMessage,
      errStepArr,
    } = this.state;
    console.log(productSelected);
    return (
      <>
        <Modal
          width={window.innerWidth * 0.7}
          heigh={window.innerHeight * 0.5}
          destroyOnClose={true}
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
          <Form
            name="formS"
            id="createCampaignForm"
            ref={this.formRef}
            onFinish={this.handleCreateAndClose}
            layout="vertical"
          >
            <Space size={30}>
              <Form.Item
                name="description"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Name is required!",
                  },
                  () => ({
                    validator(_, value) {
                      if (value.length > 0 && value.length <= 50) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "Name is required, length is 1-50 characters!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input
                  style={{ width: "60vh" }}
                  placeholder="Name is required, length is 1-50 characters!"
                />
              </Form.Item>
              <Form.Item
                label="Campaign duration"
                name="date"
                initialValue={[moment(), moment().add(1, "days")]}
                rules={[
                  {
                    required: true,
                  },
                ]}
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
                  format="MM/DD/YYYY"
                  onChange={this.onChange}
                  style={{ width: "60vh" }}
                  disabledDate={this.disabledDate}
                />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="productId"
                label="Product"
                initialValue={productList[0]?.id}
                rules={[
                  {
                    required: true,
                  },
                  () => ({
                    validator(_, value) {
                      if (
                        Number(productSelected?.retailprice) *
                          Number(availableQuantity) <
                        5000
                      ) {
                        return Promise.reject(
                          new Error("Unable to use product")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Select
                  onChange={this.onSelectProduct}
                  style={{ width: "60vh" }}
                >
                  {productList.map((item) => {
                    if (
                      [item.quantity - item.maxquantity] *
                        Number(item.retailprice) >
                      5000
                    )
                      return (
                        <Select.Option key={item.key} value={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                name="wholesalePrice"
                initialValue={minWholesalePrice}
                label="Wholsale Price"
                dependencies={[maxQuantity]}
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const quantity = getFieldValue("quantity");
                      const advancePercent = getFieldValue("advancePercent");
                      const range =
                        Number(productSelected?.retailprice) ?? 999999999999;

                      if (value * quantity * advancePercent < 500000) {
                        return Promise.reject(
                          new Error(
                            "Advance percent has to be >= 5000 VND, at least " +
                              (500000 / (value * quantity) + 1).toFixed() +
                              " %"
                          )
                        );
                      }
                      if (value >= 0 && value <= range) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "Wholesale maximum price is product retail price!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  addonAfter=" VND"
                  max={productSelected?.retailprice ?? 999999999999}
                  onChange={this.onChangePrice}
                  min={0}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="quantity"
                initialValue={10}
                label="Quantity"
                tooltip="In single campaign, quantity is the minimum amount of products customer has to buy to end campaign successfully.
                In shared campaign, quantity is the minimum product customer has to order to join the campaign!!"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const min = switchState ? 0 : 9;
                      const maxQuantity = getFieldValue("maxQuantity");
                      const wholesalePrice = getFieldValue("wholesalePrice");
                      const advancePercent = getFieldValue("advancePercent");

                      if (maxQuantity < value) {
                        return Promise.reject(
                          new Error(
                            "Quantity can not bigger than max quantity!"
                          )
                        );
                      }

                      if (value * wholesalePrice * advancePercent < 500000) {
                        return Promise.reject(
                          new Error(
                            "Advance percent has to be >= 5000 VND, at least " +
                              (
                                500000 / (value * wholesalePrice) +
                                1
                              ).toFixed() +
                              " %"
                          )
                        );
                      }
                      if (value > min) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Number of product is positive number!")
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  addonAfter=" products"
                  min={this.state.switchState ? "1" : "10"}
                  max={availableQuantity}
                  style={{ width: "60vh" }}
                  placeholder={
                    "Quantity is" + this.state.switchState
                      ? "1"
                      : "10" + " -> maximum available quantity in stock!"
                  }
                  onChange={(e) => this.onChangeQuantity(e, "min")}
                />
              </Form.Item>

              <Form.Item
                name="maxQuantity"
                initialValue={10}
                label="Max Quantity"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue("quantity") > value) {
                        return Promise.reject(
                          new Error(
                            "Maximum quantity can not lesser than quantity!"
                          )
                        );
                      }
                      if (Number(value) > 9) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Maximum quantity is positive number!")
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  addonAfter=" products"
                  min={minQuantity}
                  max={availableQuantity}
                  style={{ width: "60vh" }}
                  onChange={(e) => this.onChangeQuantity(e, "max")}
                />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="advancePercent"
                initialValue={1}
                label="Advance Percent"
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const range =
                        Number(productSelected?.retailprice) ?? 999999999999;
                      const quantity = getFieldValue("quantity");
                      const wholesalePrice = getFieldValue("wholesalePrice");
                      const advancePercent = getFieldValue("advancePercent");
                      if (wholesalePrice * quantity * value <= 500000) {
                        return Promise.reject(
                          new Error(
                            "Advance percent to be > 5000, at least " +
                              (
                                500000 / (minWholesalePrice * maxQuantity) +
                                1
                              ).toFixed() +
                              " %"
                          )
                        );
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  addonAfter="%"
                  onChange={this.onChangeAdvancePercent}
                  min={1}
                  max={99}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
              <Form.Item
                name="advancePercen2"
                initialValue={1}
                label="Advance Percent"
                hidden="true"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  addonAfter="%"
                  min={1}
                  max={99}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
            </Space>
            <Space size={30}>
              <Form.Item
                label="Campaign type"
                name="isShare"
                tooltip="In single campaign, a customer buy all products at once and campaign is done. In shared campaign, customers can buy products at any amount and the final price will depend on the campaign steps!!"
              >
                <Space style={{ width: "60vh" }} size={20}>
                  <Switch
                    onClick={this.toggleSwitch}
                    defaultChecked="true"
                    style={{ marginRight: "20" }}
                  />
                  {this.state.switchState
                    ? "Shared: more buyer more discount"
                    : "Single: buy all at once"}
                </Space>
              </Form.Item>
            </Space>
            {!switchState ? (
              ""
            ) : (
              <>
                <Title type="error" style={{ textAlign: "center" }} level={3}>
                  {this.showStepErr()}
                </Title>

                <Form.List
                  name="quantities"
                  onChange={(record) => {
                    console.log(record);
                  }}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space key={field.key} align="baseline" size={30}>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area ||
                              prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label="Quantity Up To"
                                name={[field.name, "quantity"]}
                                initialValue={maxQuantity}
                              >
                                <InputNumber
                                  addonAfter=" products"
                                  max={maxQuantity}
                                  // onChange={this.clearStepErr()}
                                  min={minQuantity}
                                  style={{ width: "60vh" }}
                                />
                              </Form.Item>
                            )}
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Price"
                            name={[field.name, "price"]}
                            rules={[
                              {
                                required: true,
                                message: "Wholesale price percent is required",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const quantity = getFieldValue("quantity");
                                  const wholesalePrice =
                                    getFieldValue("wholesalePrice");
                                  const advancePercent =
                                    getFieldValue("advancePercent");
                                  const range = getFieldValue("quantities").sort(
                                    (a, b) => a.quantity - b.quantity
                                  );
                                  const index = _.field.match(/\d/g);
                                  // c
                                  console.log(_);
                                  if (
                                    quantity *
                                      advancePercent *
                                      wholesalePrice *
                                      value <
                                    5000 * 100 * 100
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        "Wholesale price percent in this step is invalid due to advance percent < 5000, at least " +
                                          (
                                            50000000 /
                                              (quantity *
                                                wholesalePrice *
                                                value) +
                                            1
                                          ).toFixed() +
                                          " %"
                                      )
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            initialValue={advancePercent}
                          >
                            <InputNumber
                              addonAfter="% of wholesale campaign price"
                              min={1}
                              max={99}
                              style={{ width: "60vh" }}
                              // onChange={this.clearStepErr()}
                            />
                          </Form.Item>

                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </Space>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Campaign Discount Step
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </>
            )}

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
                  value={price}
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
                >
                  {/* {this.state.fileList.length >= 8 ? null : uploadButton}  */}
                </Upload>
              </Descriptions.Item>
            </Descriptions>
          </Form>
        </Modal>
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(CreatModal, arePropsEqual);
