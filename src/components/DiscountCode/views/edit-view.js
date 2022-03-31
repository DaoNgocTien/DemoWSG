import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select, Upload
} from "antd";
import Axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  updateDiscountCode: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => {},
  updateDiscountCode: () => {},
  openModal: false,
  categoryList: [],
};

class UpdateModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    // productSelected: null,
    // price: 1,
  };
  formRef = React.createRef();

  componentDidMount() {}

  handleUpdateAndClose = (data) => {
    // console.log(data);
    let newDiscountCode = {
      productId: data.productId,
      startDate: data.date[0],
      endDate: data.date[1],
      quantity: data.quantity,
      discountPrice: data.discountPrice,
      minimunPriceCondition: data.minimunPrice,
      // status: "private",
      code: data.code,
    };

    // console.log(newDiscountCode);
    this.props.updateDiscountCode(newDiscountCode, this.props.record?.id);
    // data.image = this.state.fileList;
    // this.props.updateProduct(data);
    // this.formRef.current.resetFields();
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

  handleChange = ({ fileList, file, event }) => {
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response[0].url;
        file.name = file.response[0].name;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };

  onFinish = (values) => {
    values.image = this.state.fileList;
    Axios({
      url: `/products`,
      method: "POST",
      data: values,
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        return window.location.replace("/products/catalog");
      })
      .catch((err) => console.error(err));
  };

  onSelectProduct = (value) => {
    this.setState({
      productSelected: this.props.productList?.find(
        (element) => element.id === value
      ),
    });
  };

  render() {
    const { RangePicker } = DatePicker;
    const { openModal } = this.props;

    const { productList, record } = this.props;

    if (this.props.loading || !this.props.record || !productList) {
      return <></>;
    }
    return (
      <>
        <Form
          id="updateDiscountCodeForm"
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
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="updateDiscountCodeForm"
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
                  initialValue={[
                    moment(this.props.record?.startdate),
                    moment(this.props.record?.enddate),
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
                    defaultValue={[
                      moment(this.props.record?.startdate),
                      moment(this.props.record?.enddate),
                    ]}
                    format="MM/DD/YYYY"
                    onChange={this.onChange}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Code">
                <Form.Item name="code" initialValue={this.props.record?.code}>
                  <Input defaultValue={this.props.record?.code} style={{ width: "60vh" }}/>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Discount price">
                <Form.Item
                  name="discountPrice"
                  initialValue={this.props.record?.discountprice}
                >
                  <InputNumber
                    defaultValue={this.props.record?.discountprice}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Minimun price">
                <Form.Item
                  name="minimunPrice"
                  initialValue={this.props.record?.minimunpricecondition}
                >
                  <InputNumber
                    defaultValue={this.props.record?.minimunpricecondition}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item
                  name="productId"
                  initialValue={this.props.record?.productid}
                >
                  <Select onChange={this.onSelectProduct} style={{ width: "60vh" }}>
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
                <Form.Item
                  name="quantity"
                  initialValue={this.props.record?.quantity}
                >
                  <InputNumber defaultValue={this.props.record?.quantity} style={{ width: "60vh" }}/>
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
export default memo(UpdateModal, arePropsEqual);
