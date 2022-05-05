import {
  Button,
  Form,
  Input, Modal
} from "antd";
import React, { Component, memo } from "react";

class CreatModal extends Component {
  formRef = React.createRef();

  handleCreateAndClose = (data) => {
    this.formRef.current.resetFields();
    this.props.createCategory(data);
    this.props.closeModal();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { openModal } = this.props;
    return (
      <>
        <Form
          id="createCategoryForm"
          ref={this.formRef}
          onFinish={this.handleCreateAndClose}
          layout="vertical"
        >
          <Modal
            title="Add New"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="createCategoryForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Form.Item
              label="Category Name"
              name="categoryName"
              
              rules={[
                ({getFieldValue }) => ({
                  validator(_, value) {
                    if (value.length > 0 && value.length <= 20) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Category Name is required, length is 1-20 characters!'));
                  },
                }),
              ]}
            >
              <Input placeholder="Name is required, 1-20 characters!" />
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
export default memo(CreatModal, arePropsEqual);