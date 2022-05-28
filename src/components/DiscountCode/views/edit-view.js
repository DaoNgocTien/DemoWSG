import {
  Button, DatePicker, Form,
  Input, InputNumber, Modal, Space
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";

class UpdateModal extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    productSelected: null,
  };
  formRef = React.createRef();

  handleUpdateAndClose = (data) => {
    let newDiscountCode = {
      id: this.props.record?.id,
      code: data.code,
      description: data.description,
      minimunPriceCondition: data.minimunPrice,
      // startDate: data.date[0],
      endDate: data.endDate,
      discountPrice: data.discountPrice,

    };

    this.props.updateDiscountCode(newDiscountCode);
    this.props.closeModal();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { RangePicker } = DatePicker;
    const { openModal, closeModal, record } = this.props;
    console.log(record)
    if (this.props.loading || !record) {
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
          title="Update"
          visible={openModal}
          onCancel={this.handleCancel}
          footer={[
            <Button onClick={this.handleCancel}>Cancel</Button>,
            <Button
              type="primary"
              form="updateDiscountCodeForm"
              key="submit"
              htmlType="submit"
            >
              Submit
            </Button>,
          ]}
        >
          <Form
            id="updateDiscountCodeForm"
            ref={this.formRef}
            onFinish={this.handleUpdateAndClose}
            layout="vertical"
          >
            <Space size={30}>
            <Form.Item
                label="End Date"
                name="endDate"
                initialValue={moment(record?.enddate)}
                required
              >
                <DatePicker
                  format="MM/DD/YYYY"
                  defaultValue={moment(record?.enddate, "MM/DD/YYYY")}
                  disabledDate={(current) => { return current && current < moment().endOf('day') }}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
              <Form.Item name="code" label="Code" initialValue={record?.code}
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
                <Input style={{ width: "60vh" }} placeholder="Code is required, length is 1-200 characters!" />
              </Form.Item>
            </Space>
            <Space size={30}>
              <Form.Item name="discountPrice" initialValue={record?.discountprice} label="Discount price"
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
                <InputNumber min={1000} max={999999999999} style={{ width: "60vh" }} />
              </Form.Item>
              <Form.Item name="minimunPrice" initialValue={record?.minimumpricecondition} label="Minimun price"
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
                <InputNumber style={{ width: "60vh" }} defaultValue={record?.minimumpricecondition} min={1000} max={999999999999} />
              </Form.Item>
            </Space>
            <Space size={30}>
              <Form.Item
                name="description"
                label="Description"
                initialValue={record?.description}
              >
                <Input.TextArea style={{ width: "60vh" }} />
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
export default memo(UpdateModal, arePropsEqual);
