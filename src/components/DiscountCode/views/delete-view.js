import {
  Button, DatePicker, Form,
  Input, InputNumber, Modal, Space
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";

class DeleteModal extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  };
  formRef = React.createRef();

  handleDeleteAndClose = (data) => {
    this.props.deleteDiscountCode(this.props.record?.id);
    this.props.closeModal();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { RangePicker } = DatePicker;
    const { openModal, record } = this.props;

    if (this.props.loading || !this.props.record) {
      return <></>;
    }
    return (
      <>
        <Modal
          width={window.innerWidth * 0.7}
          heigh={window.innerHeight * 0.5}
          style={{
            top: 10,
          }}
          title="Delete a record"
          visible={openModal}
          onCancel={this.handleCancel}
          footer={[
            <Button onClick={this.handleCancel}>Cancel</Button>,
            <Button
              type="danger"
              form="deleteDiscountCodeForm"
              key="submit"
              htmlType="submit"
            >
              Delete
            </Button>,
          ]}
        >
          <Form
            id="deleteDiscountCodeForm"
            ref={this.formRef}
            onFinish={this.handleDeleteAndClose}
            layout="vertical"
          >
            <Space size={30}>
              <Form.Item
                label="Discount Code Duration"
                name="date"
                initialValue={
                  [moment(this.props.record?.startdate),
                  moment(this.props.record?.enddate),]
                }
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <RangePicker
                  disabled={true}
                  style={{ width: "60vh" }}
                  ranges={{
                    Today: [moment(), moment()],
                    "This Week": [
                      moment().startOf("week"),
                      moment().endOf("week"),
                    ],
                    "This Month": [
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ],
                  }}
                  format="MM/DD/YYYY"
                  onChange={this.onChange}
                />
              </Form.Item>
              <Form.Item name="code" label="Code" initialValue={this.props.record?.code}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (value.length > 0 && value.length <= 200) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Code is required, length is 1-200 characters!'));
                    },
                  }),
                ]}
              >
                <Input style={{ width: "60vh" }} placeholder="Code is required, length is 1-200 characters!" disabled={true} />
              </Form.Item>
            </Space>
            <Space size={30}>
              <Form.Item name="discountPrice" initialValue={this.props.record?.discountprice} label="Discount price"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Discount price is positive number!'));
                    },
                  }),
                ]}
                help="Minimum discount price is 1000!"
              >
                <InputNumber min={1000} max={999999999999} style={{ width: "60vh" }} disabled={true} />
              </Form.Item>
              <Form.Item name="minimunPrice" initialValue={this.props.record?.minimunpricecondition} label="Minimun price"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Minimum price is positive number!'));
                    },
                  }),
                ]}
                help="Minimum price to use discount code is 1000!"

              >
                <InputNumber style={{ width: "60vh" }} min={1000} max={999999999999} disabled={true} />
              </Form.Item>
            </Space>
            <Space size={30}>
              <Form.Item
                name="description"
                label="Description"
                initialValue={this.props.record?.description}
              >
                <Input.TextArea style={{ width: "60vh" }} disabled={true} />
              </Form.Item>
            </Space>
          </Form >
        </Modal>
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(DeleteModal, arePropsEqual);
