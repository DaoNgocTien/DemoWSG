import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Input,
  Layout,
  Menu,
  PageHeader,
  Radio,
  Row,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { Link, Redirect, Route } from "react-router-dom";
import { Line } from "@ant-design/charts";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
};

const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
};

class DashboardUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    loading: false,
    selectedRowKeys: [],
    loadingActionButton: false,
    editButton: false,
    deleteButton: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openDrawer: false,
    record: {},
    orderList: [],
  };

  componentDidMount() {}

  data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  config = {
    data,
    width: 800,
    height: 400,
    autoFit: false,
    xField: "year",
    yField: "value",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  render() {
    const { selectedRowKeys } = this.state;

    const {
      productList,
      createCampaign,
      updateCampaign,
      deleteCampaign,
      data,
    } = this.props;

    const arrayLocation = window.location.pathname.split("/");
    return (
      <Layout>
        <Content>
          <PageHeader title="WHOLESALE GROUP DASHBOARD">
            {/* Statistic  */}
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Sales"
                    value={40000000}
                    valueStyle={{ color: "#3f8600" }}
                    prefix="đ"
                  />
                  <Space>
                    <Text>Last 30 days</Text>
                    <Text type="warning">
                      <ArrowDownOutlined style={{ marginTop: "5px" }} />
                      30%
                    </Text>
                  </Space>
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Orders"
                    value="150"
                    valueStyle={{ color: "#3f8600" }}
                    suffix="Orders"
                  />
                  <Space>
                    <Text style={{ marginTop: "35px" }}>Last 30 days</Text>
                    <Text type="warning">
                      <ArrowDownOutlined />
                      30%
                    </Text>
                  </Space>
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Conversion Rate"
                    value={33.25}
                    precision={2}
                    valueStyle={{ color: "#3f8600" }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                  />
                  <Space>
                    <Text style={{ marginTop: "35px" }}>Last 30 days</Text>
                    <Text type="warning">
                      <ArrowDownOutlined />
                      30%
                    </Text>
                  </Space>
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Return Rate"
                    value={9.3}
                    precision={2}
                    valueStyle={{ color: "#cf1322" }}
                    prefix={<ArrowDownOutlined />}
                    suffix="%"
                  />
                  <Space>
                    <Text style={{ marginTop: "35px" }}>Last 30 days</Text>
                    <Text type="warning">
                      <ArrowDownOutlined />
                      30%
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </PageHeader>
        </Content>
        <Line />
      </Layout>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(DashboardUI, arePropsEqual);
