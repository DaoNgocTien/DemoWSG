import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import {
  Card, Col, Layout,
  PageHeader, Row, Space, Statistic, Typography
} from "antd";
import React, { Component, memo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis,
  YAxis
} from "recharts";

const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;
class DashboardUI extends Component {
  state = {
    loading: false,
    selectedRowKeys: [], // Check here to configure the default column
    loadingActionButton: false,
    editButton: false,
    deleteButton: false,
    addNewButton: true,
    openCreateModal: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: [],
    searchKey: "",
    openDrawer: false,
    record: {},
    orderList: [],
  };
  data = [
    {
      name: "Jan",
      Earnings: 0,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 10000,
      amt: 2400,
    },
    {
      name: "Mar",
      Earnings: 5000,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 15000,
      amt: 2400,
    },
    {
      name: "May",
      Earnings: 10000,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 20000,
      amt: 2400,
    },
    {
      name: "Jul",
      Earnings: 15000,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 25000,
      amt: 2400,
    },
    {
      name: "Aug",
      Earnings: 20000,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 25000,
      amt: 2400,
    },
    {
      name: "Sep",
      Earnings: 20000,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 35000,
      amt: 2400,
    },
    {
      name: "Oct",
      Earnings: 40000,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 42000,
      amt: 2400,
    },
    {
      name: "Nov",
      Earnings: 48000,
      amt: 2400,
    },
    {
      name: "",
      Earnings: 55000,
      amt: 2400,
    },
    {
      name: "Dec",
      Earnings: 62000,
      amt: 2400,
    },
  ];

  orderData = [
    {
      name: "Jan",
      Orders: 0,
      amt: 2400,
    },
    {
      name: "",
      Orders: 100,
      amt: 2400,
    },
    {
      name: "Mar",
      Orders: 70,
      amt: 2400,
    },
    {
      name: "",
      Orders: 150,
      amt: 2400,
    },
    {
      name: "May",
      Orders: 100,
      amt: 2400,
    },
    {
      name: "",
      Orders: 200,
      amt: 2400,
    },
    {
      name: "Jul",
      Orders: 150,
      amt: 2400,
    },
    {
      name: "",
      Orders: 250,
      amt: 2400,
    },
    {
      name: "Aug",
      Orders: 200,
      amt: 2400,
    },
    {
      name: "",
      Orders: 250,
      amt: 2400,
    },
    {
      name: "Sep",
      Orders: 200,
      amt: 2400,
    },
    {
      name: "",
      Orders: 350,
      amt: 2400,
    },
    {
      name: "Oct",
      Orders: 400,
      amt: 2400,
    },
    {
      name: "",
      Orders: 420,
      amt: 2400,
    },
    {
      name: "Nov",
      Orders: 480,
      amt: 2400,
    },
    {
      name: "",
      Orders: 550,
      amt: 2400,
    },
    {
      name: "Dec",
      Orders: 620,
      amt: 2400,
    },
  ];
  componentDidMount() { }

  render() {
    const {
      selectedRowKeys,
    } = this.state;

    const { productList, createCampaign, updateCampaign, deleteCampaign, data } =
      this.props;
    const arrayLocation = window.location.pathname.split("/"); 
    return (
      <Layout>
        <Content>
          <PageHeader
            title={`Hello, ${JSON.parse(localStorage.getItem('user'))?.name ?? ""}`}
            footer={
              <Row>
                <Col>
                  <Title level={3}>Income by time</Title>
                  <LineChart
                    width={500}
                    height={300}
                    data={this.data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Earnings"
                      stroke="#8884d8"
                      activeDot={{ r: 10 }}
                    />
                  </LineChart>
                </Col>

                <Col>
                  <Title level={3}>Orders by time</Title>
                  <LineChart
                    width={500}
                    height={300}
                    data={this.orderData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Orders"
                      stroke="#8884d8"
                      activeDot={{ r: 10 }}
                    />
                  </LineChart>
                </Col>

              </Row>
            }
          >
            {/* Statistic  */}
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Sales"
                    value={40000000}


                    // precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="đ"
                  />
                  <Space>
                    <Text >Last 30 days</Text>
                    <Text type="success"><ArrowUpOutlined style={{ marginTop: "5px" }} />30%</Text>
                  </Space>
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Orders"
                    value="150"
                    // precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    // prefix=""
                    suffix="Orders"
                  />
                  <Space>
                    <Text style={{ marginTop: "35px" }}>Last 30 days</Text>
                    <Text type="success"><ArrowUpOutlined />30%</Text>
                  </Space>
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Conversion Rate"
                    value={33.25}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                  />
                  <Space>
                    <Text style={{ marginTop: "35px" }}>Last 30 days</Text>
                    <Text type="success"><ArrowUpOutlined />30%</Text>
                  </Space>
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Return Rate"
                    value={9.3}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ArrowDownOutlined />}
                    suffix="%"
                  />
                  <Space>
                    <Text style={{ marginTop: "35px" }}>Last 30 days</Text>
                    <Text type="warning"><ArrowDownOutlined />30%</Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </PageHeader >
        </Content >
       
      </Layout >
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(DashboardUI, arePropsEqual);
