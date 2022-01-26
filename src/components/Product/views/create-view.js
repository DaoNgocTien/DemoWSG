import React, { Component, memo } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
} from "antd";
import PropTypes from "prop-types";
import { Select, Upload, InputNumber } from "antd";
import moment from "moment";
import Axios from "axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  createCategory: PropTypes.func,
  defaultCategory: PropTypes.object,
  openModal: PropTypes.bool
};

//  default props
const propsDefault = {
  closeModal: () => { },
  createCategory: () => { },
  defaultCategory: {
    key: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
    id: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
    categoryname: "Ipad",
    supplierid: "99ba5ad1-612c-493f-8cdb-2c2af92ae95a",
    isdeleted: false,
    createdat: "2022-01-23T12:03:11.309Z",
    updatedat: "2022-01-23T12:03:11.309Z"
  },
  openModal: false,
};

class CreatModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };

  componentDidMount() {
    console.log(this.props);
  }

  handleCreateAndClose = (data) => {
    this.props.createCategory(data);
    this.props.closeModal();
  };

  handleCreate = (data) => {
    this.props.createCategory(data);
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

  handleCancel = () => this.setState({ previewVisible: false });

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
    console.log(this.state.fileList);
  };

  onFinish = (values) => {
    values.image = this.state.fileList;
    console.log(values);
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

  render() {
    const { openModal } = this.props;

    const { data, categoryList } = this.props;
    const { load, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <div className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800" style={{ textAlign: "center" }}>
          Add Product
        </h1>

        <div className="card-body">
          <div className="table-responsive">
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onFinish={(values) => {
                this.onFinish(values);
              }}
            >
              <Form.Item label="Name" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="Category" name="categoryId">
                <Select>
                  {categoryList.map((item) => (
                    <Select.Option key={item.key} value={item.id}>
                      {item.categoryname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="image" name="image">
                <>
                  <Upload
                    name="file"
                    action="/files/upload"
                    listType="picture-card"
                    fileList={this.state.fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {this.state.fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={this.state.previewVisible}
                    title={this.state.previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={this.state.previewImage}
                    />
                  </Modal>
                </>
              </Form.Item>
              <Form.Item
                label="Retail Price"
                name="retailPrice"
                initialValue={0}
              >
                <InputNumber min={0} default={0} />
              </Form.Item>
              <Form.Item label="Quantity" name="quantity" initialValue={0}>
                <InputNumber min={0} default={0} />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
              <Form.Item style={{ float: "right" }}>
                <Button type="text" className="button_submit" htmlType="submit">
                  <span className="btn btn-info">Submit</span>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(CreatModal, arePropsEqual);

