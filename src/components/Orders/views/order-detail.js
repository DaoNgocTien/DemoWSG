import { Button, Descriptions, Form, Modal, Table } from "antd";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }
  formRef = React.createRef();

  handleEditAndClose = (data) => {
    if (data.status === "created" || data.status === "advanced") {
      this.formRef.current.resetFields();
      return this.props.closeModal();
    }
    data.orderCode = this.state.record?.orderCode;
    delete data.status;
    this.props.updateStatusOrder(data);
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  checkCancelledOrder = () => {
    const record = this.props.record;
    if (record.status === "cancelled")
      return (
        <>
          <Descriptions.Item label="Reason to cancel order">
            {record.reasonforcancel ? record.reasonforcancel : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Image Proof">
            {(JSON.parse(record.imageproof ? record.imageproof : "[]")).length === 0 ? (
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
  }

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
        return (JSON.parse(data)).length === 0 ? (
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
      title: "Type",
      dataIndex: "typeofproduct",
      key: "typeofproduct",
    },
    {
      title: "Price",
      dataIndex: "price",
       width: 200,
      key: "price",
      render: (_text, object) => {
        return <NumberFormat
          value={object.price}
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
          value={object.totalprice}
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
    }
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
            title={`Order of ${this.state.record.customerfirstname +
              " " +
              this.state.record.customerlastname
              }`}
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button key="cancel" onClick={this.handleCancel}>Cancel</Button>,
            ]}
          >
           npm 
            <Table
              columns={this.columns}
              dataSource={this.state.record.details}
              scroll={{ y: 350, x: 1000 }}

            />
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
export default memo(OrderDetail, arePropsEqual);
