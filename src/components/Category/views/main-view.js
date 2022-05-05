import { SearchOutlined } from "@ant-design/icons";
import { OpenInNew } from "@material-ui/icons";
import { Button, Col, Input, PageHeader, Row, Space, Table } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";

class CategoryUI extends Component {
  state = {
    selectedRowKeys: [],
    editButton: false,
    deleteButton: false,
    addNewButton: true,
    openCreateModal: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: [],
    searchData: "",
    record: {},
    viewDetailButton: false,
  };

  start = (openModal) => {
    switch (openModal) {
      case "openCreateModal":
        this.setState({ openCreateModal: true });
        break;

      case "openDeleteModal":
        this.setState({ openDeleteModal: true });

        break;

      case "openEditModal":
        this.setState({ openEditModal: true });

        break;
      default:
        break;
    }
  };

  onSelectChange = (record) => {
    let isExisted = false;
    this.props.productList.map((p) => {
      if (p.categoryid === record.id) {
        isExisted = true;
      }
    });
    if (this.state.selectedRowKeys[0] !== record.key) {
      this.setState({
        selectedRowKeys: [record.key],
        record: record,
        editButton: true,
        deleteButton: !isExisted,
        viewDetailButton: true,
        addNewButton: false,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        editButton: false,
        deleteButton: false,
        viewDetailButton: false,
        addNewButton: true,
      });
    }
  };

  closeModal = () => {
    this.setState({
      openCreateModal: false,
      openDeleteModal: false,
      openEditModal: false,
      record: {},
    });
  };

  columns = [
    {
      title: "Name",
      dataIndex: "categoryname",
      key: "categoryname",
      sorter: (a, b) => a.categoryname.length - b.categoryname.length,
    },

    {
      title: "Products",
      dataIndex: "numOfProduct",
      key: "numOfProduct",
      width: 200,
    },

    {
      title: "Created Date",
      dataIndex: "createdat",
      key: "createdat",
      sorter: (a, b) => a.createdat.length - b.createdat.length,
      render: (data) => moment(data).format("DD-MM-YYYY"),
      width: 200,
    },
    {
      title: "",
      key: "",
      render: (object) => {
        if (object.status === "ready") {
          return (<>

            <Link to={`/products/categories/${object.id}`}>
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
          return <Button icon={<OpenInNew />}
            type="default"
            shape="circle"
            onClick={() => this.start("openEditModal")}
            style={{
              border: "none",
              boxShadow: "none",
              background: "none",
            }} />
        }
      },
      fixed: "right",
      width: 150,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchList = data.filter((item) => {
      return (
        item?.categoryname
          ?.toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item?.createdat?.toUpperCase().includes(e.target.value.toUpperCase()) ||
        item?.updatedat?.toUpperCase().includes(e.target.value.toUpperCase())
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
      deleteButton,
      addNewButton,
      openCreateModal,
      openDeleteModal,
      openEditModal,
      displayData,
      searchData,
      record,
      viewDetailButton,
    } = this.state;

    const { createCategory, updateCategory, deleteCategory } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };

    const arr = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arr[2].toUpperCase()}
        subTitle={`This is a ${arr[2]} page`}
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              createCategory={createCategory}
            />
            <DeleteModal
              openModal={openDeleteModal}
              closeModal={this.closeModal}
              deleteCategory={deleteCategory}
              selectedRowKeys={selectedRowKeys}
              data={this.props.data}
              record={record}
            />
            <EditModal
              openModal={openEditModal}
              closeModal={this.closeModal}
              updateCategory={updateCategory}
              record={record}
              data={this.props.data}
              selectedRowKeys={selectedRowKeys}
            />

            <div style={{ marginBottom: 16 }}>
              <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
                <Col span={12}>
                  <Input
                    prefix={<SearchOutlined />}
                    ref={this.searchSelf}
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
                <Col span={3} offset={3}>
                  <Button
                    type="primary"
                    onClick={() => this.start("openCreateModal")}
                    disabled={!addNewButton}
                    block
                  >
                    Add New
                  </Button>
                </Col>
                <Col span={3}>
                  <Link
                    to={`/products/catalog?category=${selectedRowKeys[0]}`}
                  >
                    <Button type="primary" disabled={!viewDetailButton}>
                      View Products
                    </Button>
                  </Link>
                </Col>
                <Col span={3}>
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
                displayData.length === 0 && searchData === ""
                  ? this.props.data
                  : displayData
              }
              scroll={{ y: 350 }}
            />
          </ div>
        }
      ></PageHeader>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(CategoryUI, arePropsEqual);
