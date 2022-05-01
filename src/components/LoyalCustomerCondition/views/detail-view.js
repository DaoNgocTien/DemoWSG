import {
  Button,
  Col,
  Descriptions,
  Form, Image, Input,
  PageHeader, Popover, Row,
  Space,
  Table,
  Tag
} from "antd";
import { Lock, LockOpenTwoTone } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import action from "../modules/action";
import { default as loyalCustomerAction } from "../../LoyalCustomer/modules/action";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";

class LoyalCustomerConditionDetail extends React.Component {
  state = {
    loading: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: [],
    searchKey: "",
    record: {},
  };

  componentDidMount() {
    this.props.getLoyalCustomerConditionById(this.props.match.params.id);
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
      openDeleteModal: false,
      openEditModal: false,
    });
  };

  state = {

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
      fixed: "left",
    },
    {
      title: "Customer Name",
      width: 150,
      render: (_text, object, _index) => {
        return object.customerfirstname + " " + object.customerlastname;
      },
      fixed: "left",
    },
    {
      title: "Avatar",
      dataIndex: "customeravt",
      key: "customeravt",
      render: (data) => (
        <img
          src={data}
          alt="show illustrative representation"
          style={{ width: "90px", height: "70px", margin: "auto" }}
        />
      ),
    },
    {
      title: "Num Of Order",
      dataIndex: "numoforder",
      key: "numoforder",
      render: data =>
        <NumberFormat
          value={data ?? ""}
          thousandSeparator={true}
          decimalScale={0}
          displayType="text"
        />,
    },
    {
      title: "Num Of Product",
      dataIndex: "numofproduct",
      key: "numofproduct",
      render: data =>
        <NumberFormat
          value={data ?? ""}
          thousandSeparator={true}
          decimalScale={0}
          displayType="text"
        />,
    },
    {
      title: "Discount Percent",
      dataIndex: "discountpercent",
      key: "discountpercent",
      render: (data) => data + "%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>;
      },
    },
    {
      title: "",
      key: "",
      render: (object) => {
        return (
          <Button icon={object.status === "active" ? <Lock /> : <LockOpenTwoTone />}
            onClick={() => this.props.updateLoyalCustomer(
              {
                ...object,
                status: object.status === "active" ? "deactive" : "active"
              },
              object.id)
            }
            type="default"
            shape="circle"
            style={{
              border: "none",
              boxShadow: "none",
              background: "none",
            }} />)
      },
      fixed: "right",
      width: 100,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        String(item.customerfirstname)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.customerlastname)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.numoforder)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.numofproduct)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.discountpercent)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.status)?.toUpperCase()
          .includes(searchString).toUpperCase())
        ;
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
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
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
      displayData = [],
      searchKey,
      openDeleteModal,
      openEditModal,
    } = this.state;

    const {
      data,
      loading,
      deleteLoyalCustomerCondition,
      updateLoyalCustomerCondition,
      record,
    } = this.props;
    return (
      <>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="LOYAL CUSTOMER CONDITION DETAILS"
          subTitle={`This is a loyal customer condition detail page`}
          extra={[
            <Button
              onClick={() => this.start("openEditModal")}
              type="primary"
            // hidden={record?.status === "deactivate"}
            >
              Edit Condition
            </Button>,
            <Button
              onClick={() => this.start("openDeleteModal")}
              type="danger"
            // hidden={record?.status === "deactivate"}
            >
              Delete Condition
            </Button>,
          ]}
          footer={
            <div>
              <DeleteModal
                loading={this.props.loading}
                openModal={openDeleteModal}
                closeModal={this.closeModal}
                deleteLoyalCustomerCondition={deleteLoyalCustomerCondition}
                record={record}
              />
              <EditModal
                loading={this.props.loading}
                openModal={openEditModal}
                closeModal={this.closeModal}
                updateLoyalCustomerCondition={updateLoyalCustomerCondition}
                record={record}
              />
              <div style={{ marginBottom: 16 }}>
                <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
                  <Col span={12}>
                    <Input
                      onChange={(e) => this.onChangeHandler(e)}
                      placeholder="Search data"
                    />
                  </Col>

                </Row>
              </div>
              <Table
                loading={loading}
                columns={this.columns}
                dataSource={
                  displayData.length === 0 && searchKey === ""
                    ? data
                    : displayData
                }
                scroll={{ y: 350 }}
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
              <Descriptions.Item label="Condition Name">
                {"CONDITION " + moment(record?.createdat).format("MM/DD/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Minimum Order">
                {record?.minorder ?? ""}
              </Descriptions.Item>

              <Descriptions.Item label="Minimum Product">
                {record?.minproduct ?? ""}
              </Descriptions.Item>

              <Descriptions.Item label="Discount Percent">
                <NumberFormat
                  value={record?.discountpercent}
                  thousandSeparator={true}
                  suffix={" %"}
                  decimalScale={0}
                  displayType="text"
                />
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                {moment(record?.createdAt)?.format("MM/DD/YYYY") ?? ""}
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
    loading: state.loyalCustomerConditionReducer.loading,
    data: state.loyalCustomerReducer.data.LoyalCustomers,
    error: state.loyalCustomerConditionReducer.err,
    record: state.loyalCustomerConditionReducer.record,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLoyalCustomerConditionById: async (id) => {
      await dispatch(loyalCustomerAction.getLoyalCustomer());
      await dispatch(action.getLoyalCustomerConditionById(id));
    },

    updateLoyalCustomerCondition: async (record, id) => {
      await dispatch(action.updateLoyalCustomerCondition(record, id));
      await dispatch(loyalCustomerAction.getLoyalCustomer());
      await dispatch(action.getLoyalCustomerConditionById(id));
    },

    deleteLoyalCustomerCondition: async (id) => {
      await dispatch(action.deleteLoyalCustomerCondition(id));
      await dispatch(loyalCustomerAction.getLoyalCustomer());
      await dispatch(action.getLoyalCustomerConditionById(id));
    },

    updateLoyalCustomer: async (record, id) => {
      await dispatch(loyalCustomerAction.updateLoyalCustomer(record, id));
      await dispatch(loyalCustomerAction.getLoyalCustomer());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoyalCustomerConditionDetail);
