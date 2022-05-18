import {
    Button,
    Form,
    Input, Modal
} from "antd";
import axios from "axios";
import React, { Component, memo } from "react";
class EditModal extends Component {

    componentDidMount() {
    }

    updateCategory = (record) => {
        axios({
            url: `/categories/${record.id}`,
            method: "PUT",
            data: { categoryName: record.categoryName },
            withCredentials: true,
        }).then((response) => {
            if (response.status === 200) {
                return this.props.updateCategory();
            }
        }).catch(() => {
            return this.props.updateCategory();
        });
    }

    handleEditAndClose = (data) => {
        this.updateCategory(data);
        this.props.closeModal();
    };

    handleCancel = () => {
        this.props.closeModal();
    };

    render() {
        const { openModal, record } = this.props;
        return (
            <>
                <Form
                    key={record?.key}
                    id="editCategoryForm"
                    onFinish={this.handleEditAndClose}
                    layout="vertical"
                >
                    <Modal
                        title="Edit a record"
                        visible={openModal}
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
                            initialValue={record?.id}
                            hidden="true"
                        >
                            <Input
                                placeholder="Category ID"
                                disabled={true}
                                hidden={true}
                                value={record?.id}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Category Name"
                            name="categoryName"
                            initialValue={record?.categoryname}
                            rules={[
                                () => ({
                                    validator(_, value) {
                                        if (value.length > 0 && value.length <= 20) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(new Error('Category Name is required, length is 1-20 characters!'));
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="Name is required, 1-20 characters!"

                                value={record?.categoryname}
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


