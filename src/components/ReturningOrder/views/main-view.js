import React, { Component, memo } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import { Table, Button, Input, Row, Col, PageHeader, Radio, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  handleOrder: PropTypes.func,
  updateStatusOrder: PropTypes.func,
};

//  default props
const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
  handleOrder: () => {},
  updateStatusOrder: () => {},
};

class OrderReturningUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openDetailModal: false,
    openHandleModal: false,
    viewButton: true,
    actionButton: true,
    record: {},
  };

  componentDidMount() {}

  start = (openModal) => {
    switch (openModal) {
      case "openHandleModal":
        this.setState({ openHandleModal: true });
        break;

      case "openDetailModal":
        this.setState({ openDetailModal: true });
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
      viewButton: false,
      actionButton: false,
    });
    this.setState({
      openHandleModal: false,
      openDetailModal: false,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    this.setState({
      selectedRowKeys,
      viewButton: selectedRowKeys.length === 1 && record.status != "returned",
      actionButton:
        selectedRowKeys.length === 1 &&
        record.status != "delivering" &&
        record.status != "delivered" &&
        record.status != "completed" &&
        record.status != "returned" &&
        record.status != "cancelled",
      addNewButton: selectedRowKeys.length === 0,
      record: record,
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
      fixed: "left",
      width: 100,
    },
    {
      title: "First Name",
      dataIndex: "customerfirstname",
      key: "customerfirstname",
      sorter: (a, b) => a.customerfirstname.length - b.customerfirstname.length,
      fix: "left",
      width: 100,
    },
    {
      title: "Last Name",
      dataIndex: "customerlastname",
      key: "customerlastname",
      sorter: (a, b) => a.customerlastname.length - b.customerlastname.length,
      fix: "left",
      width: 100,
    },
    // {
    //   title: "Product",
    //   dataIndex: "details",
    //   key: "details",
    //   fixed: "left",
    //   render: (text, object) => {
    //     return object.details?.length > 0 ? object.details[0]?.productname : "";
    //   },

    // },
    {
      title: "In Campaign",
      dataIndex: "campaign",
      key: "campaign",
      render: (text, object) => {
        let campaign = object.campaign;
        return campaign.length > 0
          ? moment(campaign[0].fromdate).format("MM/DD/YYYY") +
              " " +
              moment(campaign[0].todate).format("MM/DD/YYYY")
          : "";
        // return moment(campaign[0].fromdate).format("MM/DD/YYYY") + " " + moment(campaign[0].todate).format("MM/DD/YYYY");
      },
      width: 100,
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 100,
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      width: 100,
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      render: (text, object) => {
        return object.totalprice - object.discountprice;
      },
      width: 100,
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return data === "returned" ?  
        <Tag color="blue">{data}</Tag>:
        <Tag color="red">{data}</Tag>
      },
      width: 100,
    },
    {
      title: "Action",
      render: (object) => {
        //  Condition:
        //  - Order in returning
        //  - Order status history: có tồn tại statusHistory là finishReturning hay không, có thì cho confirm
        if (object.status === "returning" && object.status === "returning" ) {
          return (
            <Button
              // onClick={() => this.changeStatus(object)}
              type="primary"
            >
              Confirm Received 
            </Button>
          );
        }

        // if (object.status === "processing") {
        //   return (
        //     <Button
        //       onClick={() => this.changeStatus(object)}
        //       type="primary"
        //     >
        //       Deliver Order
        //     </Button>
        //   );
        // }


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
    let { data } = this.props;
    let searchValue = e.target.value;
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
    const { handleOrder, updateStatusOrder, data, storeComplainRecord } =
      this.props;
    console.log(data);
    const {
      selectedRowKeys,
      displayData,
      searchKey,
      openDetailModal,
      viewButton,
      openHandleModal,
      actionButton,
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
        title="ORDER RETURNING"
        subTitle={`This is a order returning page`}
        footer={
          <div>
           

            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex={3}>
                  

                  <Button
                    type="primary"
                    onClick={() => storeComplainRecord(this.state.record)}
                    disabled={
                      !actionButton || this.state.selectedRowKeys.length === 0
                        ? true
                        : false
                    }
                    // disabled={
                    //   !actionButton || this.state.selectedRowKeys.length === 0
                    //     ? true
                    //     : false
                    // }
                    style={{ marginLeft: 3 }}
                  >
                    <Link className="LinkDecorations" to={"/order/handle/returning/" + this.state.record?.ordercode}>
                      Handle Returning Request
                    </Link>
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
                    defaultValue="all"
                  >
                    <Radio value="all">All Orders</Radio>
                    <Radio value="retail">Retail Orders</Radio>
                    <Radio value="wholesale">Wholesale Orders</Radio>
                  </Radio.Group>
                </Col>
                <Col flex={4}>
                  {/* <Input
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  /> */}
                </Col>
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

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(OrderReturningUI, arePropsEqual);
