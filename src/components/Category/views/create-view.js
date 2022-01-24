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
  // state = {
  //   openModal: false,
  // };

  componentDidMount() {
    console.log(this.props);
  }

  handleCreateAndClose = (data) => {
    this.props.createCategory(data);
    this.props.closeModal();
  };

  handleCreate = (data) => {
    this.props.createCategory(data);
  };

  handleCancel = () => {
    this.props.closeModal();
  };


  render() {
    const { openModal } = this.props;
    return (
      <>
        <Form id="createForm" onFinish={this.handleCreateAndClose}>
          <Modal
            title="Add New"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="createForm"
                key="submit"
                htmlType="submit"
              >
                Submit and Close
              </Button>,
            ]}
          >
            <Form.Item label="Category Name" name="categoryName">
              <Input placeholder="Category Name" />
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


