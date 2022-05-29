import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import {
  Card, Col, Layout,
  PageHeader, Result, Row, Space, Statistic, Typography
} from "antd";
import axios from 'axios';
import React, { Component, memo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis,
  YAxis
} from "recharts";

const { Content } = Layout;
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
    statistical: {}
  };

  orderData = [
    {
      month: "Jan",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Feb",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Mar",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Apr",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "May",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Jun",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Jul",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Aug",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Sep",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Oct",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Nov",
      totalincome: 0,
      totalorders: 0,
    },
    {
      month: "Dec",
      totalincome: 0,
      totalorders: 0,
    }
  ];
  componentDidMount() {
    axios({
      url: `/statistical/supplier`,
      method: "GET",
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    }).then(result => {
      if (result.data.redirectUrl) { 
        if (result.data.redirectUrl === '/login') {
          localStorage.clear()
        }
        return window.location = result.data.redirectUrl 
      }
      if (result.status === 200) {
        this.setState({
          statistical: result.data
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const {
      statistical,
    } = this.state;
    if (Object.keys(statistical).length === 0) {
      return <></>
    }
    this.orderData?.map(item => {
      const income = statistical.income?.find(element => element.month === item.month)
      const orders = statistical.orders?.find(element => element.month === item.month)
      if(income) {
        item.totalincome = parseFloat(income.totalincome)
      }
      if(orders) {
        item.totalorders = parseFloat(orders.totalorders)
      }
    })

    console.log(this.orderData)
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
                    data={this.orderData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalincome"
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
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalorders"
                      stroke="#8884d8"
                      activeDot={{ r: 10 }}
                    />
                  </LineChart>
                </Col>

              </Row>
            }
          >
            {/* Statistic  */}
            <Row gutter={12}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Sales"
                    value={parseFloat(statistical.totalIncomeInThisMonth?.sum || 0)}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="đ"
                  />
                  <Space>
                    {/* <Text >Last 30 days</Text> */}
                    {/* <Text type="success"><ArrowUpOutlined style={{ marginTop: "5px" }} />30%</Text> */}
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card>
                  <Statistic
                    title="Orders"
                    value={parseFloat(statistical.totalOrderInThisMonth?.count || 0)}
                    valueStyle={{ color: '#3f8600' }}
                    suffix="Orders"
                  />
                  <Space>
                    {/* <Text style={{ marginTop: "35px" }}>Last 30 days</Text> */}
                    {/* <Text type="success"><ArrowUpOutlined />30%</Text> */}
                  </Space>
                </Card>
              </Col>

              {/* <Col span={6}>
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
              </Col> */}
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
