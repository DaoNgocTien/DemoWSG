import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select, Upload,
} from "antd";
import Axios from "axios";
import moment from "moment";
import React, { Component, memo } from "react";


class UpdateModal extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };
  formRef = React.createRef();

  handleUpdateAndClose = (data) => {
    let newLoyalCustomerCondition = {
      minOrder: data.minOrder,
      minProduct: data.minProduct,
      discountPercent: data.discountPercent,
    };

    this.props.updateLoyalCustomerCondition(
      newLoyalCustomerCondition,
      this.props.record?.id
    );
    this.props.closeModal();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { openModal } = this.props;

    const { productList, record } = this.props;
    if (this.props.loading || !this.props.record || !productList) {
      return <></>;
    }
    return (
      <>
        <Form
          id="updateLoyalCustomerConditionForm"
          ref={this.formRef}
          onFinish={this.handleUpdateAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Update"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="updateLoyalCustomerConditionForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Condition Name">
                <Form.Item name="name" initialValue={"CONDITION " + moment(this.props.record?.startdate).format("MM/DD/YYYY")}>
                  <Input disabled="true" style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Min Order">
                <Form.Item name="minOrder" initialValue={this.props.record?.minorder}>
                  <InputNumber style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Min Product">
                <Form.Item name="minProduct" initialValue={this.props.record?.minproduct}>
                  <InputNumber style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Discount Percent">
                <Form.Item name="discountPercent" initialValue={this.props.record?.discountpercent}>
                  <InputNumber
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
export default memo(UpdateModal, arePropsEqual);
