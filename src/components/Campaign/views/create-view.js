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
import { MinusCircleOutlined, PlusOutlined, UndoOutlined } from "@ant-design/icons";
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

  componentDidMount() {
    this.setState({
      productSelected: this.props.productList[0],
    });
  }

  uniqByKeepFirst(a, key) {
    let seen = new Set();
    return a.filter(item => {
      let k = key(item);
      return seen.has(k) ? false : seen.add(k);
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
      //  Sort array
      data.quantities.sort(function (a, b) {
        return b.quantity - a.quantity;
      });
      //  Remove duplicate quantity
      // data.quantities = data.quantities.filter(
      //   (value, index, self) =>
      //     index ===
      //     self.findIndex(
      //       (t) => t.quantity === value.quantity && t.price <= value.price
      //     )
      // );

      const datas = this.uniqByKeepFirst(data.quantities, it => it.quantity);
      console.log(datas);
      console.log(data.quantities);
      // let errArr = [];
      // let compareArr = [];
      // data.quantities.map((item) => {
      //   data.quantities.map((item2) => {
      //     if (item.quantity != item2.quantity) {
      //       if (item.quantity > item2.quantity && item.price > item2.price) {
      //         errArr.push(item);
      //         // compareArr.push(item2);
      //       }
      //     }
      //   })

      // })

      //  Remove item to make valid final array
      // let datas = data.quantities.filter(item => {
      //   console.log(!errArr.includes(item));
      //   return !errArr.includes(item);
      // })

      // //  Change % price to numeric price
      // datas.map(item => {
      //   return item.price = item.price * data.wholesalePrice / 100;
      // })

      //  Set new record
      newCampaign = {
        productId: data.productId,
        fromDate: data.date[0],
        toDate: data.date[1],
        quantity: 1,
        price: data.wholesalePrice,
        maxQuantity: data.maxQuantity,
        description: data.description,
        advanceFee: data.advancePercent,
        isShare: this.state.switchState ? true : false,
        range: [...datas]

      }

      //  Insert into database
      this.props.createCampaign(newCampaign);

      //  Close modal
      this.props.closeModal();
      // data.quantities.filter(item => {
      //   console.log(!errArr.includes(item));
      //   return !errArr.includes(item);
      //   // else {
      //   //   return item;
      //   // }
      // })
      // console.log(errArr);
      // console.log(datas);
      // this.setState({
      //   errStepArr: {
      //     errArr: errArr,
      //     compareArr: compareArr
      //   }
      // })


    }
    else {
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
    // this.formRef.current.resetFields();

    let productSelected = this.props.productList?.find(
      (element) => element.id === value
    );

    // let campaignListOfSelectedProduct = [];
    // let campaignList = this.props.campaingList ? this.props.campaingList : [];
    // campaignListOfSelectedProduct = campaignList.filter((camp) => {
    //   return (
    //     camp.productid === value &&
    //     (camp.status === "ready" || camp.status === "active")
    //   );
    // });

    // let productQuantityOfExistCampaign = 0;
    // campaignListOfSelectedProduct.map(
    //   (camp) => (productQuantityOfExistCampaign += Number(camp.maxquantity))
    // );

    this.setState({
      productSelected: productSelected,
      availableQuantity:
        productSelected.quantity - productSelected.maxquantity,
      switchState: true,
      price:productSelected.retailprice,
      maxQuantity: "10",
    });
    this.formRef.current.setFieldsValue({
      // description: 'ABCDEF',
      // price:productSelected.retailprice,
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
    })
    this.quantityRef.current.value = 1;

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
    console.log(productList);
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
                // initialValue={productList[0]?.id}
                rules={[
                  {
                    required: true,
                  },
                  () => ({
                    validator(_, value) {
                      if (Number(productSelected?.retailprice) * Number(availableQuantity) < 5000) {
                        return Promise.reject(new Error('Unable to use product'));
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
                      // const quantity = getFieldValue("quantity");
                      // const advancePercent = getFieldValue("advancePercent");
                      const range =
                        Number(productSelected?.retailprice) ?? 999999999999;

                      // if (value * quantity * advancePercent < 500000) {
                      //   return Promise.reject(
                      //     new Error(
                      //       "Advance payment has to be >= 5000 VND, at least " +
                      //       (500000 / (value * quantity) + 1).toFixed() +
                      //       " %"
                      //     )
                      //   );
                      // }
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
                initialValue={switchState ? 1 : minQuantity}
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
                      const maxQuantity = getFieldValue('maxQuantity');
                      // const wholesalePrice = getFieldValue('wholesalePrice');
                      // const advancePercent = getFieldValue('advancePercent');
                      if (maxQuantity < value) {
                        return Promise.reject(
                          new Error(
                            "Quantity can not bigger than max quantity!"
                          )
                        );
                      }

                      // if (value * wholesalePrice * advancePercent < 500000) {
                      //   return Promise.reject(
                      //     new Error(
                      //       "Advance payment has to be >= 5000 VND, at least " +
                      //       (
                      //         500000 / (value * wholesalePrice) +
                      //         1
                      //       ).toFixed() +
                      //       " %"
                      //     )
                      //   );
                      // }
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
                initialValue={10}
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
                initialValue={1}
                label="Advance Percent"
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      // const range = Number(productSelected?.retailprice) ?? 999999999999;
                      // const quantity = getFieldValue('quantity');
                      // const wholesalePrice = getFieldValue('wholesalePrice');
                      // const advancePercent = getFieldValue('advancePercent');
                      // if (wholesalePrice * quantity * value <= 500000) {
                      //   return Promise.reject(
                      //     new Error(
                      //       "Advance percent to be > 5000, at least " +
                      //       (
                      //         500000 / (minWholesalePrice * maxQuantity) +
                      //         1
                      //       ).toFixed() +
                      //       " %"
                      //     )
                      //   );
                      // }
                      return Promise.resolve();

                    }
                  })
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
                  onChange={(record) => {
                    console.log(record);
                  }}
                >
                  {(fields, { add, remove }) => {
                    const reset = () => {
                      fields.forEach(field => {
                        remove(field.name)
                      });
                      fields.forEach(field => {
                        remove(field.name)
                      });
                      fields.forEach(field => {
                        remove(field.name)
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
                              name={[field.name, 'price']}
                              rules={[
                                {
                                  required: true,
                                  message: "Price is required!",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    // const quantity = getFieldValue("quantity");
                                    // const wholesalePrice =
                                    //   getFieldValue("wholesalePrice");
                                    // const advancePercent =
                                    //   getFieldValue("advancePercent");
                                    // const range = getFieldValue("quantities").sort(
                                    //   (a, b) => a.quantity - b.quantity
                                    // );
                                    // const index = _.field.match(/\d/g);
                                    // c
                                    // console.log(_);
                                    // if (
                                    //   quantity *
                                    //   advancePercent *
                                    //   wholesalePrice *
                                    //   value <
                                    //   5000 * 100 * 100
                                    // ) {
                                    //   return Promise.reject(
                                    //     new Error(
                                    //       "Wholesale price percent in this step is invalid due to advance percent < 5000, at least " +
                                    //       (
                                    //         50000000 /
                                    //         (quantity *
                                    //           wholesalePrice *
                                    //           value) +
                                    //         1
                                    //       ).toFixed() +
                                    //       " %"
                                    //     )
                                    //   );
                                    // }
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                              initialValue={price}
                            >
                              <InputNumber
                                addonAfter="VND"
                                min={100}
                                max={productSelected?.retailprice ?? 999999999999}
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
                              // type="dashed"
                              onClick={reset}
                              block
                              icon={<UndoOutlined />}
                            >
                              Reset Step
                            </Button>
                          </Form.Item>

                          <Form.Item>
                            <Button
                              // type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Step
                            </Button>
                          </Form.Item>
                        </Space>
                        <Form.Item>
                          <Input.TextArea disabled="true" block icon={<PlusOutlined />} rows={5}
                            value="Share campaign tutorial step by step:
                          - The higher products customers buy, the better discount price they will get.
                          - Quantity step - price conflict: the higher quantity will be counted
                          For eq:
                            + Quantity 15, price 80
                            + Quantity 25, price 70
                            + Quantity 45, price 95
                            + Quantity 55, price 90
                            -> Quantity valid: 15-25
                            -> Quantity invalid: 45-55">
                          </Input.TextArea>
                        </Form.Item>
                      </>
                    )
                  }
                  }
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
              <Descriptions.Item label="Max quantity in campaign">
                {maxQuantity ?? ""}
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
