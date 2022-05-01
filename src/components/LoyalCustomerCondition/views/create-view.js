import {
  Button, DatePicker, Descriptions, Form, InputNumber, Modal, Input
} from "antd";
import React, { Component, memo } from "react";
import moment from "moment";

class CreatModal extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    price: 0,
  };
  formRef = React.createRef();

  handleCreateAndClose = (data) => {
    let newLoyalCustomerCondition = {
      minOrder: data.minOrder,
      minProduct: data.minProduct,
      discountPercent: data.discountPercent,
    };

    this.props.createLoyalCustomerCondition(newLoyalCustomerCondition);
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
          id="createLoyalCustomerConditionForm"
          ref={this.formRef}
          onFinish={this.handleCreateAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title={"Add New"}
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="createLoyalCustomerConditionForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Condition Name">
                <Form.Item name="name" initialValue={"CONDITION " + moment().format("MM/DD/YYYY")}>
                  <Input disabled="true" style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Min Order">
                <Form.Item name="minOrder" initialValue={1}>
                  <InputNumber defaultValue={1} style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Min Product">
                <Form.Item name="minProduct" initialValue={1}>
                  <InputNumber defaultValue={1} style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Discount Percent">
                <Form.Item name="discountPercent" initialValue={1}>
                  <InputNumber
                    defaultValue={0}
                    min="0"
                    max="100"
                    addonAfter="%"
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
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
export default memo(CreatModal, arePropsEqual);
