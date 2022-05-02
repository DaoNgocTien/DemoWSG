import {
  Button,
  Col,
  PageHeader,
  Popconfirm,
  Radio,
  Row,
  Space,
  Table,
  Tag
} from "antd";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";

class TransactionUI extends Component {
  state = {
    loading: false,
    selectedRowKeys: [],
    loadingActionButton: false,
    editButton: false,
    deleteButton: false,
    addNewButton: true,
    openCreateModal: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: undefined,
    searchKey: "",
    openDrawer: false,
    record: {},
    orderList: [],
  };

  onOKWithdraw = (data) => {
    const newData = {
      amount: parseInt(data.amount),
      ordercode: data.ordercode,
      bankCode: "NCB",
      orderDescription: `order finalization with amount ${data.amount}`,
      orderType: "orderFinalization",
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
      title: "Type",
      dataIndex: "type",
      width: 100,
      key: "type",
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>;
      },
    },

    {
      title: "Description",
      dataIndex: "description",
      width: 400,
      key: "description",
    },
    {
      title: "Action",
      render: (object) => {
        if (object.type === "income" && object.iswithdrawable) {
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

  onRadioChange = (e) => {
    let { data } = this.props;
    let searchValue = e.target.value;
    let searchData = [];
    switch (searchValue) {
      case "income":
        searchData = data.income;
        break;

      case "penalty":
        searchData = data.penalty;
        break;

      default:
        searchData = data.income || [];
        searchValue = "";
        break;
    }

    this.setState({
      displayData: searchData,
      searchKey: searchValue,
    });
  };

  render() {
    const { data } = this.props;
    const { displayData = data.income } = this.state;
    return (
      <PageHeader
        onBack={() => window.history.back()}
        title="TRANSACTION PAGE"
        subTitle={`Supplier's transactions are settled in this page`}
        footer={
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <div>
              <div style={{ marginBottom: 16 }}>
                <Row>
                  <Col flex="auto">
                    <Space size={4}>
                      <Radio.Group
                        onChange={(e) => this.onRadioChange(e)}
                        defaultValue="income"
                      >
                        <Radio value="income">Income</Radio>
                        <Radio value="penalty">Penalty</Radio>
                      </Radio.Group>
                    </Space>
                  </Col>
                  <Col flex="300px"></Col>
                </Row>
              </div>
              <Table
                loading={this.props.loading}
                columns={this.columns}
                dataSource={displayData}
                scroll={{ y: 300 }}
              />
            </div>
          </div>
        }
      ></PageHeader>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(TransactionUI, arePropsEqual);
