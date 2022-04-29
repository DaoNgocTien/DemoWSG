import { Button, Col, Input, PageHeader, Row, Space, Table, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";
import NumberFormat from "react-number-format";
import { Link, Redirect } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { OpenInNew } from "@material-ui/icons";

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultProduct: PropTypes.object,
  createProduct: PropTypes.func,
  updateProduct: PropTypes.func,
  deleteProduct: PropTypes.func,
};

//  default props
const propsDefault = {
  index: 1,
  data: [],
  defaultProduct: {
    key: "e5d02fef-987d-4ecd-b3b2-890eb00fe2cc",
    id: "e5d02fef-987d-4ecd-b3b2-890eb00fe2cc",
    name: "test222 again Product",
    supplierid: "99ba5ad1-612c-493f-8cdb-2c2af92ae95a",
    retailprice: "5.00",
    quantity: 11,
    description: "testttttt",
    image: "",
    categoryid: null,
    status: "active",
    typeofproduct: "",
    createdat: "2022-01-07T14:08:02.994Z",
    updatedat: "2022-01-13T16:34:09.908Z",
    categoryname: null,
  },
  createCategory: () => {},
  updateCategory: () => {},
  deleteProduct: () => {},
};

class ProductUI extends Component {
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
    viewDetailButton: false,
    displayData: [],
    searchKey: "",
    category: null,
  };

  componentDidMount() {
    const search = this.props.url;
    const category = new URLSearchParams(search).get("category");
    this.setState({
      category,
    });
  }

  start = (openModal) => {
    switch (openModal) {
      case "openCreateModal":
        this.setState({ loadingActionButton: true, openCreateModal: true });
        break;

      case "openDeleteModal":
        this.setState({ loadingActionButton: true, openDeleteModal: true });

        break;

      case "openEditModal":
        this.setState({ loadingActionButton: true, openEditModal: true });

        break;
      default:
        break;
    }
  };

  onSelectChange = (record) => {
    // //console.log('selectedRowKeys changed: ', selectedRowKeys);
    let campaignList = this.props.campaignList?.length
      ? this.props.campaignList.filter((c) => c.productid === record.id)
      : [];
    if (this.state.selectedRowKeys[0] !== record.key) {
      this.setState({
        selectedRowKeys: [record.key],
        record: record,
        editButton: true,
        deleteButton: campaignList.length === 0,
        addNewButton: false,
        viewDetailButton: true,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        editButton: false,
        deleteButton: false,
        addNewButton: true,
        viewDetailButton: false,
      });
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
    // {
    //   title: "No.",
    //   dataIndex: "No.",
    //   key: "No.",
    //   width: 60,
    //   render: (text, object, index) => index + 1,
    //   fixed: "left",
    // },
    {
      title: "Image",
      dataIndex: "image",
      width: 100,
      key: "image",
      render: (url) => {
        if (url.length > 0) {
          url = JSON.parse(url);
          return (
            <img
              src={url[0]?.url}
              alt="show illustrative representation"
              style={{ width: "90px", height: "70px", margin: "auto" }}
            />
          );
        }
      },
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 100,
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,

      fixed: "left",
    },
    // {
    //   title: "Category",
    //   dataIndex: "categoryname",
    //   width: 100,
    //   key: "categoryname",
    // },
    {
      title: "Retail Price",
      dataIndex: "retailprice",
      width: 120,
      key: "retailprice",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Created Date",
      dataIndex: "createdat",
      key: "createdat",
      width: 150,
      sorter: (a, b) => a.createdat.localeCompare(b.createdat),
      render: (data) => moment(data).format("DD-MM-YYYY"),
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   width: 1000,
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: (a, b) => a.status.length - b.status.length,
      fixed: "right",
      render: (data) => {
        let status = "";
        switch (data) {
          case "incampaign": {
            return <Tag color="green">IN CAMPAIGN</Tag>;
          }
          case "active": {
            return <Tag color="blue">ACTIVE</Tag>;
          }
          default: {
            return <Tag color="red">DEACTIVE</Tag>;
          }
        }
      },
    },

    {
      title: "",
      width: 64,
      render: (object) => {
        return (
          <Link to={`/product/${object.id}`}>
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
        );
      },
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    // //console.log(data);
    let searchString = e.target.value.toUpperCase();
    let searchList = data.filter((item) => {
      // //console.log(item);
      return (
        item?.name?.toUpperCase().includes(searchString) ||
        // item?.categoryname?.toUpperCase().includes(searchString) ||
        item?.retailprice?.toString().toUpperCase().includes(searchString) ||
        item?.quantity?.toString().toUpperCase().includes(searchString) ||
        item?.createdat?.toUpperCase().includes(searchString) ||
        // item?.description?.toUpperCase().includes(searchString) ||
        item?.status?.toUpperCase().includes(searchString)
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
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
      viewDetailButton,
    } = this.state;

    const {
      categoryList = [],
      createProduct,
      updateProduct,
      deleteProduct,
      campaignList = [],
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };
    // const hasSelected = selectedRowKeys.length > 0;

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={
          !this.state.category
            ? arrayLocation[2].toUpperCase()
            : categoryList
                .find((element) => element.id === this.state.category)
                ?.categoryname.toUpperCase()
        }
        // subTitle={`This is a ${arrayLocation[2]} page`}
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              categoryList={categoryList}
              createProduct={createProduct}
              data={this.props.data}
            />
            <DeleteModal
              loading={this.props.loading}
              openModal={openDeleteModal}
              closeModal={this.closeModal}
              categoryList={categoryList}
              deleteProduct={deleteProduct}
              record={this.state.record}
              campaignList={
                this.state.record
                  ? campaignList.filter(
                      (c) => c.productid === this.state.record.id
                    )
                  : []
              }
              availableQuantity={
                this.state.record?.quantity - this.state.record?.maxquantity ??
                0
              }
              selectedRowKeys={selectedRowKeys[0]}
              data={this.props.data}
            />
            <EditModal
              loading={this.props.loading}
              openModal={openEditModal}
              closeModal={this.closeModal}
              categoryList={categoryList}
              updateProduct={updateProduct}
              record={this.state.record}
              campaignList={
                this.state.record
                  ? campaignList.filter(
                      (c) => c.productid === this.state.record.id
                    )
                  : []
              }
              orderList={this.props.orderList}
              availableQuantity={
                this.state.record?.quantity - this.state.record?.maxquantity ??
                0
              }
              selectedRowKeys={selectedRowKeys[0]}
              data={this.props.data}
            />
            <Row style={{ padding: "20px 0" }} gutter={[16, 0]}>
              <Col span={12}>
                <Input
                  prefix={<SearchOutlined />}
                  ref={this.searchSelf}
                  onChange={(e) => this.onChangeHandler(e)}
                  placeholder="Search for products..."
                />
              </Col>
              <Col>
                {" "}
                <Space size={3}>
                  <Button
                    type="primary"
                    onClick={() => this.start("openCreateModal")}
                    disabled={!addNewButton}
                  >
                    Add New
                  </Button>
                  {/* <Link to={`/product/${selectedRowKeys[0]}`}>
                    <Button type="primary" disabled={!viewDetailButton}>
                      View Detail
                    </Button>
                  </Link>
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
                  </span> */}
                </Space>
              </Col>
            </Row>
            {/* <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex="auto"></Col>
                <Col flex="300px">
                  <Input
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
              </Row>
            </div> */}
            <Table
              loading={this.props.loading}
              // rowSelection={rowSelection}
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
export default memo(ProductUI, arePropsEqual);
