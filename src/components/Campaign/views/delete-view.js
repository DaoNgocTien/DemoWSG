import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select, Switch, Upload
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";

const propsProTypes = {
  closeModal: PropTypes.func,
  deleteCampaign: PropTypes.func,
};

const propsDefault = {
  closeModal: () => { },
  deleteCampaign: () => { },
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
  };
  formRef = React.createRef();

  componentDidMount() { }

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

  // handleCancelUploadImage = () => this.setState({ previewVisible: false });

  // handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await this.getBase64(file.originFileObj);
  //   }

  //   this.setState({
  //     previewImage: file.url,
  //     previewVisible: true,
  //     previewTitle:
  //       file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
  //   });
  // };

  // handleChange = ({ fileList, file, event }) => {
  //   fileList = fileList.slice(-2);

  //   fileList = fileList.map((file) => {
  //     if (file.response) {
  //       file.url = file.response[0].url;
  //       file.name = file.response[0].name;
  //       file.thumbUrl = null;
  //     }
  //     return file;
  //   });

  //   this.setState({ fileList });
  // };

  onSelectProduct = (value) => {
    this.setState({
      productSelected: this.props.productList?.find(
        (element) => element.id === value
      ),
    });
  };

  onChangePrice = (value) => {
    this.setState({
      price: value,
    });
  };

  render() {
    const { RangePicker } = DatePicker;
    const { openModal } = this.props;
    const { fileList } = this.state;
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
          id="deleteCampaignForm"
          ref={this.formRef}
          onFinish={this.handleDeleteAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Delete"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel} key="btnCancel">
                Cancel
              </Button>,
              <Button
                type="primary"
                form="deleteCampaignForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Descriptions layout="vertical" column={2}>
              {/* <Descriptions.Item label="Name">
                <Form.Item name="description" initialValue={record.description}
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
                  <Input disabled={true} style={{ width: "60vh" }} placeholder="Name is required, length is 1-50 characters" />
                </Form.Item>
              </Descriptions.Item> */}
              <Descriptions.Item label="Campaign duration">
                <Form.Item
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
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item name="productId" initialValue={record.productid}>
                  <Select
                    disabled={true}
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
                <Form.Item name="quantity" initialValue={record.quantity}>
                  <InputNumber
                    disabled={true}
                    addonAfter=" products"
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Max Quantity">
                <Form.Item
                  name="maxQuantity"
                  initialValue={record?.maxquantity}
                >
                  <InputNumber
                    disabled={true}
                    addonAfter=" products"
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Advance Percent">
                <Form.Item
                  name="advancePercent"
                  initialValue={record?.advancefee}
                >
                  <InputNumber
                    disabled={true}
                    addonAfter="%"
                    min={0}
                    max={100}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Share">
                <Form.Item name="isShare" initialValue={record?.isshare}>
                  <Switch
                    disabled={true}
                    checked={shareChecked}
                    onClick={() => {
                      this.setState({ shareChecked: !shareChecked });
                    }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale percent">
                <Form.Item
                  name="wholesalePercent"
                  initialValue={
                    (this.props.record?.price / productSelected?.retailprice) *
                    100
                  }
                >
                  <NumberFormat
                    value={(this.props.record?.price / productSelected?.retailprice) * 100}
                    thousandSeparator={true}
                    suffix={" VND"}
                    decimalScale={0}
                    displayType="text"
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
                <NumberFormat
                  value=
                  {productSelected?.retailprice ?? ""}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Wholesale price">
                <NumberFormat
                  value=
                  {(this.state.price * productSelected?.retailprice) / 100 ?? ""}
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

export default memo(DeleteModal, arePropsEqual);
