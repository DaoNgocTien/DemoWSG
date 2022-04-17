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

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  productList: PropTypes.array,
  defaultCampaign: PropTypes.object,
  createCampaign: PropTypes.func,
  updateCampaign: PropTypes.func,
  deleteCampaign: PropTypes.func,
};

//  default props
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
    selectedRowKeys: [], // Check here to configure the default column
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
      case "openOrdersInCampaign": {
        //  List orders
        let orderList = this.props.orderList;
        //  List orders in campaign
        let orderListInSelectedCampaignInCampaign = orderList?.filter(
          (item) => {
            return selectedRowKeys.includes(item.campaignid);
          }
        );

        //  Set campaign record and orders in campaign into state
        this.setState({
          openDrawer: true,
          record: recordToEdit,
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
      record:{}
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
    },
    {
      title: "Max Quantity",
      dataIndex: "maxquantity",
      key: "maxquantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 200,
      key: "price",
      render: (data) => {
        return (
          <NumberFormat
            value={data ?? "0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Orders",
      dataIndex: "numorder",
      key: "numorder",
    },
    {
      title: "Advance Percent",
      dataIndex: "advancefee",
      key: "advancefee",
      render: (data) => data + "%",
    },
    {
      title: "Start Date",
      dataIndex: "fromdate",
      key: "fromdate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "todate",
      key: "todate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag color={data === "ready" ? "blue" : data === "active" ? "red" : data === "done" ? "green" : "grey"}>{data.toUpperCase()}</Tag>;
      },
      width: 100,
      fix: "right"
    },
    {
      title: "Action",
      render: (object) => {
        // let disabled = object.status === "created" ? "false" : "true";
        // console.log(disabled);
        if (object.status === "ready") {
          return (
            <Button
              onClick={() => this.startCampaignBeforeHand(object)}
              type="primary"
            >
              Start Campaign
            </Button>
          );
        }

        // if (object.status === "processing") {
        //   return (
        //     <Button onClick={() => this.openUploadModal(object)} type="primary">
        //       Deliver Order
        //     </Button>
        //   );
        // }
      },
      fixed: "right",
      width: 150,
    },
  ];


  startCampaignBeforeHand = object => {
    this.props.startCampaignBeforeHand(object.id);
  }

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

  onSelectChange = (selectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    // console.log(this.props.data);
    let record = this.props.data?.filter((item) => {
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
      editButton: selectedRowKeys.length === 1 && record.status === "ready",
      deleteButton: selectedRowKeys.length === 1 && record.status === "ready",
      addNewButton: selectedRowKeys.length === 0,
      orderInCampaignButton: selectedRowKeys.length === 1,
    });
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
  //  console.log(productList);
    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };
    // const hasSelected = selectedRowKeys.length > 0;
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
                return product.quantity - product.maxquantity >= 10;
              })}
              campaingList={data}
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
            />
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex="auto">
                  <Space size={4}>
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
                    <Button
                      type="primary"
                      onClick={() => this.start("openOrdersInCampaign")}
                      disabled={!orderInCampaignButton}
                    // style={{ width: 90 }}
                    >
                      Orders in campaigns
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
            </div>
            <Drawer
              width={window.innerWidth * 0.7}
              placement="right"
              size={"736px"}
              closable={false}
              onClose={this.onCloseDrawer}
              visible={this.state.openDrawer}
            >
              <OrdersInCampaign
                campaign={this.state.record}
              // orderList={this.state.orderListInSelectedCampaign}
              // loading={this.props.loading}
              // productList={productList}
              // rejectOrder={this.props.rejectOrder}
              />
            </Drawer>
            <Table
              loading={this.props.loading}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={
                displayData.length === 0 && searchKey === ""
                  ? this.props.data
                  : displayData
              }
              scroll={{ y: 350, x: 1700 }}
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

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(CampaignUI, arePropsEqual);
