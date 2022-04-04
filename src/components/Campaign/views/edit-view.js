import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select, Switch, Upload
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  openModal: PropTypes.bool,
};

const propsDefault = {
  closeModal: () => { },
  updateCampaign: () => { },
  openModal: false,
};

class UpdateModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],

    price: 0,
    productSelected: undefined,
    availableQuantity: 10,
    minQuantity: null,
    maxQuantity: null,
  };
  formRef = React.createRef();

  componentDidMount() { }

  handleUpdateAndClose = (data) => {
    switch (this.props.record?.status) {
      case "active":
        alert("This campaign is actived");
        break;
      case "done":
        alert("This campaign is done");
        break;
      default: {
        const productSelected = !this.state.productSelected
          ? this.props.productList?.find(
            (element) => element.id === this.props.record?.productid
          )
          : this.state.productSelected;
        let newCampaign = {
          id: this.props.record?.id,
          productId: data.productId,
          fromDate: data.date[0].format("MM/DD/YYYY"),
          toDate: data.date[1].format("MM/DD/YYYY"),
          quantity: data.quantity,
          price: (data.wholesalePercent * productSelected.retailprice) / 100,
          maxQuantity: data.maxQuantity,
          isShare: data.isShare,
          advanceFee: data.advancePercent,
        };

        this.props.updateCampaign(newCampaign);
        break;
      }
    }
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleCancelUploadImage = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = ({ fileList }) => {
    fileList = fileList.slice(-2);

    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response[0].url;
        file.name = file.response[0].name;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
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

  render() {
    const { RangePicker } = DatePicker;
    const { openModal } = this.props;
    const {
      fileList,
      price = 0,
      availableQuantity,
      minQuantity,
      maxQuantity } = this.state;
    const { productList, record } = this.props;
    const {
      productSelected = this.props.productList?.find(
        (element) => element.id === this.props.record?.productid
      ) || {},
      shareChecked = record?.isshare,
    } = this.state;

    this.state.price =
      this.state.price === 0 || !this.state.price
        ? (this.props.record?.price / productSelected?.retailprice) * 100
        : this.state.price;

    if (this.props.loading || !this.props.record) {
      return <></>;
    }
    return (
      <>
        <Form
          id="updateCampaignForm"
          ref={this.formRef}
          onFinish={this.handleUpdateAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Update"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel} key="btnCancel">
                Cancel
              </Button>,
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
            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Campaign duration">
                <Form.Item
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
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item name="productId" initialValue={record.productid}
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
                  <Select
                    onChange={this.onSelectProduct}
                    style={{ width: "60vh" }}
                  >
                    {productList?.map((item) => {
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
                <Form.Item name="quantity" initialValue={record.quantity}
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
                      // if (value.length > 0 && value.length <= 200) {
                      //   return Promise.resolve();
                      // }

                      // return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                      validator(_, value) {

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
                    max={390}
                    style={{ width: "60vh" }}
                    placeholder="Quantity is 10 -> maximum available quantity in stock!"
                    onChange={(e) => this.onChangeQuantity(e, "min")}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Max Quantity">
                <Form.Item
                  name="maxQuantity"
                  initialValue={record?.maxquantity}
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
                    max={390}
                    style={{ width: "60vh" }}
                    onChange={(e) => this.onChangeQuantity(e, "max")}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Advance Percent">
                <Form.Item
                  name="advancePercent"
                  initialValue={record?.advancefee}
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
                    min={0}
                    max={100}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale percent"
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
                <Form.Item
                  name="wholesalePercent"
                  initialValue={
                    (this.props.record?.price / productSelected?.retailprice) *
                    100
                  }
                >
                  <InputNumber
                    addonAfter="%"
                    onChange={this.onChangePrice}
                    min={0}
                    max={100}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Share">
                <Form.Item name="isShare" initialValue={record?.isshare}>
                  <Switch
                    checked={shareChecked}
                    onClick={() => {
                      this.setState({ shareChecked: !shareChecked });
                    }}
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
                {minQuantity && maxQuantity ? minQuantity + " -> " + maxQuantity : record.quantity + " -> " + record.maxquantity}
              </Descriptions.Item>
              <Descriptions.Item label="Retail price">
                {productSelected?.retailprice ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Wholesale price">
                {(this.state.price * productSelected?.retailprice) / 100 ?? ""}
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

export default memo(UpdateModal, arePropsEqual);
