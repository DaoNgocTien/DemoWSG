import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Descriptions, Form, Input, InputNumber, Modal, Select, Upload } from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

import NumberFormat from "react-number-format";
//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  updateProduct: PropTypes.func,
  defaultProduct: PropTypes.object,
  openModal: PropTypes.bool,
  categoryList: PropTypes.array,
};

//  default props
const propsDefault = {
  closeModal: () => { },
  updateProduct: () => { },
  defaultProduct: {
    key: "e5d02fef-987d-4ecd-b3b2-890eb00fe2cc",
    id: "e5d02fef-987d-4ecd-b3b2-890eb00fe2cc",
    name: "test222 again Product",
    supplierid: "99ba5ad1-612c-493f-8cdb-2c2af92ae95a",
    retailprice: "5.00",
    quantity: 11,
    description: "testttttt",
    image: "",
    categoryid: null,
    status: "active",
    typeofproduct: "",
    createdat: "2022-01-07T14:08:02.994Z",
    updatedat: "2022-01-13T16:34:09.908Z",
    categoryname: null,
  },
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
  };
  formRef = React.createRef();

  componentDidMount() {
    // console.log(this.props);
  }

  handleUpdateAndClose = (data) => {
    switch (this.props.record?.status) {
      case "incampaign":
        alert("This product in campaign cannot update");
        break;

      default:
        data.image =
          this.state.fileList?.length === 0 && this.props.record
            ? JSON.parse(this.props.record?.image)
            : this.state.fileList;
        // console.log(data);
        this.props.updateProduct(data);
        break;
    }

    this.formRef.current.resetFields();
    this.setState({
      fileList: [],
    });
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.setState({
      fileList: undefined,
    });
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
    // fileList = fileList.slice(-2);
    // console.log(fileList);
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

  render() {
    const { openModal, record } = this.props;

    const { data, categoryList } = this.props;
    const { load, fileList = JSON.parse(record?.image || "[]") } = this.state;
    // this.state.fileList =
    //   this.props.record && this.state.fileList !== 0
    //     ? JSON.parse(this.props.record?.image)
    //     : [];
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    let listName = [];
    data.map(item => {
      if (item.name !== record?.name)
        listName.push(item.name);
    })
    return (
      <>
        <Form
          key={record?.id}
          id="updateProductForm"
          ref={this.formRef}
          onFinish={this.handleUpdateAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Edit a record"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="updateProductForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >

            <Form.Item
              label="Product ID"
              name="id"
              initialValue={record?.id}
              hidden="true"
            >
              <Input
                placeholder="Product ID"
                defaultValue={record?.id}
                disabled={true}
                hidden={true}
              />
            </Form.Item>

            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Name">
                <Form.Item name="name"
                  initialValue={record?.name}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Name is required!',
                    // },
                    () => ({
                      validator(_, value) {

                        if (listName.includes(value)) {
                          return Promise.reject(new Error('Product Name exists!'));
                        }
                        if (value.length >= 0 && value.length <= 20) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Product Name is required, length is 1-20 characters!'));
                      },
                    }),
                  ]}
                >
                  <Input style={{ width: "60vh" }} defaultValue={record?.name} placeholder="Name is required, length is 1-20 characters"/>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Category">
                <Form.Item name="categoryId"
                  initialValue={record?.categoryid}
                  rules={[
                    {
                      required: true,
                      message: 'Category is required!',
                    },
                    // ({ getFieldValue }) => ({
                    //   validator(_, value) {
                    //     if (value.length >= 0 && value.length <= 20) {
                    //       return Promise.resolve();
                    //     }

                    //     return Promise.reject(new Error('Category Name length is 1-20 characters!'));
                    //   },
                    // }),
                  ]}
                >
                  <Select style={{ width: "60vh" }} defaultValue={record?.categoryid}>
                    {categoryList.map((item) => (
                      <Select.Option key={item.key} value={item.id}>
                        {item.categoryname}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                <Form.Item name="quantity" initialValue={record?.quantity}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Quantity is required!',
                    // },
                    () => ({
                      validator(_, value) {
                        if (Number(value) > 0) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Quantity is positive number!'));
                      },
                    }),
                  ]}
                >
                  <InputNumber min={0} max={999999999999} style={{ width: "60vh" }} defaultValue={record?.quantity} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Retail Price" >
                <Form.Item
                  name="retailPrice"
                  initialValue={record?.retailprice}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Price is required!',
                    // },
                    () => ({
                      validator(_, value) {
                        if (Number(value) > 0) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Price is positive number!'));
                      },
                    }),
                  ]}
                >
                  <InputNumber min={0} max={999999999999} defaultValue={record?.retailprice} style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Description" >
                <Form.Item name="description"
                  initialValue={record?.description}
                  rules={[
                    {
                      required: true,
                      message: 'Description is required!',
                    },

                  ]}
                >
                  <Input.TextArea placeholder="Description is required!" autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "60vh" }} defaultValue={record?.description} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Image">
                <Form.Item name="image" rules={[
                  () => ({
                    validator(_) {
                      if (fileList.length >= 1) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Product Image is required!!'));
                    },
                  }),
                ]}
                >
                  <>
                    <Upload
                      name="file"
                      action="/files/upload"
                      listType="picture-card"
                      fileList={this.props.record ? fileList : []}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      style={{ width: "60vh" }}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    <Modal
                      visible={this.state.previewVisible}
                      title={this.state.previewTitle}
                      footer={null}
                      onCancel={this.handleCancelUploadImage}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={this.state.previewImage}
                      />
                    </Modal>
                  </>
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
