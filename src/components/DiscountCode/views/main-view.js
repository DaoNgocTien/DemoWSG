import { Button, Col, Input, PageHeader, Row, Space, Table, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";


import NumberFormat from "react-number-format";
//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultDiscountCode: PropTypes.object,
  createDiscountCode: PropTypes.func,
  updateDiscountCode: PropTypes.func,
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

  componentDidMount() { }

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
      title: "Code",
      dataIndex: "code",
      key: "code",
      // sorter: (a, b) => a.productname.length - b.productname.length,
      fix: "left",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      
      render: (_text, object) => {
        return <NumberFormat
          value={object.discountprice }
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
    },
    {
      title: "Minimun Price",
      dataIndex: "minimunpricecondition",
      key: "minimunpricecondition",
      render: (_text, object) => {
        return <NumberFormat
          value={object.minimunpricecondition }
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
    },
    {
      title: "Start Date",
      dataIndex: "startdate",
      key: "startdate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "enddate",
      key: "enddate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>
      },
    },
  ];
  
  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        item.productname.toUpperCase().includes(searchString.toUpperCase()) ||
        item.code.includes(searchString) ||
        item.quantity.includes(searchString) ||
        item.discountprice.includes(searchString) ||
        item.minimunpricecondition.includes(searchString) ||
        item.startdate.includes(searchString) ||
        item.enddate.includes(searchString) ||
        item.status.includes(searchString)
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

    this.setState({
      selectedRowKeys,
      record: record,
      editButton: selectedRowKeys.length === 1 && record?.status !== "deactivated",
      deleteButton: selectedRowKeys.length === 1 && record?.status !== "deactivated",
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
      createDiscountCode,
      updateDiscountCode,
      deleteDiscountCode,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };
    // const hasSelected = selectedRowKeys.length > 0;
    const arrayLocation = window.location.pathname.split("/");
    const pageTitle = arrayLocation[2].split("-");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={pageTitle[0].toUpperCase() + " " + pageTitle[1].toUpperCase()}
        subTitle={`This is a ${pageTitle[0] + " " + pageTitle[1]} page`}
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              createDiscountCode={createDiscountCode}
              productList={productList}
            />
            <DeleteModal
              loading={this.props.loading}
              openModal={openDeleteModal}
              closeModal={this.closeModal}
              productList={productList}
              deleteDiscountCode={deleteDiscountCode}
              record={this.state.record}
              selectedRowKeys={selectedRowKeys[0]}
            />
            <EditModal
              loading={this.props.loading}
              openModal={openEditModal}
              closeModal={this.closeModal}
              productList={productList}
              updateDiscountCode={updateDiscountCode}
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
