import React, { Component } from "react";
import { getAllDataForProduct } from "./modules/action";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Modal,
  InputNumber,
  Popconfirm,
} from "antd";
import moment from "moment";
import Axios from "axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import Loader from "../Loader";
import { Redirect } from "react-router";

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
      DeleteModal: false,
    };
  }
  componentDidMount() {
    this.props.getAllDataForProduct(this.props.match.params.id);
    if (this.props.data?.product.image) {
      this.setState({ fileList: JSON.parse(this.props.data?.product.image) });
    }
  }
  deleteConfirm = () => {
    Axios({
      url: `/products/${this.props.match.params.id}`,
      method: "DELETE",
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        // console.log(response);
        return this.props.history.push("/products/catalog")
      }
    });
    this.setState({
      DeleteModel: false,
    });
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
  };

  onFinish = (values) => {
    values.image = JSON.stringify(this.state.fileList);
    values.quantity = parseInt(values.quantity);
    values.quantityForWholesale = parseInt(values.quantityForWholesale);
    values.retailPrice = parseFloat(values.retailPrice);
    values.wholesalePrice = parseFloat(values.wholesalePrice);

    Axios({
      url: `/products/${this.props.match.params.id}`,
      method: "PUT",
      data: values,
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        return window.location.reload();
      })
      .catch((err) => console.error(err));
  };
  render() {
    const { loading, data } = this.props;
    if (loading) return <Loader />;
    if (data.product.image && this.state.fileList.length === 0) {
      this.state.fileList = JSON.parse(data.product.image);
    }
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
          Product
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
              <Form.Item
                label="Name"
                name="name"
                initialValue={data.product.name}
              >
                <Input defaultValue={data.product.name} />
              </Form.Item>
              <Form.Item
                label="Category"
                name="categoryId"
                initialValue={data.product.categoryid}
              >
                <Select>
                  <Select.Option key={null} value={null}>
                    none
                  </Select.Option>
                  {data.categories.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
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
                initialValue={data.product.retailprice}
              >
                <InputNumber min={0} defaultValue={data.product.retailprice} />
              </Form.Item>
              <Form.Item
                label="Wholesale Price"
                name="wholesalePrice"
                initialValue={data.product.wholesaleprice}
              >
                <InputNumber
                  min={0}
                  defaultValue={data.product.wholesaleprice}
                />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
                initialValue={data.product.quantity}
              >
                <InputNumber min={0} defaultValue={data.product.quantity} />
              </Form.Item>
              <Form.Item
                label="Quantity For Wholesale"
                name="quantityForWholesale"
                initialValue={data.product.quantityforwholesale}
              >
                <InputNumber defaultValue={data.product.quantityforwholesale} />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                initialValue={data.product.description}
              >
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  defaultValue={data.product.description}
                />
              </Form.Item>

              <Form.Item style={{ float: "right" }}>
                <Button type="text" className="button_submit" htmlType="submit">
                  <span className="btn btn-info">Save</span>
                </Button>
              </Form.Item>

              <Form.Item style={{ float: "right" }}>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure to delete this Category?"
                  // visible={this.state.DeleteModal}
                  onConfirm={this.deleteConfirm}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" className="button_submit">
                    <span className="btn btn-danger">Delete</span>
                  </Button>
                </Popconfirm>
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
    loading: state.editProductReducer.loading,
    data: state.editProductReducer.data,
    error: state.editProductReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDataForProduct: (id) => {
      dispatch(getAllDataForProduct(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
