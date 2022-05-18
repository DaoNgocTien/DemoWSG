import {
  MinusCircleOutlined,
  PlusOutlined,
  UndoOutlined
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Select, Space, Switch, Typography, Upload
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

class EdilModal extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    price: null,
    productSelected: null,
    availableQuantity: 10,
    minQuantity: 10,
    maxQuantity: null,
    switchState: true,
    minWholesalePrice: 100,
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
  quantityRef = React.createRef();

  uniqByKeepFirst(a, key) {
    let seen = new Set();
    return a.filter((item) => {
      let k = key(item);
      return seen.has(k) ? false : seen.add(k);
    });
  }

  handleEditAndClose = (data) => {
    let newCampaign = {};
    if (this.state.switchState) {
      data.quantities.sort(function (a, b) {
        return b.quantity - a.quantity;
      });

      const datas = this.uniqByKeepFirst(data.quantities, (it) => it.quantity);

      newCampaign = {
        id: this.props.record?.id,
        productId: this.state.productSelected?.id,
        fromDate: data.date[0],
        toDate: data.date[1],
        quantity: 1,
        price: data.wholesalePrice,
        maxQuantity: data.maxQuantity,
        description: data.description,
        advanceFee: data.advancePercent,
        isShare: this.state.switchState ? true : false,
        range: [...datas],
      };

      this.props.updateCampaign(newCampaign);

      this.props.closeModal();
    } else {
      newCampaign = {
        id: this.props.record?.id,
        productId: this.state.productSelected?.id,
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
      this.props.updateCampaign(newCampaign);
      this.props.closeModal();
    }
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  onSelectProduct = (value) => {
    let productSelected = this.props.productList?.find(
      (element) => element.id === value
    );
    this.setState({
      productSelected: productSelected,
      availableQuantity: productSelected.quantity - productSelected.maxquantity,
      switchState: true,
      price: productSelected.retailprice,
      maxQuantity: "10",
    });
    this.formRef.current.setFieldsValue({
      wholesalePrice: productSelected.retailprice,
      quantity: this.state.switchState ? "1" : "10",
      maxQuantity: "10",
      advancePercent: "1",
      isShare: true,
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
    this.quantityRef.current.value = 1;
  };

  render() {
    const { openModal, defaultProduct } = this.props;
    const { productList, record } = this.props;
    let {
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
    productSelected = productSelected
      ? productSelected
      : productList.find((p) => p.id === record.productid);

    console.log(this.props);
    return (
      <>
        <Modal
          width={window.innerWidth * 0.7}
          heigh={window.innerHeight * 0.5}
          destroyOnClose={true}
          style={{
            top: 10,
          }}
          title="Update Campaign"
          visible={openModal}
          onCancel={this.handleCancel}
          footer={[
            <Button onClick={this.handleCancel}>Cancel</Button>,
            <Button
              type="primary"
              form="updateCampaignForm"
              key="submit"
              htmlType="submit"
            >
              Submit
            </Button>,
          ]}
        >
          <Form
            key={record?.key}
            name="updateCampaignForm"
            id="updateCampaignForm"
            ref={this.formRef}
            onFinish={this.handleEditAndClose}
            layout="vertical"
          >
            <Space size={30}>
              <Form.Item
                initialValue={record?.description ?? ""}
                name="description"
                label="Name"
                rules={[
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
                label="Campaign Duration"
                name="date"
                initialValue={[
                  moment(this.props.record?.fromdate),
                  moment(this.props.record?.todate),
                ]}
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
                initialValue={record?.productid}
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
                      5000 &&
                      item.status !== "deactivated"
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

                label="Wholsale Price"
                dependencies={[maxQuantity]}
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const range =
                        Number(productSelected?.retailprice) || 99999999;
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
                  min={100}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="quantity"
                initialValue={record?.quantity}
                label="Quantity"
                tooltip="In single campaign, quantity is the minimum amount of products customer has to buy to end campaign successfully.
                In shared campaign, quantity is the minimum product customer has to order to join the campaign, default 1"
                rules={[
                  {
                    required: true,
                    message: "Quantity is required!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const min = switchState ? 0 : 9;
                      const maxQuantity = getFieldValue("maxQuantity");

                      if (maxQuantity < value) {
                        return Promise.reject(
                          new Error(
                            "Quantity can not bigger than max quantity!"
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
                  ref={this.quantityRef}
                  disabled={switchState ? true : false}
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
                initialValue={record?.maxquantity}
                label="Max Quantity"
                rules={[
                  {
                    required: true,
                    message: "Max quantity is required!",
                  },
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
                  min={switchState ? 1 : minQuantity}
                  max={availableQuantity}
                  style={{ width: "60vh" }}
                  onChange={(e) => this.onChangeQuantity(e, "max")}
                />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="advancePercent"
                initialValue={record?.advancefee}
                label="Advance Percent"
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
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
                initialValue={record?.isshare ? true : false}
                tooltip="In single campaign, a customer buy all products at once and campaign is done. In shared campaign, customers can buy products at any amount and the final price will depend on the campaign steps!!"
              >
                <Space style={{ width: "60vh" }} size={20}>
                  <Switch
                    onClick={this.toggleSwitch}
                    ref={this.switchmRef}
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
                <Form.List
                  name="quantities"
                  onChange={(record) => { }}
                  initialValue={record?.range ? JSON.parse(record?.range) : []}
                >
                  {(fields, { add, remove }) => {
                    const reset = () => {
                      fields.forEach((field) => {
                        remove(field.name);
                      });
                      fields.forEach((field) => {
                        remove(field.name);
                      });
                      fields.forEach((field) => {
                        remove(field.name);
                      });
                    };
                    return (
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
                                  initialValue={1}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Quantity is required!",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    addonAfter=" products"
                                    max={maxQuantity}
                                    min={1}
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
                                  message: "Price is required!",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                              initialValue={advancePercent}
                            >
                              <InputNumber
                                addonAfter="VND"
                                min={100}
                                max={
                                  productSelected?.retailprice ?? 999999999999
                                }
                                style={{ width: "60vh" }}
                              />
                            </Form.Item>

                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                            />
                          </Space>
                        ))}
                        <Space size={30}>
                          <Form.Item>
                            <Button
                              onClick={reset}
                              block
                              icon={<UndoOutlined />}
                            >
                              Reset Step
                            </Button>
                          </Form.Item>

                          <Form.Item>
                            <Button
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Step
                            </Button>
                          </Form.Item>
                        </Space>
                        <Form.Item>
                          <Input.TextArea
                            disabled="true"
                            block
                            icon={<PlusOutlined />}
                            rows={5}
                            value="Share campaign tutorial step by step:
                          - The higher products customers buy, the better discount price they will get.
                          - Quantity step - price conflict: the higher quantity will be counted
                          For eq:
                            + Quantity 15, price 80
                            + Quantity 25, price 70
                            + Quantity 45, price 95
                            + Quantity 55, price 90
                            -> Quantity valid: 15-25
                            -> Quantity invalid: 45-55"
                          ></Input.TextArea>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              </>
            )}

            <Descriptions bordered title="Product in campaign" column={2}>
              <Descriptions.Item label="Name">
                {productSelected?.name ?? defaultProduct?.name ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {productSelected?.categoryname ??
                  defaultProduct?.categoryname ??
                  ""}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity in stock">
                {productSelected?.quantity ?? defaultProduct?.quantity ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Max quantity in campaign">
                {maxQuantity ?? record?.maxquantity ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Retail price">
                <NumberFormat
                  value={
                    productSelected?.retailprice ??
                    defaultProduct?.retailprice ??
                    ""
                  }
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Wholesale price">
                <NumberFormat
                  value={price ?? record?.price ?? ""}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                <Input.TextArea
                  value={
                    productSelected?.description ??
                    defaultProduct?.description ??
                    ""
                  }
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
                      : defaultProduct?.image
                        ? JSON.parse(defaultProduct?.image)
                        : []
                  }
                ></Upload>
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

export default memo(EdilModal, arePropsEqual);
