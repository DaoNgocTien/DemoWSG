import {
  SearchOutlined
} from "@ant-design/icons";
import {
  LocalShipping, OpenInNew
} from "@material-ui/icons";
import {
  Button,
  Col,
  Input,
  PageHeader, Row,
  Table, Tag
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

class OrderReturningUI extends Component {
  state = {
    loading: false,
    displayData: [],
    searchKey: "",
    record: {},
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
      title: "Type",
      key: "type",
      render: (object) => {
        return object.campaign.length === 0 ?
          <Tag color={"green"}>RETAIL</Tag>
          :
          <Tag color={"bule"}>WHOLESALE</Tag>
      },
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>;
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
            icon={<LocalShipping />}
            shape="circle"
            style={{
              border: "none",
              boxShadow: "none",
              background: "none",
            }}
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

  confirmReceivedRequest = (object) => {
    this.props.confirmReceived(
      object.ordercode,
      object.campaignid ? "campaign" : "retail",
      object.id
    );
  };

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchData = data.filter((item) => {
      return (
        String(item.customerfirstname)?.toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        String(item.customerlastname)?.toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        String(item.ordercode)?.toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        String(item.createdat)?.toUpperCase()
          .includes(e.target.value.toUpperCase())
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  render() {
    const {
      displayData,
      searchKey,
    } = this.state;

    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={"RETURNING REQUEST"}
        subTitle={"Returning requests are handled in this page"}
        footer={
          <div>
            <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
              <Col span={12}>
                <Input
                  prefix={<SearchOutlined />}
                  ref={this.searchSelf}
                  onChange={(e) => this.onChangeHandler(e)}
                  placeholder="Search data"
                />
              </Col>

            </Row>
            <Table
              loading={this.props.loading}
              columns={this.columns}
              dataSource={
                displayData.length === 0 && searchKey === ""
                  ? this.props.data
                  : displayData
              }
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
