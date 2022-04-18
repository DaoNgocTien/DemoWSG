import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  PageHeader,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import action from "../../Orders/modules/action";
import { connect } from "react-redux";
import React, { memo } from "react";
import RejectModal from "../../Orders/views/reject-view";
import NumberFormat from "react-number-format";

class OrdersInCampaign extends React.Component {
  state = {
    loading: false,
    selectedRowKeys: [], // Check here to configure the default column
    loadingActionButton: false,
    rejectButton: false,
    openRejectModal: false,
    displayData: [],
    searchData: "",
  };

  componentDidMount() {
    this.props.getOrder(this.props.record.id);
  }

  onSelectChange = (record) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    if (this.state.selectedRowKeys[0] !== record.key) {
      this.setState({
        selectedRowKeys: [record.key],
        record: record,
        rejectButton: true,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        rejectButton: false,
      });
    }
  };

  openModal = () => {
    this.setState({ openRejectModal: true });
  };

  closeModal = () => {
    this.setState({
      selectedRowKeys: [],
      rejectButton: false,
    });
    this.setState({
      openRejectModal: false,
    });
  };

  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      render: (_text, _object, index) => {
        return index + 1;
      },
      width:70,
      fixed: "left",
    },
    {
      title: "Customer Name",
      width: 150,
      render: (_text, object, _index) => {
        // console.log(object);
        return object.customerfirstname + " " + object.customerlastname;
      },
      fixed: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>
      },
      width: 100,
       fixed: "left",
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      width: 120,
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
    },
    // {
    //   title: "Product Name",
    //   width: 200,
    //   render: (_text, object, _index) => {
    //     // console.log(object);
    //     return object.details[0].productname;
    //   },
    // },
    // {
    //   title: "Product Image",
    //   width: 150,
    //   render: (_text, object, _index) => {
    //     // console.log(object);
    //     return object.details[0].image === "" ? (
    //       ""
    //     ) : (
    //       <img
    //         width="100"
    //         alt="show illustrative representation"
    //         height="100"
    //         src={JSON.parse(object.details[0]?.image)[0].url}
    //       />
    //     );
    //   },
    // },
    {
      title: "Quantity",
      width: 100,
      render: (_text, object, _index) => {
        // console.log(object);
        return object.details[0].quantity;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 100,
      render: (_text, object) => {
        return (
          <NumberFormat
            value={object.totalprice}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      width: 150,
      render: (_text, object) => {
        return (
          <NumberFormat
            value={object.discountprice}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      width: 100,
      render: (_text, object) => {
        return (
          <NumberFormat
            value={object.totalprice - object.discountprice}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Notes",
      width: 300,
      render: (_text, object, _index) => {
        // console.log(object);
        return object.details[0].notes;
      },
    },
    
   
  ];

  onChangeHandler = (e) => {
    let orderList = this.props.orderList.filter(
      (order) => order.campaignid === this.props.record?.id
    );

    let searchList = orderList.filter((item) => {
      return (
        item.customerfirstname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.customerlastname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.totalprice.includes(e.target.value) ||
        item.discountprice.includes(e.target.value) ||
        item.createdat.includes(e.target.value) ||
        item.status.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchList,
      searchData: e.target.value,
    });
  };

  render() {
    const {
      selectedRowKeys,
      rejectButton,
      displayData,
      searchData,
      openRejectModal,
    } = this.state;

    const {
      campaign,
      loading,
      rejectOrder,
      orderList = [],
      record,
    } = this.props;
    // console.log(ordersInCampaign);

    //  console.log(this.props);

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };
    console.log(record);
    return (
      <>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="CAMPAIGN DETAILS"
          subTitle={`This is a campaign detail page`}
          // extra={[
          //   <Button
          //     type="danger"
          //     onClick={this.showModal}
          //     style={{ marginLeft: 3 }}
          //     hidden={this.props.record?.complainRecord?.status === "returned" || handledBySupplier > 1}
          //   >
          //     Reject Returning Request
          //   </Button>,

          //   <Button
          //     type="primary"
          //     onClick={this.handleAcceptAndClose}
          //     style={{ marginLeft: 3 }}
          //     hidden={this.props.record?.complainRecord?.status === "returned" || handledBySupplier > 1}
          //   >
          //     Accept Returning Request
          //   </Button>,
          //   <Button
          //     type="primary"
          //     onClick={() => window.history.back()}
          //     style={{ marginLeft: 3 }}
          //     hidden={!(this.props.record?.complainRecord?.status === "returned" || handledBySupplier > 1)}
          //   >
          //     Back
          //   </Button>,
          // ]}
          footer={
            <div>
              <RejectModal
                openModal={openRejectModal}
                closeModal={this.closeModal}
                rejectOrder={rejectOrder}
                record={orderList.find((item) => {
                  return selectedRowKeys[0] === item?.id;
                })}
                campaignId={record?.id}
              />
              <div style={{ marginBottom: 16 }}>
                <Row>
                  <Col flex="auto">
                    <Space size={3}>
                      <Button
                        type="danger"
                        onClick={() => this.openModal()}
                        disabled={!rejectButton}
                        style={{ width: 90 }}
                      >
                        Reject
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
              <Table
                loading={loading}
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={
                  displayData.length === 0 && searchData === ""
                    ? orderList.filter(
                        (order) => order.status.toUpperCase() !== "NOTADVANCED"
                      )
                    : displayData
                }
                scroll={{ y: 350 }}
              />
            </div>
          }
        >
          <Form>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Name">
                {record?.description}
              </Descriptions.Item>
              <Descriptions.Item label="Campaign duration">
                {moment(record?.fromdate).format("MM/DD/YYYY") +
                  ` - ` +
                  moment(record?.todate).format("MM/DD/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Campaign Type">
                <Tag color={!record?.isshare ? "blue" : "green"}>{!record?.isshare ? "SINGLE" : "SHARED"}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Campaign Status">
                <Tag color={record?.status === "ready" ? "blue" : record?.status === "active" ? "red" : record?.status === "done" ? "green" : "grey"}>{record?.status.toUpperCase()}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                {record?.productname}
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale price">
                {record?.price}
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                {record?.quantity}
              </Descriptions.Item>

              <Descriptions.Item label="Max quantity">
                {record?.maxquantity}
              </Descriptions.Item>

              <Descriptions.Item label="Campaign Code">
                {record?.code}
              </Descriptions.Item>

              <Descriptions.Item label="Number of order">
                {record?.numorder}
              </Descriptions.Item>

              <Descriptions.Item label="Product Image" span={2}>
                <img
                  width="100"
                  alt="show illustrative representation"
                  height="100"
                  src={JSON.parse(record?.productimage)[0].url}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Description" span={2}>
                {record?.description}
              </Descriptions.Item>

            </Descriptions>
          </Form>
          <PageHeader className="site-page-header-responsive"></PageHeader>
        </PageHeader>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.orderReducer.loading,
    orderList: state.orderReducer.data.orders,
    error: state.orderReducer.err,
    record: state.campaignReducer.record,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrder: async (id) => {
      await dispatch(action.getOrderByCampaignId(id));
    },
    rejectOrder: async (
      orderCode,
      type,
      description,
      image,
      orderId,
      campaignId = null
    ) => {
      //  console.log("Campaign");

      await dispatch(
        action.rejectOrder(orderCode, type, description, image, orderId)
      );
      await dispatch(action.getOrderByCampaignId(campaignId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersInCampaign);
