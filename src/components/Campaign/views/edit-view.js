import React, { Component, memo } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import moment from "moment";

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => {},
  updateCampaign: () => {},
  record: {},
  openModal: false,
};

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      startDate: moment().subtract(-1, "days"),
    };
  }
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  formRef = React.createRef();

  componentDidMount() {
    console.log(this.props);
  }

  handleEditAndClose = (data) => {
    this.props.updateCampaign(data);
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  disabledFromDate = (current) => {
    return current && current < moment()?.subtract(1, "days");
  };

  onChangeDate = (value) => {
    this.setState({ startDate: value?.subtract(-1, "days") });
  };

  render() {
    this.state.record = this.props.record;
    const { openModal } = this.props;

    return (
      <>
        <Form
          id="editForm"
          key={this.state.record?.key}
          ref={this.formRef}
          onFinish={this.handleEditAndClose}
        >
          <Modal
            title="Edit a record"
            visible={openModal}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="editForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Form.Item
              label="Product"
              name="productId"
              initialValue={this.state.record?.productid}
            >
              <Select defaultValue={this.state.record?.productid}>
                {this.props.products.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="From Date"
              name="fromDate"
              initialValue={moment(this.state.record?.fromdate)}
            >
              <DatePicker
                defaultValue={moment(this.state.record?.fromdate)}
                onChange={this.onChangeDate}
                disabledDate={this.disabledFromDate}
                format="MM/DD/YYYY"
              />
            </Form.Item>
            <Form.Item
              label="To Date"
              name="toDate"
              initialValue={moment(this.state.record?.todate)}
            >
              <DatePicker
                defaultValue={moment(this.state.record?.todate)}
                disabledDate={(current) => {
                  return current && current < this.state.startDate;
                }}
                format="MM/DD/YYYY"
              />
            </Form.Item>
            <Form.Item
              label="price"
              name="price"
              initialValue={this.state.record?.price}
            >
              <InputNumber min={0} defaultValue={this.state.record?.price} />
            </Form.Item>
            <Form.Item
              label="quantity"
              name="quantity"
              initialValue={this.state.record?.quantity}
            >
              <InputNumber min={0} defaultValue={this.state.record?.price} />
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
