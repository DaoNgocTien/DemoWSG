import { LocalShipping, OpenInNew, PlayCircleOutline } from "@material-ui/icons";
import {
  Button,
  Col,
  Descriptions,
  Form, Image, Input,
  PageHeader, Popover, Row,
  Table,
  Tag
} from "antd";
import moment from "moment";
import React from "react";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import action from "../../Orders/modules/action";
import RejectModal from "../../Orders/views/reject-view";
import { default as campaignAction } from "../modules/action";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";


class OrdersInCampaign extends React.Component {
  state = {
    loading: false,
    selectedRowKeys: [],
    loadingActionButton: false,
    rejectButton: false,
    openRejectModal: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: [],
    searchData: "",
    record: {},
    visiblePop: false,
    confirmLoading: false,
    stepVisible: false,
  };

  componentDidMount() {
    this.props.getCampaignById(this.props.match.params.id);
  }

  onSelectChange = (record) => {
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
      openDeleteModal: false,
      openEditModal: false,
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
      width: 70,
      // fixed: "left",
    },
    {
      title: "Customer Name",
      key: "customerName",
      width: 150,
      render: (_text, object, _index) => {
        return object.customerfirstname + " " + object.customerlastname;
      },
      // fixed: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>;
      },
      width: 100,
      // fixed: "left",
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

