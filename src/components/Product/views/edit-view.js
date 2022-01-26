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
    state = {
        record: this.props.record,
    };

    componentDidMount() {
        console.log(this.props);
    }

    handleEditAndClose = (data) => {
        this.props.updateCategory(data);
        this.props.closeModal();
    };

    handleEdit = (data) => {
        // this.props.updateCategory(data);
    };

    handleCancel = () => {
        this.props.closeModal();
    };

    render() {
        const { openModal } = this.props;
        return (
            <>
                <Form id="editForm" onFinish={this.handleEditAndClose}>
                    <Modal
                        title="Edit a record"
                        visible={openModal}
                        // onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button onClick={this.handleCancel}>Cancel</Button>,
                            <Button
                                type="primary"
                                form="editForm"
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
                            initialValue={this.props.selectedRowKeys}
                            // hidden="true"
                        >
                            <Input
                                placeholder="Category ID"
                                defaultValue={this.props.selectedRowKeys}
                                disabled={true}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Category Name"
                            name="categoryName"
                            initialValue={this.props.record.categoryname}
                        >
                            <Input
                                placeholder="Category Name"                            
                                defaultValue={this.props.record.categoryname}
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


