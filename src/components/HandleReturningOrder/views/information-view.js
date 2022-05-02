import { Descriptions, Table } from "antd";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";

class InformationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }
  formRef = React.createRef();

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
      render: (_text, _object, index) => {
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
      width: 200,
      key: "price",
      render: (_text, object) => {
        return <NumberFormat
          value={object.totalprice - object.discountprice}
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
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
      render: (_text, object) => {
        return <NumberFormat
          value={object.totalprice - object.discountprice}
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
    },
    {
      title: "Note",
      dataIndex: "notes",
      key: "notes",
      fix:"right"
    },
  ];

  render() {
    this.state.record = this.props.record;

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
            <NumberFormat
              value={this.state.record.order?.totalprice}
              thousandSeparator={true}
              suffix={" VND"}
              decimalScale={0}
              displayType="text"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Discount Price">
            <NumberFormat
              value={this.state.record.order?.discountprice}
              thousandSeparator={true}
              suffix={" VND"}
              decimalScale={0}
              displayType="text"
            />


          </Descriptions.Item>
          <Descriptions.Item label="Final Price">
            <NumberFormat
              value={this.state.record.order?.totalprice - this.state.record.order?.discountprice}
              thousandSeparator={true}
              suffix={" VND"}
              decimalScale={0}
              displayType="text"
            />
          </Descriptions.Item>

          {this.checkCancelledOrder()}

          <Descriptions.Item label="Status">
            {this.state.record.order?.status}
          </Descriptions.Item>
        </Descriptions>
        <Table
          columns={this.columns}
          dataSource={this.state.record.order?.details}
          scroll={{ y: 350, x: 1000 }}

        />
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(InformationModal, arePropsEqual);
