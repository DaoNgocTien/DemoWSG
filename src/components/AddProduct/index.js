import React, { Component } from "react";
import { getAllDataForProduct } from "./modules/action";
import { connect } from "react-redux";
import { Form, Input, Button, Select, Upload, Modal, InputNumber } from "antd";
import moment from "moment";
import Axios from "axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import Loader from "../Loader";

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
    };
  }
  componentDidMount() {
    this.props.getAllDataForProduct();
  }

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
        file.thumbUrl = null
      }
      return file;
    });

    this.setState({ fileList });
    console.log(this.state.fileList);
  };

  onFinish = (values) => {
    values.image = this.state.fileList
    console.log(values);
    Axios({
      url: `/products`,
      method: "POST",
      data: values,
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        // return window.location.replace("/branchProduct");
      })
      .catch((err) => console.error(err));
  };
  render() {
    const { loading, data } = this.props;
    if (loading) return <Loader />;
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
              <Form.Item label="Category" name="categoryid">
                <Select>
                  {data.categories.map((item) => (
                    <Select.Option key={item.Id} value={item.Id}>
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
              <Form.Item label="Retail Price" name="retailPrice">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="Wholesale Price" name="wholesalePrice">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="Quantity" name="quantity">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                label="Quantity For Wholesale"
                name="quantityForWholesale"
              >
                <InputNumber />
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

const mapStateToProps = (state) => {
  return {
    loading: state.addProductReducer.loading,
    data: state.addProductReducer.data,
    error: state.addProductReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDataForProduct: () => {
      dispatch(getAllDataForProduct());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
