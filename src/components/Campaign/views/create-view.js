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
  createCategory: PropTypes.func,
  defaultCategory: PropTypes.object,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => {},
  createCategory: () => {},
  // openModal: false,
};

class CreatModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    openModal: false,
    startDate: moment().subtract(-1, "days"),
  };

  componentDidMount() {
    console.log(this.props);
  }

  handleCreateAndClose = (data) => {
    data.fromDate = moment(data.fromDate).format("MM/DD/YYYY");
    data.toDate = moment(data.toDate).format("MM/DD/YYYY");

    this.props.createCampaign(data);
    this.props.closeModal();
  };

  handleCreate = (data) => {
    this.props.createCategory(data);
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  disabledFromDate = (current) => {
    return current && current < moment().subtract(1, "days");
  };

  onChangeDate = (value) => {
    this.setState({ startDate: value.subtract(-1, "days") });
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
                Submit
              </Button>,
            ]}
            Category
          >
            <Form.Item
              label="Product"
              name="productId"
              initialValue={this.props.products[0]?.id}
            >
              <Select defaultValue={this.props.products[0]?.id}>
                {this.props.products.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="From Date" name="fromDate">
              <DatePicker
                onChange={this.onChangeDate}
                disabledDate={this.disabledFromDate}
                format="MM/DD/YYYY"
              />
            </Form.Item>
            <Form.Item label="To Date" name="toDate">
              <DatePicker
                disabledDate={(current) => {
                  return current && current < this.state.startDate;
                }}
                format="MM/DD/YYYY"
              />
            </Form.Item>
            <Form.Item label="price" name="price">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="quantity" name="quantity">
              <InputNumber min={0} />
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
