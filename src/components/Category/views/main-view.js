import React, { Component, memo } from "react";
import moment from "moment";
import { Table, Button, Input, Row, Col, Space, PageHeader, Statistic, Descriptions } from "antd";
import PropTypes from "prop-types";
import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCategory: PropTypes.object,
  createCategory: PropTypes.func,
  updateCategory: PropTypes.func,
  deleteCategory: PropTypes.func,
};

//  default props
const propsDefault = {
  index: 1,
  data: [],
  defaultCategory: {
    key: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
    id: "b95685d6-e12e-4ea0-8fdf-47ec84af6912",
    categoryname: "Ipad",
    supplierid: "99ba5ad1-612c-493f-8cdb-2c2af92ae95a",
    isdeleted: false,
    createdat: "2022-01-23T12:03:11.309Z",
    updatedat: "2022-01-23T12:03:11.309Z",
  },
  createCategory: () => { },
  updateCategory: () => { },
  deleteCategory: () => { },
};

class CategoryUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    editButton: false,
    deleteButton: false,
    addNewButton: true,
    openCreateModal: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: [],
    searchData: "",
    record: {},
  };

  componentDidMount() {
    console.log("CategoryUI");
    console.log(this.props);
    console.log(this.state);
  }

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

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    console.log(this.props.data);
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];
    console.log(record);
    // this.setState({
    //   record: this.props.data.filter((item) => {
    //     return selectedRowKeys.includes(item.id);
    //   })[0]
    // });
    // console.log(this.state.record);
    this.setState({
      selectedRowKeys,
      record: record,
      editButton: selectedRowKeys.length == 1,
      deleteButton: selectedRowKeys.length >= 1,
      addNewButton: selectedRowKeys.length === 0,
    });
  };

  closeModal = () => {
    // this.setState({
    //   // selectedRowKeys: [],
    //   // editButton: false,
    //   // deleteButton: false,
    //   // addNewButton: true,
    // });
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
      title: "Name",
      dataIndex: "categoryname",
      key: "categoryname",
      sorter: (a, b) => a.categoryname.length - b.categoryname.length,
      fix: "left",
    },

    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      sorter: (a, b) => a.createdat.length - b.createdat.length,
      render: (data) => moment(data).format("DD-MM-YYYY"),
      // render: (text, record) => {
      //   return new Date(record.createdat).toString().slice(0, 24);
      // },
    },

    {
      title: "Updated At",
      dataIndex: "updatedat",
      key: "updatedat",
      sorter: (a, b) => a.updatedat.length - b.updatedat.length,
      render: (data) => moment(data).format("DD-MM-YYYY"),
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchList = data.filter(item => {
      return item.categoryname.includes(e.target.value)
        || item.createdat.includes(e.target.value)
        || item.updatedat.includes(e.target.value);
    });
    this.setState({
      displayData: searchList,
      searchData: e.target.value,
    })
  }

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
      searchData,
      record,
    } = this.state;

    const { createCategory, updateCategory, deleteCategory } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;

    const arr = (window.location.pathname).split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={(arr[2]).toUpperCase()}
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
              <Row>
                <Col flex={5}>
                  <Space size={3}>
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
                <Col flex={4}>
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
              dataSource={displayData.length === 0 && searchData === '' ? this.props.data : displayData}
              scroll={{ y: 350 }}
            />
          </div>
        }
      >
      </PageHeader>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(CategoryUI, arePropsEqual);
