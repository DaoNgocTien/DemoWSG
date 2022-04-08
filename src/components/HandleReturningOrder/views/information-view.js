import { Descriptions, Table } from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

const propsDefault = {
  closeModal: () => {},
  updateCampaign: () => {},
  record: {},
  openModal: false,
};

class InformationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  formRef = React.createRef();

  componentDidMount() {}

  checkCancelledOrder = () => {
    const record = this.props.record;
    if (record.status === "cancelled")
      return (
        <>
          <Descriptions.Item label="Reason to cancel order">
            {record.reasonforcancel ? record.reasonforcancel : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Image Proof">
            {JSON.parse(record.imageproof ? record.imageproof : "[]").length ===
            0 ? (
              ""
            ) : (
              <img
                width="100"
                alt="show illustrative representation"
                height="100"
                src={JSON.parse(record.imageproof)[0].url}
              />
            )}
          </Descriptions.Item>
        </>
      );
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
        return JSON.parse(data).length === 0 ? (
          ""
        ) : (
          <img
            width="100"
            alt="show illustrative representation"
            height="100"
            src={JSON.parse(data)[0].url}
          />
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
    console.log(this.props.record);

    return (
      <>
        <Descriptions
          bordered
          title="Order Infomation"
          column={2}
          style={{ marginBottom: "10px" }}
        >
          <Descriptions.Item label="Order Code">
            {this.state.record.order?.ordercode}
          </Descriptions.Item>
          <Descriptions.Item label="Total Price">
            {this.state.record.order?.totalprice}VND
          </Descriptions.Item>
          <Descriptions.Item label="Discount Price">
            {this.state.record.order?.discountprice}VND
          </Descriptions.Item>
          <Descriptions.Item label="Final Price">
            {" "}
            {this.state.record.order?.totalprice -
              this.state.record.order?.discountprice}
            VND
          </Descriptions.Item>

          {this.checkCancelledOrder()}

          <Descriptions.Item label="Status">
            {this.state.record.order?.status}
          </Descriptions.Item>
        </Descriptions>
        <Table
          columns={this.columns}
          dataSource={this.state.record.order?.details}
        />
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(InformationModal, arePropsEqual);
