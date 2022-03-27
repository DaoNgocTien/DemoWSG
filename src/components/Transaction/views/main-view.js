import {
  Button,
  Col,
  PageHeader,
  Radio,
  Row,
  Space,
  Table,
  Popconfirm,
} from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  createTransaction: PropTypes.func,
  updateTransaction: PropTypes.func,
  deleteTransaction: PropTypes.func,
};

const propsDefault = {
  index: 1,
  data: [],
  products: [],
};

class TransactionUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
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

  componentDidMount() {}

  showDrawer = () => {
    this.setState({
      openDrawer: true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      openDrawer: false,
    });
  };

  onOKWithdraw = (data) => {
    console.log(data);
    const newData = {
      amount: parseInt(data.amount),
      ordercode: data.ordercode,
      bankCode: "NCB",
      orderDesciption: `order finalization with amount ${data.amount}`,
      orderType: "orderFinalization",
    };
    this.props.updateTransaction(newData);
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
      fixed: "left",
    },
    {
      title: "Order Code",
      dataIndex: "ordercode",
      key: "ordercode",
      width: 300,
      fix: "left",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
      key: "amount",
      render: (data) => {
        return data || 0;
      },
    },
    {
      title: "Advance Value",
      dataIndex: "advancefee",
      width: 100,
      key: "advancefee",
    },

    {
      title: "Order Value",
      dataIndex: "ordervalue",
      width: 100,
      key: "ordervalue",
    },
    {
      title: "Payment Fee",
      dataIndex: "paymentfee",
      width: 100,
      key: "paymenfee",
    },

    {
      title: "Platform Fee",
      dataIndex: "platformfee",
      width: 100,
      key: "platformfee",
    },

    {
      title: "Penalty Fee",
      dataIndex: "penaltyfee",
      width: 100,
      key: "penaltyfee",
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
        console.log(object.iswithdrawable);
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

  onChangeHandler = () => {
    let { data } = this.props;
  };

  onSelectChange = (selectedRowKeys) => {
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    this.setState({
      selectedRowKeys,
      record: record,
      editButton: selectedRowKeys.length === 1,
      deleteButton: selectedRowKeys.length === 1,
      addNewButton: selectedRowKeys.length === 0,
    });
  };

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
    console.log(searchData);

    this.setState({
      displayData: searchData,
      searchKey: searchValue,
    });
  };

  settlePayment = (item) => {
    const list = [];
    list.push(item);
    this.props.storeSettlingPaymentList(list);
  };

  render() {
    const { data } = this.props;
    const { displayData = data.income } = this.state;

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        onBack={() => window.history.back()}
        title="TRANSACTION PAGE"
        subTitle={`This is a ${arrayLocation[2]} page`}
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
