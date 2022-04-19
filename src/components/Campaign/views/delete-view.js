import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select, Switch, Upload, Tooltip, Space, Typography
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo, createRef } from "react";
import NumberFormat from "react-number-format";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TimelineItem from "antd/lib/timeline/TimelineItem";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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

class DeleteModal extends Component {
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
      compareArr: []
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

  handleCreateAndClose = (data) => {
    console.log(data);
    // console.log(this.state.productSelected);
    const productSelected =
      this.state.productSelected === {} || !this.state.productSelected
        ? this.props.productList[0]
        : this.state.productSelected;
    // console.log(data);
    let newCampaign = {};
    if (this.state.switchState) {

      //  Remove duplicate step
      data.quantities = data.quantities.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.quantity === value.quantity && t.price >= value.price
        ))
      )
      //  Sort list step decrease
      data.quantities.sort(function (a, b) { return b.quantity - a.quantity });

      //  Find the invalid item and push to error array
      let errArr = [];
      // let compareArr = [];
      data.quantities.map(item => {
        data.quantities.map(item2 => {
          if (item.quantity != item2.quantity) {
            if (item.quantity > item2.quantity && item.price > item2.price) {
              errArr.push(item);
              // compareArr.push(item2);
            }
          }
        })

      })

      //  Remove item to make valid final array
      let datas = data.quantities.filter(item => {
        console.log(!errArr.includes(item));
        return !errArr.includes(item);
      })

      //  Change % price to numeric price
      datas.map(item => {
        return item.price = item.price * data.wholesalePrice / 100;
      })

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
        range: []

      }
      this.props.createCampaign(newCampaign);
      this.props.closeModal();
    }

  };

  handleCancel = () => {
    // this.formRef.current.resetFields();
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
      // minWholesalePrice: productSelected.retailprice < 5000 ? 5000 : 
    });
    // console.log(productSelected)
    // console.log(this.state.availableQuantity)
    // console.log(this.state.productSelected)
    // console.log(productSelected.quantity)
    // console.log(productQuantityOfExistCampaign)
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
        })
        break;
      case "max":
        this.setState({
          maxQuantity: value,
        })
        break;
    }

  }
  onChangeAdvancePercent = (value) => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      advancePercent: value,
      // minSharedAdvancedPercent: 
    });
  }
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  toggleSwitch = () => {
    this.setState({
      switchState: !this.state.switchState,
    })
    this.quantityRef.current.value = 1;

  };
  showStepErr = () => {
    const { errArr = [], compareArr = [] } = this.state.errStepArr;
    let errMes = "";

    for (let index = 0; index < errArr.length; index++) {
      const element = errArr[index];
      errMes += "Conflict step: " + errArr[index].quantity + " " + errArr[index].price + " - " + compareArr[index].quantity + " " + compareArr[index].price + "\n";
    }
    // this.setState({
    //   errMes: errMes,
    // })
    return <Text type="danger">{errMes}</Text>

  }
  clearStepErr = () => {
    this.setState({
      errMes: "",
    })
  }

  handleDeleteAndClose = (data) => {
    switch (this.props.record?.status) {
      case "active":
        alert("This campaign is actived");
        break;
      case "done":
        alert("This campaign is done");
        break;
      default:
        this.props.deleteCampaign(this.props.record?.id);
        break;
    }
    this.props.closeModal();
  };
  render() {
    const { openModal } = this.props;

    const { productList, record } = this.props;
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
    } =
      this.state;
    console.log(productSelected)
    return (
      <>

        <Modal
          width={window.innerWidth * 0.7}
          heigh={window.innerHeight * 0.5}
          destroyOnClose={true}
          style={{
            top: 10,
          }}
          // okButtonProps={{form:'createCampaignForm', key: 'submit', htmlType: 'submit'}}
          title="Add New"
          visible={openModal}
          onCancel={this.handleCancel}
          footer={[
            <Button onClick={this.handleCancel}>Cancel</Button>,
            <Button
              type="danger"
              form="deleteCampaignForm"
              key="submit"
              htmlType="submit"
            // onClick={() =>this.formRef.current.submit()}
            >
              Delete
            </Button>,
          ]}
        >
          <Form
            id="deleteCampaignForm"
            ref={this.formRef}
            onFinish={this.handleDeleteAndClose}

            layout="vertical"
          // key={productList[0]?.id}
          >


            <Space size={30}>
              <Form.Item name="description" label="Name" initialValue={record?.description}
                rules={[
                  {
                    required: true,
                    message: 'Name is required!',
                  },
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
                <Input  disabled="true" style={{ width: "60vh" }} placeholder="Name is required, length is 1-50 characters!" />

              </Form.Item>
              <Form.Item
                label="Campaign duration"
                name="date"
                initialValue={[
                  moment(this.props.record?.fromdate),
                  moment(this.props.record?.todate),
                ]}
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
                 disabled="true"
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
            </Space>

            <Space size={30}>
              <Form.Item name="productId" label="Product"
                initialValue={record.productid}
                rules={[
                  {
                    required: true,
                    // message: 'Name is required!',
                  },
                  () => ({
                    validator(_, value) {
                      if (Number(productSelected?.retailprice) * Number(availableQuantity) < 5000) {
                        return Promise.reject(new Error('Unable to use product'));
                      }
                      return Promise.resolve();
                    }
                  }),
                ]}
              >
                <Select
                 disabled="true"
                  onChange={this.onSelectProduct}
                  style={{ width: "60vh" }}
                >
                  {productList.map((item) => {
                    //  Bỏ qua product mà quantity available * giá retail <= 5000
                    if ([item.quantity - item.maxquantity] * Number(item.retailprice) > 5000)
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
                rules={[
                  {
                    required: true,
                    message: 'Price is required!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const min = switchState ? 0 : 9;
                      const maxQuantity = getFieldValue('maxQuantity');
                      const quantity = getFieldValue('quantity');
                      const advancePercent = getFieldValue('advancePercent');
                      const range = Number(productSelected?.retailprice) ?? 999999999999;
                      // console.log(value * quantity * advancePercent)
                      if (value * quantity * advancePercent < 500000) {
                        return Promise.reject(new Error('Advance percent has to be >= 5000 VND, at least ' + (500000 / (value * quantity) + 1).toFixed() + " %"));
                      }
                      if (value >= 0 && value <= range) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Wholesale maximum price is product retail price!'));

                    }
                  })
                ]}
              >
                <InputNumber
                 disabled="true"
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
                initialValue={record?.quantity}
                label="Quantity"
                tooltip="In single campaign, quantity is the minimum amount of products customer has to buy to end campaign successfully.
                In shared campaign, quantity is the minimum product customer has to order to join the campaign, default 1"
                rules={[
                  // {
                  //   required: true,
                  //   message: 'Name is required!',
                  // },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const min = switchState ? 0 : 9;
                      const maxQuantity = getFieldValue('maxQuantity');
                      const wholesalePrice = getFieldValue('wholesalePrice');
                      const advancePercent = getFieldValue('advancePercent');
                      if (maxQuantity < value) {
                        return Promise.reject(new Error('Quantity can not bigger than max quantity!'));
                      }
                      // console.log(value * wholesalePrice * advancePercent);
                      if (value * wholesalePrice * advancePercent < 500000) {
                        return Promise.reject(new Error('Advance percent has to be >= 5000 VND, at least ' + (500000 / (value * wholesalePrice) + 1).toFixed() + " %"));
                      }
                      if (value > min) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Number of product is positive number!'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  ref={this.quantityRef}
                  disabled="true"
                  addonAfter=" products"
                  min={this.state.switchState ? "1" : "10"}
                  max={availableQuantity}
                  style={{ width: "60vh" }}
                  placeholder={"Quantity is" + this.state.switchState ? "1" : "10" + " -> maximum available quantity in stock!"}
                  onChange={(e) => this.onChangeQuantity(e, "min")}
                />
              </Form.Item>

              <Form.Item name="maxQuantity" label="Max Quantity" initialValue={record?.maxquantity}
                rules={[
                  // {
                  //   required: true,
                  //   message: 'Name is required!',
                  // },
                  ({ getFieldValue }) => ({
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
              >
                <InputNumber
                  addonAfter=" products"
                  min={switchState ? 1 : minQuantity}
                  max={availableQuantity}
                  style={{ width: "60vh" }}
                  onChange={(e) => this.onChangeQuantity(e, "max")}
                  disabled="true"
                />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item name="advancePercent" label="Advance Percent" initialValue={record?.advancefee}
                rules={[
                  {
                    required: true,
                    message: 'Price is required!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const range = Number(productSelected?.retailprice) ?? 999999999999;
                      const quantity = getFieldValue('quantity');
                      const wholesalePrice = getFieldValue('wholesalePrice');
                      const advancePercent = getFieldValue('advancePercent');
                      if (wholesalePrice * quantity * value <= 500000) {
                        return Promise.reject(new Error('Advance percent to be > 5000, at least ' + (500000 / (minWholesalePrice * maxQuantity) + 1).toFixed() + " %"));
                      }
                      return Promise.resolve();

                    }
                  })
                ]}
              >
                <InputNumber
                 disabled="true"
                  addonAfter="%"
                  onChange={this.onChangeAdvancePercent}
                  min={1}
                  max={99}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
              <Form.Item name="advancePercen2" initialValue={1} label="Advance Percent" hidden="true"
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
                 disabled="true"
                  addonAfter="%"
                  // defaultValue={0}
                  min={1}
                  max={99}
                  style={{ width: "60vh" }}
                />
              </Form.Item>

            </Space>
            <Space size={30}>
              <Form.Item
                initialValue={record?.isshare ? true : false}
                label="Campaign type"
                name="isShare"
                tooltip="In single campaign, a customer buy all products at once and campaign is done. In shared campaign, customers can buy products at any amount and the final price will depend on the campaign steps!!"
              >
                <Space style={{ width: "60vh" }} size={20}>
                  <Switch onClick={this.toggleSwitch}  disabled="true" style={{ marginRight: "20" }} />
                  {this.state.switchState ? "Shared: more buyer more discount" : "Single: buy all at once"}

                </Space>
              </Form.Item>
            </Space>
            {!switchState ? "" :
              //  Shared
              <>

                <Form.List
                  name="quantities"

                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(field => (
                        <Space key={field.key} align="baseline" size={30}>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label="Quantity Up To"
                                name={[field.name, 'quantity']}
                                initialValue={maxQuantity}
                              >
                                <InputNumber
                                  addonAfter=" products"
                                  max={maxQuantity}

                                  min={switchState ? 1 : minQuantity}
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
                                message: 'Wholesale price percent is required',
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const min = switchState ? 0 : 9;
                                  const quantity = getFieldValue('quantity');
                                  const wholesalePrice = getFieldValue('wholesalePrice');
                                  const advancePercent = getFieldValue('advancePercent');
                                  console.log(quantity * advancePercent * wholesalePrice * value);
                                  console.log(500000 / (quantity * advancePercent * wholesalePrice));
                                  const { errArr = [], compareArr = [] } = errStepArr;

                                  if (quantity * advancePercent * wholesalePrice * value < 5000 * 100 * 100) {
                                    return Promise.reject(new Error('Wholesale price percent in this step is invalid due to advance percent < 5000, at least ' + (50000000 / (quantity * wholesalePrice * value) + 1).toFixed() + " %"))
                                  }
                                  return Promise.resolve();
                                }
                              })

                            ]}
                            initialValue={advancePercent}
                          >
                            <InputNumber
                              addonAfter="% of wholesale campaign price"
                              min={1}
                              max={99}
                              style={{ width: "60vh" }}
                            />
                          </Form.Item>

                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}

                      <Form.Item>
                        <Button  disabled="true" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Campaign Discount Step
                        </Button>
                      </Form.Item>
                      <Form.Item>
                        <Input.TextArea disabled="true" block icon={<PlusOutlined />} rows={5}
                          value="Share campaign tutorial step by step:
                          - The higher products customers buy, the better discount price they will get.
                          - Quantity step - % price conflict: the higher quantity will be counted
                          For eq:
                            + Quantity 15, % price 80
                            + Quantity 25, % price 70
                            + Quantity 45, % price 95
                            + Quantity 55, % price 90
                            -> Quantity valid: 15-25
                            -> Quantity invalid: 45-55">
                        </Input.TextArea>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </>
            }



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
                {productSelected ? switchState ? 1 : minQuantity + " -> " + maxQuantity : ""}
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

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(DeleteModal, arePropsEqual);

// import {
//   Button, DatePicker, Descriptions, Form,
//   Input, InputNumber, Modal, Select, Switch, Upload
// } from "antd";
// import moment from "moment";
// import PropTypes from "prop-types";
// import React, { Component, memo } from "react";
// import NumberFormat from "react-number-format";

// const propsProTypes = {
//   closeModal: PropTypes.func,
//   deleteCampaign: PropTypes.func,
// };

// const propsDefault = {
//   closeModal: () => { },
//   deleteCampaign: () => { },
// };

// class DeleteModal extends Component {
//   static propTypes = propsProTypes;
//   static defaultProps = propsDefault;
//   state = {
//     previewVisible: false,
//     previewImage: "",
//     previewTitle: "",
//     fileList: [],

//     price: 0,
//   };
//   formRef = React.createRef();

//   componentDidMount() { }

//   handleDeleteAndClose = (data) => {
//     switch (this.props.record?.status) {
//       case "active":
//         alert("This campaign is actived");
//         break;
//       case "done":
//         alert("This campaign is done");
//         break;
//       default:
//         this.props.deleteCampaign(this.props.record?.id);
//         break;
//     }
//     this.props.closeModal();
//   };

//   handleCancel = () => {
//     this.formRef.current.resetFields();
//     this.props.closeModal();
//   };

//   getBase64(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   }

//   // handleCancelUploadImage = () => this.setState({ previewVisible: false });

//   // handlePreview = async (file) => {
//   //   if (!file.url && !file.preview) {
//   //     file.preview = await this.getBase64(file.originFileObj);
//   //   }

//   //   this.setState({
//   //     previewImage: file.url,
//   //     previewVisible: true,
//   //     previewTitle:
//   //       file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
//   //   });
//   // };

//   // handleChange = ({ fileList, file, event }) => {
//   //   fileList = fileList.slice(-2);

//   //   fileList = fileList.map((file) => {
//   //     if (file.response) {
//   //       file.url = file.response[0].url;
//   //       file.name = file.response[0].name;
//   //       file.thumbUrl = null;
//   //     }
//   //     return file;
//   //   });

//   //   this.setState({ fileList });
//   // };

//   onSelectProduct = (value) => {
//     this.setState({
//       productSelected: this.props.productList?.find(
//         (element) => element.id === value
//       ),
//     });
//   };

//   onChangePrice = (value) => {
//     this.setState({
//       price: value,
//     });
//   };

//   render() {
//     const { RangePicker } = DatePicker;
//     const { openModal } = this.props;
//     const { fileList } = this.state;
//     const { productList, record } = this.props;
//     const {
//       productSelected = this.props.productList?.find(
//         (element) => element.id === this.props.record?.productid
//       ) || {},
//       shareChecked = record?.isshare,
//     } = this.state;

//     this.state.price =
//       this.state.price === 0 || !this.state.price
//         ? (this.props.record?.price / productSelected?.retailprice) * 100
//         : this.state.price;

//     if (this.props.loading || !this.props.record) {
//       return <></>;
//     }
//     return (
//       <>
//         <Form
//           id="deleteCampaignForm"
//           ref={this.formRef}
//           onFinish={this.handleDeleteAndClose}
//         >
//           <Modal
//             width={window.innerWidth * 0.7}
//             heigh={window.innerHeight * 0.5}
//             style={{
//               top: 10,
//             }}
//             title="Delete"
//             visible={openModal}
//             onCancel={this.handleCancel}
//             footer={[
//               <Button onClick={this.handleCancel} key="btnCancel">
//                 Cancel
//               </Button>,
//               <Button
//                 type="primary"
//                 form="deleteCampaignForm"
//                 key="submit"
//                 htmlType="submit"
//               >
//                 Submit
//               </Button>,
//             ]}
//           >
//             <Descriptions layout="vertical" column={2}>
//               <Descriptions.Item label="Name">
//                 <Form.Item name="description" initialValue={record.description}
//                   rules={[
//                     // {
//                     //   required: true,
//                     // },
//                     () => ({
//                       validator(_, value) {

//                         // if (listName.includes(value)) {
//                         //   return Promise.reject(new Error('Product Name exists!'));
//                         // }
//                         if (value.length > 0 && value.length <= 50) {
//                           return Promise.resolve();
//                         }

//                         return Promise.reject(new Error('Name is required, length is 1-50 characters!'));

//                         // validator(_, value) {

//                         //   if (Number(value) > 9) {
//                         //     return Promise.resolve();
//                         //   }

//                         //   return Promise.reject(new Error('Number of product is positive number!'));
//                         // },
//                       }
//                     }),
//                   ]}
//                 >
//                   <Input disabled={true} style={{ width: "60vh" }} placeholder="Name is required, length is 1-50 characters" />
//                 </Form.Item>
//               </Descriptions.Item>
//               <Descriptions.Item label="Campaign duration">
//                 <Form.Item
//                   name="date"
//                   initialValue={[
//                     moment(this.props.record?.fromdate),
//                     moment(this.props.record?.todate),
//                   ]}
//                 >
//                   <RangePicker
//                     disabled={true}
//                     ranges={{
//                       Today: [moment(), moment()],
//                       "This Week": [
//                         moment().startOf("week"),
//                         moment().endOf("week"),
//                       ],
//                       "This Month": [
//                         moment().startOf("month"),
//                         moment().endOf("month"),
//                       ],
//                     }}
//                     format="MM/DD/YYYY"
//                     onChange={this.onChange}
//                     style={{ width: "60vh" }}
//                   />
//                 </Form.Item>
//               </Descriptions.Item>

//               <Descriptions.Item label="Product">
//                 <Form.Item name="productId" initialValue={record.productid}>
//                   <Select
//                     disabled={true}
//                     onChange={this.onSelectProduct}
//                     style={{ width: "60vh" }}
//                   >
//                     {productList?.map((item) => {
//                       return (
//                         <Select.Option key={item.key} value={item.id}>
//                           {item.name}
//                         </Select.Option>
//                       );
//                     })}
//                   </Select>
//                 </Form.Item>
//               </Descriptions.Item>

//               <Descriptions.Item label="Quantity">
//                 <Form.Item name="quantity" initialValue={record.quantity}>
//                   <InputNumber
//                     disabled={true}
//                     addonAfter=" products"
//                     style={{ width: "60vh" }}
//                   />
//                 </Form.Item>
//               </Descriptions.Item>

//               <Descriptions.Item label="Max Quantity">
//                 <Form.Item
//                   name="maxQuantity"
//                   initialValue={record?.maxquantity}
//                 >
//                   <InputNumber
//                     disabled={true}
//                     addonAfter=" products"
//                     style={{ width: "60vh" }}
//                   />
//                 </Form.Item>
//               </Descriptions.Item>

//               <Descriptions.Item label="Advance Percent">
//                 <Form.Item
//                   name="advancePercent"
//                   initialValue={record?.advancefee}
//                 >
//                   <InputNumber
//                     disabled={true}
//                     addonAfter="%"
//                     min={0}
//                     max={100}
//                     style={{ width: "60vh" }}
//                   />
//                 </Form.Item>
//               </Descriptions.Item>

//               <Descriptions.Item label="Share">
//                 <Form.Item name="isShare" initialValue={record?.isshare}>
//                   <Switch
//                     disabled={true}
//                     checked={shareChecked}
//                     onClick={() => {
//                       this.setState({ shareChecked: !shareChecked });
//                     }}
//                   />
//                 </Form.Item>
//               </Descriptions.Item>

//               <Descriptions.Item label="Wholesale discount percent">
//                 <Form.Item
//                   name="wholesalePercent"
//                   initialValue={
//                     (this.props.record?.price / productSelected?.retailprice) *
//                     100
//                   }
//                 >
//                   <NumberFormat
//                     value={(this.props.record?.price / productSelected?.retailprice) * 100}
//                     thousandSeparator={true}
//                     suffix={" VND"}
//                     decimalScale={0}
//                     displayType="text"
//                   />
//                 </Form.Item>
//               </Descriptions.Item>
//             </Descriptions>

//             <Descriptions bordered title="Product in campaign" column={2}>
//               <Descriptions.Item label="Name">
//                 {productSelected?.name ?? ""}
//               </Descriptions.Item>
//               <Descriptions.Item label="Category">
//                 {productSelected?.categoryname ?? ""}
//               </Descriptions.Item>
//               <Descriptions.Item label="Quantity in stock">
//                 {productSelected?.quantity ?? ""}
//               </Descriptions.Item>
//               <Descriptions.Item label="Quantity in campaign">
//                 {productSelected?.name ?? ""}
//               </Descriptions.Item>
//               <Descriptions.Item label="Retail price">
//                 <NumberFormat
//                   value=
//                   {productSelected?.retailprice ?? ""}
//                   thousandSeparator={true}
//                   suffix={" VND"}
//                   decimalScale={0}
//                   displayType="text"
//                 />
//               </Descriptions.Item>
//               <Descriptions.Item label="Wholesale price">
//                 <NumberFormat
//                   value=
//                   {(this.state.price * productSelected?.retailprice) / 100 ?? ""}
//                   thousandSeparator={true}
//                   suffix={" VND"}
//                   decimalScale={0}
//                   displayType="text"
//                 />
//               </Descriptions.Item>
//               <Descriptions.Item label="Description">
//                 <Input.TextArea
//                   value={productSelected?.description}
//                   rows={5}
//                   bordered={false}
//                 />
//               </Descriptions.Item>
//               <Descriptions.Item label="Image">
//                 <Upload
//                   name="file"
//                   action="/files/upload"
//                   listType="picture-card"
//                   fileList={
//                     productSelected?.image
//                       ? JSON.parse(productSelected?.image)
//                       : []
//                   }
//                 >
//                   {/* {this.state.fileList.length >= 8 ? null : uploadButton} */}
//                 </Upload>
//               </Descriptions.Item>
//             </Descriptions>
//           </Modal>
//         </Form>
//       </>
//     );
//   }
// }

// const arePropsEqual = (prevProps, nextProps) => {
//   return prevProps === nextProps;
// };

// export default memo(DeleteModal, arePropsEqual);
