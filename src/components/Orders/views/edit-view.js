import React, { Component, memo } from "react";
import { Modal, Button, Form, Table, Select } from "antd";
import PropTypes from "prop-types";

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
    };
  }
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  formRef = React.createRef();

  componentDidMount() {
    // console.log(this.props);
  }

  handleEditAndClose = (data) => {
    if(data.status === "created" || data.status === "advanced") {
      this.formRef.current.resetFields();
      return this.props.closeModal();
    }
    data.orderCode = this.state.record?.orderCode
    delete data.status
    this.props.updateStatusOrder(data);
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      render: (text, object, index) => {
        return index + 1;
      },
      width: 100,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (data) => {
        return data === "" ? (
          ""
        ) : (
          <img width="100" alt="show illustrative representation" height="100" src={JSON.parse(data)[0].url} />
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      sorter: (a, b) => a.productname.length - b.productname.length,
    },
    {
      title: "Type",
      dataIndex: "typeofproduct",
      key: "typeofproduct",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
    },
    {
      title: "Note",
      dataIndex: "notes",
      key: "notes",
    },
  ];

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
            width={window.innerWidth * 0.7}
            title={`Order of ${
              this.state.record.customerfirstname +
              " " +
              this.state.record.customerlastname
            }`}
            visible={openModal}
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
            <Table
              columns={this.columns}
              dataSource={this.state.record.details}
            />
            <h5> Order Code: {this.state.record?.ordercode}</h5>
            <h5> Total Price: {this.state.record?.totalprice}VND</h5>
            <h5> Discount Price: {this.state.record?.discountprice}VND</h5>
            <h5>
              Final Price:{" "}
              {this.state.record?.totalprice - this.state.record?.discountprice}
              VND
            </h5>
            <Form.Item
              label="Status"
              name="status"
              initialValue={this.state.record?.status}
            >
              <Select defaultValue={this.state.record?.status}>
                <Select.Option key={"created"} value={"created"} disabled>
                  created
                </Select.Option>
                <Select.Option key={"advanced"} value={"advanced"} disabled>
                  advanced
                </Select.Option>
                <Select.Option key={"delivering"} value={"delivering"}>
                  delivering
                </Select.Option>
              </Select>
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
