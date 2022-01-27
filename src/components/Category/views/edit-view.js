import React, { Component, memo } from "react";
import {
    Modal,
    Button,
    Form,
    Input,
} from "antd";
import PropTypes from "prop-types";

//  prototype
const propsProTypes = {
    closeModal: PropTypes.func,
    updateCategory: PropTypes.func,
    record: PropTypes.object,
    openModal: PropTypes.bool
};

//  default props
const propsDefault = {
    closeModal: () => { },
    updateCategory: () => { },
    record: {
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

class EditModal extends Component {
    static propTypes = propsProTypes;
    static defaultProps = propsDefault;
    formRef = React.createRef();

    componentDidMount() {
        console.log(this.props);
    }

    handleEditAndClose = (data) => {
        this.props.updateCategory(data);
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    handleEdit = (data) => {
        // this.props.updateCategory(data);
    };

    handleCancel = () => {
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    render() {
        const { openModal, record, selectedRowKeys } = this.props;

        return (
            <>
                <Form id="editCategoryForm" ref={this.formRef} onFinish={this.handleEditAndClose}>
                    <Modal
                        title="Edit a record"
                        visible={openModal}
                        // onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button onClick={this.handleCancel}>Cancel</Button>,
                            <Button
                                type="primary"
                                form="editCategoryForm"
                                key="submit"
                                htmlType="submit"
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        <Form.Item
                            label="Category ID"
                            name="id"
                            initialValue={record.id}
                            hidden="true"
                        >
                            <Input
                                placeholder="Category ID"
                                defaultValue={record.id}
                                disabled={true}
                                hidden={true}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Category Name"
                            name="categoryName"
                            initialValue={record.categoryname}
                        >
                            <Input
                                placeholder="Category Name"
                                defaultValue={record.categoryname}
                            />
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
export default memo(EditModal, arePropsEqual);


