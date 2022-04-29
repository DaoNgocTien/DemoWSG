import { Button, Col, Input, PageHeader, Radio, Row, Table, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import { OpenInNew } from "@material-ui/icons";
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  handleOrder: PropTypes.func,
  updateStatusOrder: PropTypes.func,
};

const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
  handleOrder: () => {},
  updateStatusOrder: () => {},
};

class OrderReturningUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [],
    loading: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openDetailModal: false,
    openHandleModal: false,
    viewButton: true,
    actionButton: true,
    record: {},
    buttonTitle: "Handle Returning Request",
  };

  componentDidMount() {}

  start = (openModal) => {
    switch (openModal) {
      case "openHandleModal":
        this.setState({ openHandleModal: true });
        break;

      case "openDetailModal":
        this.setState({ openDetailModal: true });
        break;

      default:
        break;
    }
  };

  changeStatus = (data) => {
    this.props.updateStatusOrder(data);
  };

  onSelectChange = (selectedRowKeys) => {
    let record = this.props.data?.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];
    //  //console.log(record);
    let handledBySupplier = 0;
    record?.orderstatushistory?.map((item) => {
      if (item.statushistory === "returning") {
        handledBySupplier++;
      }
    });
    this.setState({
      selectedRowKeys,
      viewButton: selectedRowKeys.length === 1 && record?.status != "returned",
      actionButton: selectedRowKeys.length === 1,
      addNewButton: selectedRowKeys.length === 0,
      record: record,
      buttonTitle:
        record?.status === "returned" || handledBySupplier > 0
          ? "View Details"
          : "Handle Returning Request",
    });
  };

  columns = [
    {
      title: "Order Code",
      dataIndex: "ordercode",
      key: "ordercode",
    },
    {
      title: "Customer",
      render: (_text, object, _index) => {
        return object.customerfirstname + " " + object.customerlastname;
      },
    },

    {
      title: "Order date",
      dataIndex: "createdat",
      key: "createdat",
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
    },
    {
      title: "Total amount",
      dataIndex: "totalprice",
      key: "totalprice",
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
      key: "status",
      render: (data) => {
        return data === "returned" ? (
          <Tag color="blue">{data.toUpperCase()}</Tag>
        ) : (
          <Tag color="red">{data.toUpperCase()}</Tag>
        );
      },
      width: 100,
    },
    {
      title: "",
      render: (object) => {
        let showButton = false;
        if (object.status === "returning") {
          object.orderstatushistory.filter((history) => {
            if (history.statushistory === "finishReturning") {
              showButton = true;
            }
          });
        }
        return showButton ? (
          <Button
            type="primary"
            onClick={() => this.confirmReceivedRequest(object)}
          >
            Confirm Received
          </Button>
        ) : (
          <Link to={`/order/handle/returning/${object.ordercode}`}>
            <Button
              icon={<OpenInNew />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }}
            />
          </Link>
        );
      },
      fixed: "right",
      width: 150,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchData = data.filter((item) => {
      return (
        item.customerfirstname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.customerlastname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.totalprice.includes(e.target.value) ||
        item.discountprice.includes(e.target.value) ||
        item.createdat.includes(e.target.value) ||
        item.status.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  onRadioChange = (e) => {
    let { data } = this.props;
    let searchValue = e.target.value;
    let searchData = [];
    switch (searchValue) {
      case "retail":
        searchData = data.filter((item) => {
          return item.campaign.length === 0;
        });
        break;

      case "wholesale":
        searchData = data.filter((item) => {
          return item.campaign.length > 0;
        });
        break;

      default:
        searchValue = "";
        break;
    }

    this.setState({
      displayData: searchData,
      searchKey: searchValue,
    });
  };

  confirmReceivedRequest = (object) => {
    //  //console.log(object);
    this.props.confirmReceived(
      object.ordercode,
      object.campaignid ? "campaign" : "retail",
      object.id
    );
  };

  render() {
    const { handleOrder, updateStatusOrder, data, storeComplainRecord } =
      this.props;
    //  //console.log(data);
    const {
      selectedRowKeys,
      displayData,
      searchKey,
      // openDetailModal,
      // viewButton,
      // openHandleModal,
      actionButton,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideSelectAll: true,
    };

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title="ORDER RETURNING"
        subTitle={`This is a order returning page`}
        footer={
          <div>
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex={3}>
                  <Button
                    type="primary"
                    onClick={() => storeComplainRecord(this.state.record)}
                    disabled={
                      !actionButton || this.state.selectedRowKeys.length === 0
                        ? true
                        : false
                    }
                    style={{ marginLeft: 3 }}
                  >
                    <Link
                      className="LinkDecorations"
                      to={
                        "/order/handle/returning/" +
                        this.state.record?.ordercode
                      }
                    >
                      {this.state.buttonTitle}
                    </Link>
                  </Button>
                </Col>
                <Col flex={3}>
                  <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 0
                      ? `Selected ${selectedRowKeys.length} items`
                      : ""}
                  </span>
                </Col>

                <Col flex={4}>
                  <Input
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Col flex={6}>
                  <Radio.Group
                    onChange={(e) => this.onRadioChange(e)}
                    defaultValue="all"
                  >
                    <Radio value="all">All Orders</Radio>
                    <Radio value="retail">Retail Orders</Radio>
                    <Radio value="wholesale">Wholesale Orders</Radio>
                  </Radio.Group>
                </Col>
                <Col flex={4}>
                  {/* <Input
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  /> */}
                </Col>
              </Row>
            </div>
            <Table
              loading={this.props.loading}
              // rowSelection={rowSelection}
              columns={this.columns}
              dataSource={
                displayData.length === 0 && searchKey === ""
                  ? this.props.data
                  : displayData
              }
              scroll={{ y: 350 }}
            />
          </div>
        }
      ></PageHeader>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(OrderReturningUI, arePropsEqual);
