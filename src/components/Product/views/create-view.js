import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button, Form,
  Input, InputNumber, Modal, Select, Space, Upload
} from "antd";
import axios from "axios";
import React, { Component, memo } from "react";

class CreatModal extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };
  formRef = React.createRef();
  createProduct = record => {
    axios({
      url: `/products/`,
      method: "POST",
      data: record,
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        return this.props.createProduct();
      }
    })
      .catch(() => {
        return this.props.createProduct();
      })
  }

  handleCreateAndClose = (data) => {
    data.image = this.state.fileList;
    this.createProduct(data);
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
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

  handleChange = (data) => {
    let { fileList, file, event } = data;
    console.log(data)
    // 2. Read from response and show file link
    console.log(fileList)
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
        file.name = file.response.fileName;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };

  render() {
    const { openModal, categoryList, data } = this.props;
    const { load, fileList } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    let listName = [];
    data.map(record => {
      listName.push(record.name);
    })

    return (
      <>
        <Modal
          width={window.innerWidth * 0.7}
          heigh={window.innerHeight * 0.5}
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
              form="createProductForm"
              key="submit"
              htmlType="submit"
            >
              Submit
            </Button>,
          ]}
        >
          <Form
            key={listName}
            name="formS"
            id="createProductForm"
            ref={this.formRef}
            onFinish={this.handleCreateAndClose}
            layout="vertical"
          >
            <Space size={30}>
              <Form.Item name="name" label="Product Name"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {

                      if (listName.includes(value)) {
                        return Promise.reject(new Error('Product Name exists!'));
                      }
                      if (value.length > 0 && value.length <= 50) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Product Name is required, length is 1-50 characters!'));
                    },
                  }),
                ]}
              >
                <Input style={{ width: "60vh" }} placeholder="Name is required, length is 1-50 characters" />
              </Form.Item>
              <Form.Item name="categoryId" label="Category"
                rules={[
                  {
                    required: true,
                    message: 'Category is required!',
                  },
                ]}
              >
                <Select style={{ width: "60vh" }}>
                  {categoryList.map((item) => (
                    <Select.Option key={item.key} value={item.id}>
                      {item.categoryname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item name="quantity" initialValue={0} label="Quantity"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Quantity is positive number!'));
                    },
                  }),
                ]}
              >
                <InputNumber min={0} max={999999999999} default={0} style={{ width: "60vh" }} />
              </Form.Item>
              <Form.Item
                label="Retail Price"
                name="retailPrice"
                initialValue={0}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Price is positive number!'));
                    },
                  }),
                ]}
              >
                <InputNumber min={0} max={999999999999} default={0} style={{ width: "60vh" }} />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                label="Weight"
                name="weight"
                initialValue={0}
                required
              >
                <InputNumber min={0} default={0} style={{ width: "60vh" }} addonAfter="Kg" />
              </Form.Item>
              <Form.Item name="description" label="Description"
                rules={[
                  {
                    required: true,
                    message: 'Description is required!',
                  },

                ]}
              >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "60vh" }} placeholder="Description is required!" />
              </Form.Item>
            </Space>
            <Space size={30}>
              <Form.Item name="image" label="Image"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
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
                    fileList={this.state.fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    style={{ width: "60vh" }}
                  >
                    {this.state.fileList.length >= 8 ? null : uploadButton}
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
            </Space>
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
export default memo(CreatModal, arePropsEqual);