    {
      title: "Quantity",
      key: "quantity",
      width: 100,
      render: (_text, object, _index) => {
        return object.details[0].quantity;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 200,
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
      width: 200,
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
      width: 200,
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
      title: "",
      width: 130,
      render: (object) => {
        return (
          <>
            <Link to={`/orders/${object.ordercode}`}>
              <Button
                icon={<OpenInNew />}
                type="default"
                shape="circle"
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "none",
                }}
              />
            </Link>
            <Button
              onClick={() => this.changeStatus(object, [])}
              icon={<PlayCircleOutline />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }}
              hidden={object.status !== "created"}
            />
            <Button
              onClick={() => this.openUploadModal(object)}
              icon={<LocalShipping />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }}
              hidden={object.status !== "processing"}
            />
          </>
        );
      },
      fixed: "right",
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

  handleOk = () => {
    this.props.startCampaignBeforeHand(this.props.record?.id);
    this.setState({ confirmLoading: true });
    setTimeout(() => {
      this.setState({ visiblePop: false });
      this.setState({ confirmLoading: false });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({ visiblePop: false });
  };

  hide = () => {
    this.setState({
      stepVisible: false,
    });
  };

  handleVisibleChange = (stepVisible) => {
    this.setState({ stepVisible });
  };

  stepCloumns = [
    {
      title: "Products Up To",
      dataIndex: "quantity",
      key: "quantity",
      width: 50
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 50,
      render: (_text, object) => {
        return (
          <NumberFormat
            value={object.price}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
  ];

  start = (openModal) => {
    switch (openModal) {
      case "openDeleteModal":
        this.setState({
          openDeleteModal: true,
        });
        break;

      case "openEditModal":
        this.setState({
          openEditModal: true,
        });
        break;

      default:
        break;
    }
  };

  render() {
    const {
      selectedRowKeys,
      rejectButton,
      displayData,
      searchData,
      openRejectModal,
      openDeleteModal,
      openEditModal,
    } = this.state;

    const {
      loading,
      rejectOrder,
      deleteCampaign,
      updateCampaign,
      orderList = [],
      record,
      isStartAbleMessage,
      isStartAble,
      productList,
    } = this.props;
    console.log(this.props);
    return (
      <>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="CAMPAIGN DETAILS"
          subTitle={`This is a campaign detail page`}
          extra={[
            <Button
              key={"primary"}
              type="primary"
              onClick={() => this.props.startCampaignBeforeHand(record?.id)}
              hidden={record?.status !== "ready"}
              disabled={!isStartAble}
            >
              {isStartAble ? (
                "Start Campaign"
              ) : (
                <Popover
                  content={isStartAbleMessage}
                  title="Reason campaign can not be started!"
                >
                  Start Campaign
                </Popover>
              )}
            </Button>,
            <Button
              key={"done"}
              onClick={() => this.props.doneCampaignBeforeHand(record?.id)}
              type="primary"
              hidden={record?.status !== "active"}
            >
              Done Campaign
            </Button>,
            <Button
              key={"edit"}
              onClick={() => this.start("openEditModal")}
              type="primary"
              hidden={record?.status !== "ready"}
            >
              Edit Campaign
            </Button>,
            <Button
              key="delete"
              onClick={() => this.start("openDeleteModal")}
              type="danger"
              hidden={record?.status !== "ready"}
            >
              Delete Campaign
            </Button>,
          ]}
          footer={
            <div>
              <DeleteModal
                loading={this.props.loading}
                openModal={openDeleteModal}
                closeModal={this.closeModal}
                deleteCampaign={deleteCampaign}
                defaultProduct={record?.product}
                productList={productList}
                record={record}
              />
              <EditModal
                loading={this.props.loading}
                openModal={openEditModal}
                closeModal={this.closeModal}
                updateCampaign={updateCampaign}
                defaultProduct={record?.product}
                productList={productList}
                record={record}
              />
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
                <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
                  <Col span={12}>
                    <Input
                      onChange={(e) => this.onChangeHandler(e)}
                      placeholder="Search data"
                    />
                  </Col>
                  <Col span={3}>
                    <Button
                      type="danger"
                      onClick={() => this.openModal()}
                      disabled={!rejectButton}
                      hidden={record?.status !== "active"}
                      block
                    >
                      Reject
                    </Button>
                  </Col>

                </Row>
              </div>
              <Table
                loading={loading}
                columns={this.columns}
                dataSource={
                  displayData.length === 0 && searchData === ""
                    ? orderList.filter(
                      (order) => order.status.toUpperCase() !== "NOTADVANCED"
                    )
                    : displayData
                }
                scroll={{ x: 1200, y: 350 }}
              />
            </div>
          }
        >
          <Form>
            <Descriptions
              bordered
              column={2}
              size="small"
              labelStyle={{ width: "20%", fontWeight: "bold" }}
            >
              <Descriptions.Item label="Name">
                {record?.description}
              </Descriptions.Item>

              <Descriptions.Item label="Campaign Duration">
                {moment(record?.fromdate).format("MM/DD/YYYY") +
                  ` - ` +
                  moment(record?.todate).format("MM/DD/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Campaign Type">
                <Tag color={!record?.isshare ? "blue" : "green"}>
                  {!record?.isshare ? "SINGLE" : "SHARED"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Campaign Status">
                <Tag
                  color={
                    record?.status === "ready"
                      ? "blue"
                      : record?.status === "active"
                        ? "red"
                        : record?.status === "done"
                          ? "green"
                          : "grey"
                  }
                >
                  {(record?.status ?? "").toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                {record?.productname}
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale Price">
                <NumberFormat
                  value={record?.price}
                  thousandSeparator={true}
                  suffix={" VND"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                {record?.quantity}
              </Descriptions.Item>

              <Descriptions.Item label="Max Quantity">
                {record?.maxquantity}
              </Descriptions.Item>

              <Descriptions.Item label="Campaign Code">
                {record?.code}
              </Descriptions.Item>

              <Descriptions.Item label="Number of Order">
                {record?.numorder}
              </Descriptions.Item>
              <Descriptions.Item label="Advance Fee" span={2}>
                <NumberFormat
                  value={record?.advancefee}
                  thousandSeparator={true}
                  suffix={"%"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>
              {record?.isshare && (<Descriptions.Item label="Range" span={2}>
                <Table
                  columns={this.stepCloumns}
                  dataSource={
                    record?.range ? JSON.parse(record?.range) : []
                  }
                  size="small"
                  pagination={false}
                />
              </Descriptions.Item>)}
              <Descriptions.Item label="Product Image" span={2}>
                {record?.productimage ? (
                  JSON.parse(record?.productimage)?.map((image) => {
                    return (
                      <Image
                        key={image}
                        width={100}
                        height={100}
                        src={image.url}
                        preview={{
                          src: image.url,
                        }}
                      />
                    );
                  })
                ) : (
                  <></>
                )}
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
    loading: state.campaignReducer.loading,
    orderList: state.campaignReducer.orders,
    error: state.orderReducer.err,
    record: state.campaignReducer.record,
    isStartAbleMessage: state.campaignReducer.isStartAbleMessage,
    isStartAble: state.campaignReducer.isStartAble,
    productList: state.campaignReducer.availableProducts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCampaignById: async (id) => {
      await dispatch(campaignAction.getCampaignById(id));
    },

    rejectOrder: async (
      orderCode,
      type,
      description,
      image,
      orderId,
      campaignId = null,
      requester
    ) => {
      await dispatch(
        action.rejectOrder(
          orderCode,
          type,
          description,
          image,
          orderId,
          requester
        )
      );
      await dispatch(action.getOrderByCampaignId(campaignId));
    },

    startCampaignBeforeHand: async (id) => {
      await dispatch(campaignAction.startCampaignBeforeHand(id));
      await dispatch(campaignAction.getCampaignById(id));
      await dispatch(campaignAction.getCampaign());
    },

    doneCampaignBeforeHand: async (id) => {
      await dispatch(campaignAction.doneCampaignBeforeHand(id));
      await dispatch(campaignAction.getCampaignById(id));
      await dispatch(campaignAction.getCampaign());
    },

    updateCampaign: async (record) => {
      await dispatch(campaignAction.updateCampaign(record));
      await dispatch(campaignAction.getCampaignById(record.id));
      await dispatch(campaignAction.getCampaign());
    },

    deleteCampaign: async (id) => {
      await dispatch(campaignAction.deleteCampaign(id));
      await dispatch(campaignAction.getCampaignById(id));
      await dispatch(campaignAction.getCampaign());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersInCampaign);
