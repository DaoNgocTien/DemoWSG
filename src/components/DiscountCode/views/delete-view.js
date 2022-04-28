import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Space
} from "antd";
import Axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

import NumberFormat from "react-number-format";
//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  deleteDiscountCode: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => {},
  deleteDiscountCode: () => {},
  openModal: false,
  categoryList: [],
};

class DeleteModal extends Component {
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

  handleDeleteAndClose = (data) => {
    this.props.deleteDiscountCode(this.props.record?.id);
    this.props.closeModal();
  };

  handleCancel = () => {
    //   this.formRef.current.resetFields();
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
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Delete a record"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="danger"
                form="deleteDiscountCodeForm"
                key="submit"
                htmlType="submit"
              >
                Delete
              </Button>,
            ]}
          >
           <Form
            id="updateDiscountCodeForm"
            ref={this.formRef}
            onFinish={this.handleDeleteAndClose}
            layout="vertical"
          >
            <Space size={30}>
              <Form.Item
                label="Discount Code duration"
                name="date"
                initialValue={
                  [moment(this.props.record?.startdate),
                  moment(this.props.record?.enddate),]
                }
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <RangePicker
                disabled={true}
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
                  format="MM/DD/YYYY"
                  onChange={this.onChange}
                />
              </Form.Item>
              <Form.Item name="code" label="Code" initialValue={this.props.record?.code}
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
                <Input style={{ width: "60vh" }} placeholder="Code is required, length is 1-200 characters!" disabled={true}/>
              </Form.Item>
            </Space>
            <Space size={30}>
              <Form.Item name="discountPrice" initialValue={this.props.record?.discountprice} label="Discount price"
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
                help="Minimum discount price is 1000!"
              >
                <InputNumber min={1000} max={999999999999} style={{ width: "60vh" }} disabled={true}/>
              </Form.Item>
              {/* </Descriptions.Item>

          <Descriptions.Item label="Minimun price"> */}
              <Form.Item name="minimunPrice" initialValue={this.props.record?.minimunpricecondition} label="Minimun price"
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
                help="Minimum price to use discount code is 1000!"

              >
                <InputNumber style={{ width: "60vh" }} min={1000} max={999999999999} disabled={true}/>
              </Form.Item>
            </Space>



            <Space size={30}>
              <Form.Item
                name="description"
                label="Description"
                initialValue={this.props.record?.description}
              >
                <Input.TextArea style={{ width: "60vh" }} disabled={true}/>
              </Form.Item>
            </Space>
          </Form >
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
