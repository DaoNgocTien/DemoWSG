import {
    Button,
    Form,
    Input, Modal
} from "antd";
import React, { Component, memo } from "react";

class DeleteModel extends Component {
    state = { record: this.props.record };
    formRef = React.createRef();

    componentDidMount() {
        this.formRef.current.setFieldsValue({
            id: this.props.record?.id,
            categoryname: this.props.record?.categoryname,
        });
    }

    handleDeleteAndClose = () => {
        this.props.deleteCategory(this.props.record?.id);
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
                    id="deleteCategoryForm"
                    ref={this.formRef}
                    onFinish={this.handleDeleteAndClose}
                    layout="vertical"
                >
                    <Modal
                        title="Delete a record"
                        visible={openModal}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button onClick={this.handleCancel}>Cancel</Button>,
                            <Button
                                type="danger"
                                form="deleteCategoryForm"
                                key="submit"
                                htmlType="submit"
                            >
                                Delete
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
                        >
                            <Input
                                placeholder="Category Name"
                                disabled={true}
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
export default memo(DeleteModel, arePropsEqual);


