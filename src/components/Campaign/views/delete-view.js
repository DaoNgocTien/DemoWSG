import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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

class DeleteModal extends Component {
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

  handleCancel = () => {
    this.props.closeModal();
  };

  handleDeleteAndClose = () => {
    this.props.deleteCampaign(this.props.record?.id);
    this.formRef.current.resetFields();
    this.props.closeModal();
  }

  render() {
    const { openModal, defaultProduct } = this.props;
    const { productList, record } = this.props;
    const {
      productSelected,
      availableQuantity,
      minQuantity,
      maxQuantity,
      advancePercent,
      switchState,
    } = this.state;
    return (
      <>
        <Modal
          width={window.innerWidth * 0.7}
          heigh={window.innerHeight * 0.5}
          destroyOnClose={true}
          style={{
            top: 10,
          }}
          title="Delete Campaign"
          visible={openModal}
          onCancel={this.handleCancel}
          footer={[
            <Button key="cancel" onClick={this.handleCancel}>Cancel</Button>,
            <Button
              type="danger"
              form="deleteCampaignForm"
              key="submit"
              htmlType="submit"
            >
              Delete
            </Button>,
          ]}
        >
          <Form
            key={record?.key}
            name="formS"
            id="deleteCampaignForm"
            ref={this.formRef}
            onFinish={this.handleDeleteAndClose}
            layout="vertical"
          >
            <Space size={30}>
              <Form.Item
                initialValue={record?.description}
                name="description"
                label="Name"
              >
                <Input
                  disabled={true}
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
              >
                <RangePicker
                  disabled={true}
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
              >
                <Select
                  disabled={true}
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
                initialValue={record?.price}
                label="Wholsale Price"
                dependencies={[maxQuantity]}
              >
                <InputNumber
                  disabled={true}
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
              >
                <InputNumber
                  disabled={true}
                  ref={this.quantityRef}
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
              >
                <InputNumber
                  disabled={true}
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
              >
                <InputNumber
                  disabled={true}
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
              >
                <InputNumber
                  disabled={true}
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
                    disabled={true}
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
                  onChange={() => {
                  }}
                  initialValue={record?.range ?? []}
                >
                  {(fields, { remove }) => {
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
                                >
                                  <InputNumber
                                    addonAfter=" products"
                                    max={maxQuantity}
                                    disabled={true}
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
                              initialValue={advancePercent}
                            >
                              <InputNumber
                                disabled={true}
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
                {defaultProduct?.name ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {defaultProduct?.categoryname ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity in stock">
                {defaultProduct?.quantity ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Max quantity in campaign">
                {record?.maxquantity ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Retail price">
                <NumberFormat
                  value={defaultProduct?.retailprice ?? ""}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Wholesale price">
                <NumberFormat
                  value={record?.price ?? ""}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                <Input.TextArea
                  value={defaultProduct?.description ?? ""}
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
                    defaultProduct?.image
                      ? JSON.parse(defaultProduct?.image) : []
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

export default memo(DeleteModal, arePropsEqual);