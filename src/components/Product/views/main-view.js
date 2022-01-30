import React, { Component, memo } from "react";
import moment from "moment";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Space,
  PageHeader,
} from "antd";
import PropTypes from "prop-types";
import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";

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
    categoryname: null
  },
  createCategory: () => { },
  updateCategory: () => { },
  deleteProduct: () => { },

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
    displayData: [],
    searchData: "",
  };

  componentDidMount() {
    console.log("ProductUI");
    console.log(this.props);
    console.log(this.state);

  }

  start = openModal => {
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
      default: break;
    }
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
      editButton: selectedRowKeys.length == 1,
      deleteButton: selectedRowKeys.length >= 1,
      addNewButton: selectedRowKeys.length === 0,
    });
  };

  closeModal = () => {
    this.setState({
      openCreateModal: false,
      openDeleteModal: false,
      openEditModal: false,
    });
  }

  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      width: 60,
      render: (text, object, index) => index + 1,
    },
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
              alt="image"
              style={{ width: "90px", height: "70px", margin: "auto" }}
            />
          );
        }
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryname",
      width: 200,
      key: "categoryname",
    },
    {
      title: "Retail Price",
      dataIndex: "retailprice",
      width: 200,
      key: "retailprice",
    },
    {
      title: "Wholesale Price",
      dataIndex: "wholesaleprice",
      width: 200,
      key: "wholesaleprice",
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
      render: (data) => moment(data).format("DD-MM-YYYY"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    console.log(data);
    let searchString = e.target.value;
    let searchList = data.filter(item => {
      console.log(item);
      return item.categoryname.includes(searchString)
        || item.createdat.includes(searchString)
        || item.description.includes(searchString)
        || item.name.includes(searchString)
        || item.quantity.includes(searchString)
        || item.retailprice.includes(searchString);
    });
    this.setState({
      displayData: searchList,
      searchData: searchString ?? "",
    })
  }

  render() {
    const {
      loadingActionButton,
      selectedRowKeys,
      deleteButton,
      editButton,
      addNewButton,
      openCreateModal,
      openDeleteModal,
      openEditModal,
      displayData,
      searchData,
    } = this.state;

    const {
      categoryList,
      createProduct,
      updateProduct,
      deleteProduct,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;


    const arrayLocation = (window.location.pathname).split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={(arrayLocation[2]).toUpperCase()}
        subTitle={`This is a ${arrayLocation[2]} page`}
        footer={

          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              categoryList={categoryList}
              createProduct={createProduct}
            />
            <DeleteModal
              openModal={openDeleteModal}
              closeModal={this.closeModal}
              deleteProduct={deleteProduct}
              selectedRowKeys={selectedRowKeys}
              data={this.props.data}
            />
            <EditModal
              openModal={openEditModal}
              closeModal={this.closeModal}
              categoryList={categoryList}
              updateProduct={updateProduct}
              record={(this.props.data).filter(item => { return selectedRowKeys.includes(item.id) })[0]}
              selectedRowKeys={selectedRowKeys[0]}
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
                      {selectedRowKeys.length > 0 ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                  </Space>
                </Col>
                <Col flex={2}>

                </Col>
                <Col flex={3}>
                  <Input onChange={e => this.onChangeHandler(e)} placeholder="Search data" />
                </Col>
              </Row>
            </div>
            <Table
              loading={this.props.loading}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={displayData.length === 0 && searchData === "" ? this.props.data : displayData}
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
export default memo(ProductUI, arePropsEqual);
