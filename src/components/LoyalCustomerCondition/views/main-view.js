import { Button, Col, Input, PageHeader, Row, Space, Table } from "antd";
import { OpenInNew } from "@material-ui/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";
//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultDiscountCode: PropTypes.object,
  createLoyalCustomerCondition: PropTypes.func,
  updateLoyalCustomerCondition: PropTypes.func,
  deleteDiscountCode: PropTypes.func,
};

//  default props
const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultDiscountCode: {},
};

class DiscountCodeUI extends Component {
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

  start = (openModal) => {
    let selectedRowKeys = this.state.selectedRowKeys;
    let data = this.props.data;
    //  Get DiscountCode record
    let recordToEdit = data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    switch (openModal) {
      case "openCreateModal":
        this.setState({
          openCreateModal: true
        });
        break;

      case "openDeleteModal":
        this.setState({
          record: recordToEdit,
          openDeleteModal: true
        });
        break;

      case "openEditModal":
        this.setState({
          record: recordToEdit,
          openEditModal: true,
        });
        break;
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
      title: "Condition Name",
      dataIndex: "startdate",
      key: "startdate",
      render: (data) => ("Condition " + moment(data).format("MM/DD/YYYY")).toUpperCase(),
    },
    {
      title: "Min Order",
      dataIndex: "minorder",
      key: "minorder",
    },
    {
      title: "Min Product",
      dataIndex: "minproduct",
      key: "minproduct",
    },
    {
      title: "Discount Percent",
      dataIndex: "discountpercent",
      key: "discountpercent",
      render: (data) => data + "%",
    },
    {
      title: "Start Date",
      dataIndex: "startdate",
      key: "startdate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "",
      key: "",
      render: (object) => {
        if (object.status === "ready") {
          return (<>

            <Link to={`/loyal-customer/conditon/${object.id}`}>
              <Button icon={<OpenInNew />}
                type="default"
                shape="circle"
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "none",
                }} />
            </Link>
          </>
          );
        } else {
          return <Link to={`/loyal-customer/conditon/${object.id}`}>
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

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        item.minorder.includes(searchString) ||
        item.minproduct.includes(searchString) ||
        item.discountpercent.includes(searchString) ||
        item.startdate.includes(searchString)
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };

  onSelectChange = (record) => {
    if (this.state.selectedRowKeys[0] !== record.key) {
      this.setState({
        selectedRowKeys: [record.key],
        record: record,
        editButton: true,
        deleteButton: true,
        addNewButton: false,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        editButton: false,
        deleteButton: false,
        addNewButton: true,
      });
    }
  };

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

    const {
      createLoyalCustomerCondition,
      updateLoyalCustomerCondition,
      deleteLoyalCustomerCondition,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={"LOYAL CUSTOMER CONDITION"}
        subTitle={`This is a loyal customer condition page`}
        footer={
          <div>
            <CreateModal
              loading={this.props.loading}
              openModal={openCreateModal}
              closeModal={this.closeModal}
              createLoyalCustomerCondition={createLoyalCustomerCondition}
            />
           
            <div style={{ marginBottom: 16 }}>
              <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
                <Col span={12}>
                  <Input
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
                <Col span={2} offset={6}>
                  <Button
                    type="primary"
                    onClick={() => this.start("openCreateModal")}
                    disabled={!addNewButton}
                    block
                  >
                    Add New
                  </Button>
                </Col>
                <Col span={2}>
                  <Button
                    type="primary"
                    onClick={() => this.start("openEditModal")}
                    disabled={!editButton}
                    block

                  >
                    Edit
                  </Button>
                </Col>
                <Col span={2}>
                  <Button
                    type="danger"
                    onClick={() => this.start("openDeleteModal")}
                    disabled={!deleteButton}
                    block
                  >
                    Delete
                  </Button>
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
export default memo(DiscountCodeUI, arePropsEqual);
