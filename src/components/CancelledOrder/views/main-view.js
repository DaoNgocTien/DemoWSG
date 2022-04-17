import {
  Button, Col, Input, PageHeader,
  Radio, Row, Select, Table, Tag
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import EditModal from "./edit-view";
import RejectModal from "./reject-view";
import NumberFormat from "react-number-format";
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  rejectOrder: PropTypes.func,
  updateStatusOrder: PropTypes.func,
  getOrder: PropTypes.func,
};

const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
  rejectOrder: () => { },
  updateStatusOrder: () => { },
  getOrder: (status) => { },
};

class CancelledOrderUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [],
    loading: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openEditModal: false,
    openRejectModal: false,
    editButton: true,
    viewButton: true,
  };

  componentDidMount() { }

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
      viewButton: false,
      record:{}
    });
    this.setState({
      openRejectModal: false,
      openEditModal: false,
      
    });
  };

  onSelectChange = (selectedRowKeys) => {
    let record = this.props.data?.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    this.setState({
      selectedRowKeys,
      editButton: selectedRowKeys.length === 1,
      viewButton:
        selectedRowKeys.length === 1
    });
  };
  // handleChange = (data) => {
  //   this.props.getOrder(data);
  // };
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
    // {
    //   title: "Product",
    //   dataIndex: "details",
    //   key: "details",
    //   render: (text, object) => {
    //     return object.details?.length > 0 ? object.details[0]?.productname : "";
    //   },

    //   width: 130,
    // },

    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 130,
      render: (_text, object) => {
        return <NumberFormat
          value={object.totalprice }
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      width: 130,
      render: (_text, object) => {
        return <NumberFormat
          value={object.discountprice}
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      width: 130,
      render: (_text, object) => {
        return <NumberFormat
          value={object.totalprice - object.discountprice}
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
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
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>
      },
      width: 130,
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
        item.finalprice.includes(e.target.value) ||
        item.createdat.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  onRadioChange = (e) => {
  //  console.log(e);
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
      viewButton,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title="CANCELLED ORDER"
        subTitle={`This is a cancelled order page`}
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
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex={3}>

                  <Button
                    type="primary"
                    onClick={() => this.start("openEditModal")}
                    disabled={
                      !viewButton || this.state.selectedRowKeys.length === 0
                        ? true
                        : false
                    }
                    style={{ marginLeft: 3 }}
                  >
                    View Details
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

export default memo(CancelledOrderUI, arePropsEqual);
