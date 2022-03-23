import React, { Component, memo } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  PageHeader,
  Space,
  Drawer,
  Statistic,
  Layout,
  Menu,
  Card,
  Typography,
  Radio,
} from "antd";
import { DownloadOutlined, ArrowUpOutlined, VideoCameraOutlined, ArrowDownOutlined } from '@ant-design/icons';

import moment from "moment";
import PropTypes from "prop-types";

import SettlePaymentUI from "./settle-payment-view";
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

class TransactionUI extends Component {
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

  start = (openModal) => {
    let selectedRowKeys = this.state.selectedRowKeys;
    let data = this.props.data;
    //  Get campaign record
    let recordToEdit = data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    switch (openModal) {
      case "openCreateModal":
        this.setState({ loadingActionButton: true, openCreateModal: true });
        break;

      case "openDeleteModal":
        this.setState({ loadingActionButton: true, openDeleteModal: true });

        break;

      case "openEditModal":
        this.setState({
          loadingActionButton: true,
          openEditModal: true,
          record: recordToEdit,
        });

        break;
      case "openSettlePaymentUI": {
        //  Get orders in campaign
        let orderList = this.props.orderList;
        let orderListInCampaign = orderList?.filter((item) => {
          return selectedRowKeys.includes(item.campaignid);
        });
        this.props.getCampaign(selectedRowKeys);

        //  Set campaign record and orders in campaign into state
        this.setState({
          openDrawer: true,
          record: recordToEdit,
          orderList: orderListInCampaign,
        });

        break;
      }
      default:
        break;
    }
  };

  closeModal = () => {
    this.setState({
      openCreateModal: false,
      openDeleteModal: false,
      openEditModal: false,
    });
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
      sorter: (a, b) => a.ordercode.length - b.ordercode.length,
      fix: "left",
    },
    {
      title: "Customer",
      dataIndex: "customerlastname",
      key: "customerlastname",
    },
    {
      title: "Value",
      dataIndex: "totalprice",
      key: "totalprice",
    },
    {
      title: "Finished At",
      dataIndex: "updatedat",
      key: "updatedat",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "Action",
      render: (object) => {
        return (
          <Button
            onClick={() => this.settlePayment(object)}
            type="primary"
          >
            <Link className="LinkDecorations" to="/transaction/settle">
              {object.status === "cancelled" || object.status === "returned" ? `View Transaction` : `Settle Payment`}
            </Link>
          </Button>
        );
      },
      fixed: 'right',
      width: 130,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        item.productname.toUpperCase().includes(searchString.toUpperCase()) ||
        item.fromdate.includes(searchString) ||
        item.todate.includes(searchString)
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };

  onSelectChange = (selectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    // console.log(this.props.data);
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    // console.log(record);
    // this.setState({
    //   record: this.props.data.filter((item) => {
    //     return selectedRowKeys.includes(item.id);
    //   })[0]
    // });
    // // console.log(this.state.record);
    this.setState({
      selectedRowKeys,
      record: record,
      editButton: selectedRowKeys.length === 1,
      deleteButton: selectedRowKeys.length === 1,
      addNewButton: selectedRowKeys.length === 0,
    });
  };

  onRadioChange = e => {
    let { data } = this.props;
    let searchValue = e.target.value;
    let searchData = [];
    switch (searchValue) {
      case "available":
        searchData = data.filter((item) => {
          return item.status === "completed";
        });
        break;

      case "settled":
        searchData = data.filter((item) => {
          return item.status === "completed";
        });
        break;

      case "returned":
        searchData = data.filter((item) => {
          return item.status === "returned";
        });
        break;

      case "cancelled":
        searchData = data.filter((item) => {
          return item.status === "cancelled";
        });
        break;

      default:
        searchData = data;
        searchValue = "";
        break;
    }

    this.setState({
      displayData: searchData,
      searchKey: searchValue,
    });
  };

  settlePayment = item => {
    const list = [];
    list.push(item);
    this.props.storeSettlingPaymentList(list);
    // this.setState({
    //   openDrawer: true,
    //   record: item,
    // });
  }

  render() {
    const {
      selectedRowKeys,
      deleteButton,
      editButton,
      addNewButton,
      openCreateModal,
      openDeleteModal,
      openEditModal,
      displayData,
      searchKey,
    } = this.state;

    const { productList, createCampaign, updateCampaign, deleteCampaign, data } =
      this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // console.log(data);
    // const hasSelected = selectedRowKeys.length > 0;
    const arrayLocation = window.location.pathname.split("/");
    return (
          <PageHeader
            onBack={() => window.history.back()}
            title="TRANSACTION PAGE"
            subTitle={`This is a ${arrayLocation[2]} page`}
            footer={

              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <div>
                  {/* <CreateModal
                    openModal={openCreateModal}
                    closeModal={this.closeModal}
                    createCampaign={createCampaign}
                    productList={productList}
                  />
                  <DeleteModal
                    openModal={openDeleteModal}
                    closeModal={this.closeModal}
                    deleteCampaign={deleteCampaign}
                    productList={productList}
                    updateCampaign={updateCampaign}
                    record={this.state.record}
                    selectedRowKeys={selectedRowKeys[0]}
                  />
                  <EditModal
                    loading={this.props.loading}
                    openModal={openEditModal}
                    closeModal={this.closeModal}
                    productList={productList}
                    updateCampaign={updateCampaign}
                    record={this.state.record}
                    selectedRowKeys={selectedRowKeys[0]}
                  /> */}
                  <div style={{ marginBottom: 16 }}>
                    <Row>
                      <Col flex="auto">
                        <Space size={4}>
                          <Radio.Group onChange={(e) => this.onRadioChange(e)} defaultValue="all">
                            <Radio value="all">All Finished Orders</Radio>
                            <Radio value="available">Settle Available</Radio>
                            <Radio value="settled">Settled</Radio>
                            <Radio value="returned">Returned</Radio>
                            <Radio value="cancelled">Cancelled</Radio>
                          </Radio.Group>
                        </Space>
                      </Col>
                      <Col flex="300px">
                        <Input
                          onChange={(e) => this.onChangeHandler(e)}
                          placeholder="Search data"
                        />
                      </Col>
                    </Row>
                  </div>
                  <Drawer
                    width={window.innerWidth * 0.7}
                    height={window.innerWidth * 0.5}
                    placement="bottom"
                    size={window.innerWidth * 0.7}
                    closable={false}
                    onClose={this.onCloseDrawer}
                    visible={this.state.openDrawer}
                  >
                    {/* <SettlePaymentUI
                      record={this.state.record}
                      loading={this.props.loading}
                    /> */}
                  </Drawer>
                  <Table
                    loading={this.props.loading}
                    // rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={
                      displayData.length === 0 && searchKey === ""
                        ? this.props.data
                        : displayData
                    }
                    scroll={{ y: 300 }}
                  />
                </div>
              </div>



            }
          >
            {/* Statistic  */}
            {/* <Row gutter={16}>
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
            </Row> */}
          </PageHeader >
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(TransactionUI, arePropsEqual);
