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
  createCategory: PropTypes.func,
  defaultCategory: PropTypes.object,
  openModal: PropTypes.bool
};

//  default props
const propsDefault = {
  closeModal: () => { },
  createCategory: () => { },
  defaultCategory: {
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

class CreatModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  formRef = React.createRef();
  // state = {
  //   openModal: false,
  // };

  componentDidMount() {
    // console.log(this.props);
  }

  handleCreateAndClose = (data) => {
    this.formRef.current.resetFields();
    this.props.createCategory(data);
    this.props.closeModal();
  };

  handleCreate = (data) => {
    this.formRef.current.resetFields();
    this.props.createCategory(data);
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
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
                {
                  required: true,
                  message: 'Name is required!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value.length > 0 && value.length <= 20) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Category Name length is 1-20 characters!'));
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