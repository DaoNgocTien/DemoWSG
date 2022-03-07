import React, { Component, memo } from "react";
import { Table, Button, Input, Row, Col, PageHeader, Space } from "antd";
import moment from "moment";
import PropTypes from "prop-types";

import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultDiscountCode: PropTypes.object,
  createLoyalCustomer: PropTypes.func,
  updateLoyalCustomer: PropTypes.func,
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

  componentDidMount() {}

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
    //  Get DiscountCode record
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
      title: "Customer Name",
      width: 150,
      render: (text, object, index) => {
        // console.log(object);
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
    },
    {
      title: "Num Of Product",
      dataIndex: "numofproduct",
      key: "numofproduct",
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

    this.setState({
      selectedRowKeys,
      record: record,
      editButton: selectedRowKeys.length === 1,
      deleteButton: selectedRowKeys.length >= 1,
      addNewButton: selectedRowKeys.length === 0,
    });
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
      productList,
      createLoyalCustomer,
      updateLoyalCustomer,
      deleteDiscountCode,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;
    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        // title={arrayLocation[2].toUpperCase()}
        subTitle={`This is a ${arrayLocation[2]} page`}
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              createLoyalCustomer={createLoyalCustomer}
              productList={productList}
            />
            <DeleteModal
              openModal={openDeleteModal}
              closeModal={this.closeModal}
              deleteDiscountCode={deleteDiscountCode}
              selectedRowKeys={selectedRowKeys}
              data={this.props.data}
            />
            <EditModal
              loading={this.props.loading}
              openModal={openEditModal}
              closeModal={this.closeModal}
              productList={productList}
              updateLoyalCustomer={updateLoyalCustomer}
              record={this.state.record}
              selectedRowKeys={selectedRowKeys[0]}
            />
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex="auto">
                  <Space size={4}>
                    {/* <Button
                      type="primary"
                      onClick={() => this.start("openCreateModal")}
                      hidden={!addNewButton}
                    >
                      Add New
                    </Button> */}
                    <Button
                      type="primary"
                      onClick={() => this.start("openEditModal")}
                      hidden={!editButton}
                      style={{ width: 90 }}
                    >
                      Edit
                    </Button>
                    {/* <Button
                      type="danger"
                      onClick={() => this.start("openDeleteModal")}
                      hidden={!deleteButton}
                      style={{ width: 90 }}
                    >
                      Delete
                    </Button> */}
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
