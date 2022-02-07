import React, { Component, memo } from "react";
import {
    Modal,
    Button,
    Form,
    Input,
} from "antd";
import PropTypes from "prop-types";
import { Select, Upload, InputNumber, Descriptions, DatePicker } from "antd";
import moment from "moment";
import Axios from "axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ProductUI from "../../Product/views/create-view";
const { RangePicker } = DatePicker;
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
        productSelected: {},
        price: 0,
      };
    formRef = React.createRef();


    componentDidMount() {
        console.log(this.props);
    }

    handleUpdateAndClose = (data) => {
        data.image = this.state.fileList;
        this.props.updateProduct(data);
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    handleUpdate = (data) => {
        this.props.updateProduct(data);
        this.formRef.current.resetFields();
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

        const { productList } = this.props;
        const { productSelected, price } = this.state;

        return (
            <>
                <Form id="updateCampaignForm" ref={this.formRef} onFinish={this.handleCreateAndClose}>
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
                form="updateCampaignForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >

            <Descriptions
              bordered
              column={2}
            >
              <Descriptions.Item label="Campaign duration">
                <Form.Item name="date">
                  <RangePicker
                    ranges={{
                      Today: [moment(), moment()],
                      'This Week': [moment().startOf('week'), moment().endOf('week')],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    onChange={this.onChange}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item
                  name="productId"
                  initialValues={{ value: productList[0] ? productList[0].name : "" }}
                >
                  <Select
                    onChange={this.onSelectProduct}
                  >
                    {productList.map((item) => {
                      console.log("Product in create campaign: ");
                      console.log(item);
                      return <Select.Option key={item.key} value={item.id}>
                        {item.name}
                      </Select.Option>
                    })}
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                <Form.Item name="quantity">
                  <InputNumber addonAfter=" products" defaultValue={1} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale percent">
                <Form.Item name="wholesalePercent">
                  <InputNumber addonAfter=" %" defaultValue={1} onChange={this.onChangePrice} />
                </Form.Item>
              </Descriptions.Item>

            </Descriptions>

            <Descriptions
              bordered
              title="Product in campaign"
              column={2}
            >
              <Descriptions.Item label="Name">{productSelected.name ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Category">{productSelected.categoryname ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Quantity in stock">{productSelected.quantity ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Quantity in campaign">{productSelected.name ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Retail price">{productSelected.price ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Wholesale price">{price ?? ""}</Descriptions.Item>
              <Descriptions.Item label="Description">
                Data disk type: MongoDB
                <br />
                Database version: 3.4
                <br />
                Package: dds.mongo.mid
                <br />
                Storage space: 10 GB
                <br />
                Replication factor: 3
                <br />
                Region: East China 1<br />
              </Descriptions.Item>
              <Descriptions.Item label="Image">
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={productSelected.previewImage}
                />
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

