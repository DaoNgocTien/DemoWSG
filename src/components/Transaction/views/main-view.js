import {
  Button,
  Popconfirm,
  Tag,
  Tabs,
  PageHeader,
  Descriptions,
  Table
} from "antd";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

class TransactionUI extends Component {
  state = {
    loading: false,
  };

  onOKWithdraw = (data) => {
    const newData = {
      amount: parseInt(data.amount),
      ordercode: data.ordercode,
      bankCode: "NCB",
      orderDescription: `order finalization with amount ${data.amount}`,
      orderType: "orderFinalization",
      transactionId: data.id
    };
    this.props.updateTransaction(newData);
  };

  columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      width: 150,
      key: "amount",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Advance Value",
      dataIndex: "advancefee",
      width: 150,
      key: "advancefee",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },

    {
      title: "Order Value",
      dataIndex: "ordervalue",
      width: 150,
      key: "ordervalue",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Payment Fee",
      dataIndex: "paymentfee",
      width: 150,
      key: "paymenfee",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },

    {
      title: "Platform Fee",
      dataIndex: "platformfee",
      width: 150,
      key: "platformfee",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      key: "status",
    },
    // {
    //   title: "Action",
    //   render: (object) => {
    //     if (object.type === "income" && object.iswithdrawable) {
    //       return (
    //         <Popconfirm
    //           title={`do you want to withdraw ${object.amount || 0} VND?`}
    //           onConfirm={() => this.onOKWithdraw(object)}
    //           okText="Yes"
    //           cancelText="No"
    //         >
    //           <Button type="primary">Withdraw</Button>
    //         </Popconfirm>
    //       );
    //     }
    //     return <></>;
    //   },
    //   fixed: "right",
    //   width: 130,
    // },
  ];

  penaltyColumns = [
    {
      title: "Amount",
      dataIndex: "amount",
      width: 150,
      key: "amount",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      }
    },
    {
      title: "Penalty Fee",
      dataIndex: "penaltyfee",
      width: 150,
      key: "penaltyfee",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      key: "status",
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 100,
      key: "type",
    },
  ];

  orderTransactionColumns = [
    {
      title: "Order Code",
      dataIndex: "ordercode",
      key: "ordercode",
      render: (data) => {
        return (<Link to={`/orders/${data}`}>{data}</Link>)
      }
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 150,
      key: "amount",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Advance Value",
      dataIndex: "advancefee",
      width: 150,
      key: "advancefee",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },

    {
      title: "Order Value",
      dataIndex: "ordervalue",
      width: 150,
      key: "ordervalue",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Payment Fee",
      dataIndex: "paymentfee",
      width: 150,
      key: "paymenfee",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },

    {
      title: "Platform Fee",
      dataIndex: "platformfee",
      width: 150,
      key: "platformfee",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Action",
      render: (object) => {
        if (object.type === "orderTransaction" && object.iswithdrawable) {
          return (
            <Popconfirm
              title={`do you want to withdraw ${object.amount || 0} VND?`}
              onConfirm={() => this.onOKWithdraw(object)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Withdraw</Button>
            </Popconfirm>
          );
        }
        return <></>;
      },
      fixed: "right",
      width: 130,
    },
  ];

  render() {
    const { data } = this.props;
    return (
      <PageHeader
        onBack={() => window.history.back()}
        title="TRANSACTION PAGE"
        subTitle={`Supplier's transactions are settled in this page`}
        extra={[<Popconfirm
          title={`do you want to withdraw ${data.account?.amount || 0} VND?`}
          onConfirm={() => this.onOKWithdraw(data?.account || {})}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Withdraw</Button>
        </Popconfirm>]}
      >
        <Tabs defaultActiveKey="1" >
          <Tabs.TabPane tab="Account" key="1">
            <Descriptions
              bordered
              column={2}
              size="small"
              labelStyle={{ width: "20%", fontWeight: "bold" }}
            >
              <Descriptions.Item label="Amount" span={2} contentStyle={{
                fontSize: "2em"
              }}>
                <NumberFormat
                  value={data.account?.amount || 0}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>

              <Descriptions.Item label="Advance Fee">
                <NumberFormat
                  value={data.account?.advancefee || 0}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>

              <Descriptions.Item label="Order Value">
                <NumberFormat
                  value={data.account?.ordervalue || 0}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>

              <Descriptions.Item label="Payment Fee">
                <NumberFormat
                  value={data.account?.paymentfee || 0}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>

              <Descriptions.Item label="Platform Fee">
                <NumberFormat
                  value={data.account?.platformfee || 0}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>
            </Descriptions>

            <Table
              loading={this.props.loading}
              columns={this.columns}
              dataSource={data?.income}
              scroll={{ y: 200 }}
              style={{ marginTop: "50px" }}
              title={() => {
                return (
                  <h6>
                    <strong>History</strong>
                  </h6>
                );
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Penalty" key="3">
            <Table
              loading={this.props.loading}
              columns={this.penaltyColumns}
              dataSource={data?.penalty}
              scroll={{ y: 200 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Order Transaction" key="2">
            <Table
              loading={this.props.loading}
              columns={this.orderTransactionColumns}
              dataSource={data?.transactionHistory}
              scroll={{ y: 200 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </PageHeader>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(TransactionUI, arePropsEqual);
