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
        const { openModal, record } = this.props;

        const { data, categoryList } = this.props;
        const { load, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {load ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );

        return (
            <>
                <Form
                    key={record?.id}
                    id="updateProductForm"
                    ref={this.formRef}
                    onFinish={this.handleUpdateAndClose}>
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
                        <Form.Item
                            label="Name"
                            name="name"
                            initialValue={record?.name}
                        >
                            <Input defaultValue={record?.name} />
                        </Form.Item>
                        <Form.Item
                            label="Category"
                            name="categoryId"
                            initialValue={record?.categoryid}
                        >
                            <Select defaultValue={record?.categoryid}>
                                {categoryList.map((item) => (
                                    <Select.Option key={item.key} value={item.id}>
                                        {item.categoryname}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="image" name="image" initialValue={record?.name}>
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
                        <Form.Item
                            label="Retail Price"
                            name="retailPrice"
                            initialValue={record?.retailprice}
                        >
                            <InputNumber min={0} defaultValue={record?.retailprice} />
                        </Form.Item>
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            initialValue={record?.quantity}
                        >
                            <InputNumber min={0} defaultValue={record?.quantity} />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            initialValue={record?.description}
                        >
                            <Input.TextArea
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                defaultValue={record?.description} />
                        </Form.Item>
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

