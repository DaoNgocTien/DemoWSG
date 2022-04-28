import {
  Button,
  Col,
  Drawer,
  Input,
  PageHeader,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";
import OrdersInCampaign from "./orders-in-campaign-view";
import NumberFormat from "react-number-format";
import { Link, Redirect, Route } from "react-router-dom";
import { PlayCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { OpenInNew, PlayCircleFilledOutlined } from "@material-ui/icons";

const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  productList: PropTypes.array,
  defaultCampaign: PropTypes.object,
  createCampaign: PropTypes.func,
  updateCampaign: PropTypes.func,
  deleteCampaign: PropTypes.func,
};

const propsDefault = {
  index: 1,
  data: [],
  productList: [],
  defaultCampaign: {},
};

class CampaignUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    loading: false,
    selectedRowKeys: [],
    loadingActionButton: false,
    editButton: false,
    deleteButton: false,
    addNewButton: true,
    orderInCampaignButton: false,
    openCreateModal: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: [],
    searchKey: "",
    openDrawer: false,
    record: {},
    orderListInSelectedCampaign: [],
  };

  componentDidMount() { }

  start = (openModal) => {
    let selectedRowKeys = this.state.selectedRowKeys;
    let data = this.props.data;

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
        });

        break;
      case "openOrdersInCampaign": {
        let orderList = this.props.orderList;

        let orderListInSelectedCampaignInCampaign = orderList?.filter(
          (item) => {
            return selectedRowKeys.includes(item.campaignid);
          }
        );

        this.setState({
          openDrawer: true,

          orderListInSelectedCampaign: orderListInSelectedCampaignInCampaign,
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
    // {
    //   title: "No.",
    //   dataIndex: "No.",
    //   key: "No.",
    //   render: (text, object, index) => {
    //     return index + 1;
    //   },
    //   width: 100,
    //   fixed: "left",
    // },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      sorter: (a, b) => a.productname.length - b.productname.length,
      width: 200,
      fix: "left",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: 120,
      fix: "left",
    },
    {
      title: "Max Quantity",
      dataIndex: "maxquantity",
      key: "maxquantity",
      width: 120,
    },

    {
      title: "Type",
      key: "type",
      render: (object) => {
        return (
          <Tag color={!object.isshare ? "blue" : "green"}>
            {!object.isshare ? "SINGLE" : "SHARED"}
          </Tag>
        );
      },
      width: 100,
      fix: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return (
          <Tag
            color={
              data === "ready"
                ? "blue"
                : data === "active"
                  ? "red"
                  : data === "done"
                    ? "green"
                    : "grey"
            }
          >
            {data.toUpperCase() === "DEACTIVATED" ? "STOP" : data.toUpperCase()}
          </Tag>
        );
      },
      width: 100,
      fix: "right",
    },
    {
      title: "",
      key: "",
      render: (object) => {
        if (object.status === "ready") {
          return (<>

            <Link to={`/discount/campaign/${object.id}`}>
              <Button icon={<OpenInNew />}
                type="default"
                shape="circle"
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "none",
                }} />
            </Link>
            {/* <Button
              icon={<PlayCircleOutlined />}
              onClick={() => this.startCampaignBeforeHand(object)}
              type=""
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }} /> */}
          </>
          );
        } else {
          return <Link to={`/discount/campaign/${object.id}`}>
            <Button icon={<OpenInNew />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }} />
          </Link>
        }
      },
      fixed: "right",
      width: 150,
    },
  ];

  startCampaignBeforeHand = (object) => {
    this.props.startCampaignBeforeHand(object.id);
  };

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        String(item.status)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.fromdate)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.todate)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.productname)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.quantity)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.maxquantity)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.numorder)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.advancefee)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.price).toUpperCase().includes(searchString.toUpperCase())
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };

  onSelectChange = (record) => {
    if (this.state.selectedRowKeys[0] !== record.key) {
      console.log("1");
      this.props.getCampaignById(record.id);
      this.setState({
        selectedRowKeys: [record.key],
        record: record,
        editButton: true && record.status === "ready",
        deleteButton: true && record.status === "ready",
        addNewButton: false,
        orderInCampaignButton: true,
      });
    } else {
      console.log("2");
      this.setState({
        selectedRowKeys: [],
        record: {},
        editButton: false,
        deleteButton: false,
        addNewButton: true,
        orderInCampaignButton: false,
      });
    }
  };

  onCloseDrawer = () => {
    this.setState({
      openDrawer: false,
    });
  };
  render() {
    const {
      selectedRowKeys,
      deleteButton,
      editButton,
      addNewButton,
      orderInCampaignButton,
      openCreateModal,
      openDeleteModal,
      openEditModal,
      displayData,
      searchKey,
      orderListInSelectedCampaign,
    } = this.state;

    const {
      productList = [],
      createCampaign,
      updateCampaign,
      deleteCampaign,
      data,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };
    console.log(this.state.record);
    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[2].toUpperCase()}
        subTitle={`This is a ${arrayLocation[2]} page`}
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              createCampaign={createCampaign}
              productList={productList.filter((product) => {
                const availableQuantity =
                  product.quantity - product.maxquantity;
                return availableQuantity >= 10;
              })}
              campaingList={data}
            />
            {/* <DeleteModal
              loading={this.props.loading}
              openModal={openDeleteModal}
              closeModal={this.closeModal}
              deleteCampaign={deleteCampaign}
              defaultProduct={
                (productList?.filter(
                  (p) => p?.id === this.state.record?.productid
                ))[0]
              }
              productList={productList}
              record={this.state.record}
              selectedRowKeys={selectedRowKeys[0]}
            />
            <EditModal
              loading={this.props.loading}
              openModal={openEditModal}
              closeModal={this.closeModal}
              updateCampaign={updateCampaign}
              defaultProduct={
                (productList?.filter(
                  (p) => p?.id === this.state.record?.productid
                ))[0]
              }
              productList={productList}
              record={this.state.record}
              selectedRowKeys={selectedRowKeys[0]}
            /> */}

            <Row style={{ padding: "20px 0" }} gutter={[16, 0]}>
              <Col span={12}>
                <Input
                  prefix={<SearchOutlined />}
                  ref={this.searchSelf}
                  onChange={(e) => this.onChangeHandler(e)}
                  placeholder="Search for campaigns..."
                />
              </Col>
              <Col>
                <Space size={3}>
                  <Button
                    type="primary"
                    onClick={() => this.start("openCreateModal")}
                    disabled={!addNewButton}
                  >
                    Add New
                  </Button>
                  {/* <Link to={`/product/${selectedRowKeys[0]}`}>
                    <Button type="primary" disabled={!viewDetailButton}>
                      View Detail
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    onClick={() => this.start("openEditModal")}
                    disabled={!editButton}
                    style={{ width: 90 }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="danger"
                    onClick={() => this.start("openDeleteModal")}
                    disabled={!deleteButton}
                    style={{ width: 90 }}
                  >
                    Delete
                  </Button>
                  <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 0
                      ? `Selected ${selectedRowKeys.length} items`
                      : ""}
                  </span> */}
                </Space>
              </Col>
            </Row>

            {/* <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex="auto">
                  <Space size={4}>
                    <Button
                      type="primary"
                      onClick={() =>
                        this.props.storeCampaign(this.state.record)
                      }
                      disabled={!orderInCampaignButton}
                    >
                      <Link
                        className="LinkDecorations"
                        to={
                          "/discount/campaign/" +
                          this.props.record?.id
                        }
                      >
                        View Details
                      </Link>
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => this.start("openCreateModal")}
                      disabled={!addNewButton}
                    >
                      Add New
                    </Button>

                    <Button
                      type="primary"
                      onClick={() => this.start("openEditModal")}
                      disabled={!editButton}
                      style={{ width: 90 }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => this.start("openDeleteModal")}
                      disabled={!deleteButton}
                      style={{ width: 90 }}
                    >
                      Delete
                    </Button>

                    <span style={{ marginLeft: 8 }}>
                      {selectedRowKeys.length > 0
                        ? `Selected ${selectedRowKeys.length} items`
                        : ""}
                    </span>
                  </Space>
                </Col>
                <Col flex="300px">
                  <Input
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
              </Row>
            </div> */}
            {/* <Drawer
              width={window.innerWidth * 0.7}
              placement="right"
              size={"736px"}
              closable={false}
              onClose={this.onCloseDrawer}
              visible={this.state.openDrawer}
            >
              <OrdersInCampaign campaign={this.state.record} />
            </Drawer> */}
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

export default memo(CampaignUI, arePropsEqual);
