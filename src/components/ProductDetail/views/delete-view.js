import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select, Space, Upload
} from "antd";
import React, { Component, memo } from "react";
class DeleteModal extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: undefined,
  };
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
        this.props.updateProduct(data);
        break;
    }

    this.setState({
      fileList: [],
    });
    this.props.closeModal();
  };

  handleCancel = () => {
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
    // 2. Read from response and show file link
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

  onChangeHandler = (e) => {
    let data = this.props.campaignList;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        String(item.status)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.description)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.quantity)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.maxquantity)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.numorder)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.advancefee)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.price).toUpperCase().includes(searchString.toUpperCase())
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };

  handleDeleteAndClose = (data) => {
    switch (this.props.record?.status) {
      case "incampaign":
        alert("This product in campaign cannot delete");
        break;

      default:
        this.props.deleteProduct(this.props.record?.id);
        break;
    }
    this.props.closeModal();
  };
  render() {
    const { openModal, record, data = [], categoryList } = this.props;
    const {
      load,
      fileList = JSON.parse(record?.image || "[]"),
    } = this.state;

    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    let listName = [];
    data.map((item) => {
      if (item.name !== record?.name) listName.push(item.name);
    });

    return (
      <>
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
              type="danger"
              form="deleteProductForm"
              key="submit"
              htmlType="submit"
            >
              Disable
            </Button>,
          ]}
        >
          <Form
            key={record?.id}
            id="deleteProductForm"
            onFinish={this.handleDeleteAndClose}
            layout="vertical"
          >
            <Form.Item
              label="Product ID"
              name="id"
              initialValue={record?.id}
              hidden="true"
            >
              <Input
                placeholder="Product ID"
                disabled={true}
                hidden={true}
              />
            </Form.Item>
            <Space size={30}>
              <Form.Item
                name="name"
                label="Product Name"
                initialValue={record?.name}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (listName.includes(value)) {
                        return Promise.reject(
                          new Error("Product Name exists!")
                        );
                      }
                      if (value.length > 0 && value.length <= 50) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "Product Name is required, length is 1-50 characters!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input
                  style={{ width: "60vh" }}
                  placeholder="Name is required, length is 1-50 characters"
                  disabled="true"
                />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                initialValue={record?.categoryid}
                rules={[
                  {
                    required: true,
                    message: "Category is required!",
                  },
                ]}
              >
                <Select style={{ width: "60vh" }} disabled="true">
                  {categoryList.map((item) => (
                    <Select.Option key={item.key} value={item.id}>
                      {item.categoryname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="quantity"
                label="Quantity"
                initialValue={record?.quantity}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Quantity is positive number!")
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  disabled="true"
                  min={Number(record?.maxquantity) + 1}
                  max={999999999999}
                  default={0}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
              <Form.Item
                label="Retail Price"
                name="retailPrice"
                initialValue={record?.retailprice}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Price is positive number!")
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={0}
                  max={999999999999}
                  default={0}
                  style={{ width: "60vh" }}
                  disabled="true"
                />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="description"
                label="Description"
                initialValue={record?.description}
                rules={[
                  {
                    required: true,
                    message: "Description is required!",
                  },
                ]}
              >
                <Input.TextArea
                  disabled="true"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  style={{ width: "60vh" }}
                  placeholder="Description is required!"
                />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image"
                rules={[
                  () => ({
                    validator(_) {
                      if (fileList.length >= 1) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Product Image is required!!")
                      );
                    },
                  }),
                ]}
              >
                <>
                  <Upload
                    disabled="true"
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

export default memo(DeleteModal, arePropsEqual);
