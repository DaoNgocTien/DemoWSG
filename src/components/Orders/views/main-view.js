import React, { Component, memo } from "react";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  PageHeader,
  Radio,
  Select,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import EditModal from "./edit-view";
import RejectModal from "./reject-view";

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  rejectOrder: PropTypes.func,
  updateStatusOrder: PropTypes.func,
  getOrder: PropTypes.func,
};

//  default props
const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
  rejectOrder: () => {},
  updateStatusOrder: () => {},
  getOrder: (status) => {},
};

class OrderUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openEditModal: false,
    openRejectModal: false,
    editButton: true,
    rejectButton: true,
  };

  componentDidMount() {}

  start = (openModal) => {
    switch (openModal) {
      case "openRejectModal":
        this.setState({ openRejectModal: true });
        break;

      case "openEditModal":
        this.setState({ openEditModal: true });
        break;

      default:
        break;
    }
  };

  changeStatus = (data) => {
    this.props.updateStatusOrder(data);
  };

  closeModal = () => {
    this.setState({
      selectedRowKeys: [],
      editButton: false,
      rejectButton: false,
    });
    this.setState({
      openRejectModal: false,
      openEditModal: false,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    this.setState({
      selectedRowKeys,
      editButton: selectedRowKeys.length === 1,
      rejectButton:
        selectedRowKeys.length === 1 &&
        record.status != "delivering" &&
        record.status != "delivered" &&
        record.status != "completed" &&
        record.status != "returned" &&
        record.status != "cancelled",
      addNewButton: selectedRowKeys.length === 0,
    });
  };
  handleChange = (data) => {
    this.props.getOrder(data);
  };
  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      render: (text, object, index) => {
        return index + 1;
      },
      fixed: "left",
      width: 80,
    },
    {
      title: "First Name",
      dataIndex: "customerfirstname",
      key: "customerfirstname",
      sorter: (a, b) => a.customerfirstname.length - b.customerfirstname.length,
      fixed: "left",
      width: 120,
    },
    {
      title: "Last Name",
      dataIndex: "customerlastname",
      key: "customerlastname",
      sorter: (a, b) => a.customerlastname.length - b.customerlastname.length,
      fixed: "left",
      width: 120,
    },
    {
      title: "Product",
      dataIndex: "details",
      key: "details",
      render: (text, object) => {
        return object.details?.length > 0 ? object.details[0]?.productname : "";
      },
      // fixed: "left",
      width: 130,
    },
    // {
    //   title: "In Campaign",
    //   dataIndex: "campaign",
    //   key: "campaign",
    //   render: (text, object) => {
    //     let campaign = object.campaign;
    //     return campaign.length > 0 ? moment(campaign[0].fromdate).format("MM/DD/YYYY") + " " + moment(campaign[0].todate).format("MM/DD/YYYY") : "";
    //     // return moment(campaign[0].fromdate).format("MM/DD/YYYY") + " " + moment(campaign[0].todate).format("MM/DD/YYYY");
    //   },
    //   width: 130,
    // },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 130,
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      width: 130,
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      render: (text, object) => {
        return object.totalprice - object.discountprice;
      },
      width: 130,
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
      width: 130,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
    },
    {
      title: "Action",
      render: (object) => {
        return (
          <Button
            onClick={() => this.changeStatus(object)}
            type="primary"
            disable={
              object.status === "created" || object.status === "processing"
                ? "false"
                : "true"
            }
          >
            Change Status
          </Button>
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
        item.createdat.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  onRadioChange = (e) => {
    console.log(e);
    let { data } = this.props;
    let searchValue = e.target.value || e;
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

  render() {
    const { rejectOrder, updateStatusOrder, data } = this.props;

    const {
      selectedRowKeys,
      displayData,
      searchKey,
      openEditModal,
      editButton,
      openRejectModal,
      rejectButton,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;

    const arrayLocation = window.location.pathname.split("/");
    // console.log(data);

    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[1].toUpperCase()}
        subTitle={`This is a ${arrayLocation[1]} page`}
        footer={
          <div>
            <EditModal
              openModal={openEditModal}
              closeModal={this.closeModal}
              updateStatusOrder={updateStatusOrder}
              record={
                this.props.data.filter((item) => {
                  return selectedRowKeys.includes(item.id);
                })[0]
              }
              selectedRowKeys={selectedRowKeys[0]}
            />

            <RejectModal
              openModal={openRejectModal}
              closeModal={this.closeModal}
              rejectOrder={rejectOrder}
              record={
                this.props.data.filter((item) => {
                  return selectedRowKeys.includes(item.id);
                })[0]
              }
              selectedRowKeys={selectedRowKeys[0]}
            />

            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex={3}>
                  <Button
                    type="primary"
                    onClick={() => this.start("openEditModal")}
                    disabled={
                      !editButton || this.state.selectedRowKeys.length === 0
                        ? true
                        : false
                    }
                    // disabled={
                    //   !editButton || this.state.selectedRowKeys.length === 0
                    //     ? true
                    //     : false
                    // }
                    style={{ marginLeft: 3 }}
                  >
                    View Details
                  </Button>

                  <Button
                    type="danger"
                    onClick={() => this.start("openRejectModal")}
                    disabled={
                      !rejectButton || this.state.selectedRowKeys.length === 0
                        ? true
                        : false
                    }
                    // disabled={
                    //   !rejectButton || this.state.selectedRowKeys.length === 0
                    //     ? true
                    //     : false
                    // }
                    style={{ marginLeft: 3 }}
                  >
                    Reject Order
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
                    onFocus={(e) => this.onRadioChange(e)}
                    defaultValue="all"
                  >
                    <Radio value="all">All Orders</Radio>
                    <Radio value="retail">Retail Orders</Radio>
                    <Radio value="wholesale">Wholesale Orders</Radio>
                  </Radio.Group>
                  Status:
                  <Select
                    title="Status"
                    defaultValue="All"
                    style={{ width: 120, marginLeft: "2px" }}
                    onChange={this.handleChange}
                  >
                    <Select.Option value={undefined}>All</Select.Option>
                    <Select.Option value="advanced">Advanced</Select.Option>
                    <Select.Option value="unpaid">Unpaid</Select.Option>
                    <Select.Option value="created">Created</Select.Option>
                    <Select.Option value="processing">Processing</Select.Option>
                    <Select.Option value="delivering">Delivering</Select.Option>
                    <Select.Option value="delivered">Delivered</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                    <Select.Option value="returned">returned</Select.Option>
                  </Select>
                </Col>
                <Col flex={4}></Col>
              </Row>
            </div>
            <Table
              loading={this.props.loading}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={
                displayData.length === 0 && searchKey === ""
                  ? this.props.data
                  : displayData
              }
              scroll={{ y: 350, x: 1000 }}
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
export default memo(OrderUI, arePropsEqual);
