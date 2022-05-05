import {
    Button,
    Form,
    Input, Modal
} from "antd";
import React, { Component, memo } from "react";
class EditModal extends Component {
    state = { record: this.props.record };
    formRef = React.createRef();

    componentDidMount() {
        this.formRef.current.setFieldsValue({
            id: this.props.record?.id,
            categoryname: this.props.record?.categoryname,
        });
    }

    handleEditAndClose = (data) => {
        this.props.updateCategory(data);
        this.formRef.current.resetFields();
        this.props.closeModal();
    };

    handleCancel = () => {
        this.props.closeModal();
    };

    render() {
        const { openModal, record, } = this.props;
        return (
            <>
                <Form
                    key={record?.key}
                    id="editCategoryForm"
                    ref={this.formRef}
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


