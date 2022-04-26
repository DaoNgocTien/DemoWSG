import { ArrowDownOutlined, ArrowUpOutlined, DownloadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import {
  Button, Card, Col, Drawer, Input, Layout,
  Menu, PageHeader, Radio, Row, Space, Statistic, Table, Typography
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { Link, Redirect, Route } from "react-router-dom";


const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;
//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  createCampaign: PropTypes.func,
  updateCampaign: PropTypes.func,
  deleteCampaign: PropTypes.func,
};

//  default props
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

  componentDidMount() { }

  render() {
    const {
      selectedRowKeys,
    } = this.state;

    const { productList, createCampaign, updateCampaign, deleteCampaign, data } =
      this.props;
    // console.log(data);
    // const hasSelected = selectedRowKeys.length > 0;
    const arrayLocation = window.location.pathname.split("/");
    return (
      <Layout>
        <Content>
          <PageHeader
            // onBack={() => window.history.back()}
            title="WHOLESALE GROUP DASHBOARD"
            // subTitle={`This is a ${arrayLocation[2]} page`}
            // footer={

              

            // }
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
                    <Text type="warning"><ArrowDownOutlined style={{ marginTop: "5px" }} />30%</Text>
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
                    <Text type="warning"><ArrowDownOutlined />30%</Text>
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
                    <Text type="warning"><ArrowDownOutlined />30%</Text>
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
        <Sider
          style={{
            background: "#fff",
            // overflow: 'auto',
            // height: '100vh',
          }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
          //  console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
          //  console.log(collapsed, type);
          }}
        >
          <Menu theme="light">
            <Menu.Item key="1" icon={<DownloadOutlined />} style={{ textAlign: "center" }}>
              Report 01/2022
            </Menu.Item>
            <Menu.Item key="2" icon={<DownloadOutlined />} style={{ textAlign: "center" }}>
              Report 01/2022
            </Menu.Item>
            <Menu.Item key="3" icon={<DownloadOutlined />} style={{ textAlign: "center" }}>
              Report 01/2022
            </Menu.Item>
            <Menu.Item key="4" icon={<DownloadOutlined />} style={{ textAlign: "center" }}>
              Report 01/2022
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout >
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(DashboardUI, arePropsEqual);
