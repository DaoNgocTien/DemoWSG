import React, { Component, memo } from "react";
import { Table, Button, Input, Row, Col } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import CreateModal from "./create-view";
import EditModal from "./edit-view";

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  createCampaign: PropTypes.func,
  updateCampaign: PropTypes.func,
  deleteCampaign: PropTypes.func,
};

//  default props
const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
};

class CampaignUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    openCreateModal: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openEditModal: false,
    editButton: true,
  };

  componentDidMount() {
    console.log("CampaignUI");
    console.log(this.props);
    console.log(this.state);
  }

  start = (openModal) => {
    switch (openModal) {
      case "openCreateModal":
        this.setState({ openCreateModal: true });
        break;

      // case "openDeleteModal":
      //   this.setState({ openDeleteModal: true });

      //   break;

      case "openEditModal":
        this.setState({ openEditModal: true });

      //   break;
      default:
        break;
    }
  };

  closeModal = () => {
    this.setState({
      selectedRowKeys: [],
      editButton: false,
      deleteButton: false,
      addNewButton: true,
    });
    this.setState({
      openCreateModal: false,
      openDeleteModal: false,
      openEditModal: false,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({
      selectedRowKeys,
      editButton: selectedRowKeys.length == 1,
      deleteButton: selectedRowKeys.length >= 1,
      addNewButton: selectedRowKeys.length === 0,
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
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      sorter: (a, b) => a.productname.length - b.productname.length,
      fix: "left",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Start Date",
      dataIndex: "fromdate",
      key: "fromdate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "todate",
      key: "todate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchData = data.filter((item) => {
      return (
        item.productname.toUpperCase().includes(e.target.value.toUpperCase()) ||
        item.fromdate.includes(e.target.value) ||
        item.todate.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  render() {
    const {
      selectedRowKeys,
      displayData,
      searchKey,
      openCreateModal,
      addNewButton,
      openEditModal,
      editButton,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <CreateModal
          openModal={openCreateModal}
          closeModal={this.closeModal}
          products={this.props.products}
          createCampaign={this.props.createCampaign}
        />
        <EditModal
          openModal={openEditModal}
          closeModal={this.closeModal}
          record={
            this.props.data.filter((item) => {
              return selectedRowKeys.includes(item.id);
            })[0]
          }
          products={this.props.products}
          selectedRowKeys={selectedRowKeys[0]}
        />

        <div style={{ marginBottom: 16 }}>
          <Row>
            <Col flex={3}>
              <Button
                type="primary"
                onClick={() => this.start("openCreateModal")}
                disabled={!addNewButton || this.props.loading ? true : false}
              >
                Add New
              </Button>
              <Button
                type="primary"
                onClick={() => this.start("openEditModal")}
                disabled={
                  !editButton || this.state.selectedRowKeys.length === 0
                    ? true
                    : false
                }
                style={{ marginLeft: 3, width: 90 }}
              >
                Edit
              </Button>
            </Col>
            <Col flex={3}>
              <span style={{ marginLeft: 8 }}>
                {selectedRowKeys.length > 0
                  ? `Selected ${selectedRowKeys.length} items`
                  : ""}
              </span>
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
          dataSource={
            displayData.length === 0 && searchKey === ""
              ? this.props.data
              : displayData
          }
          scroll={{ y: 350 }}
        />
      </div>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(CampaignUI, arePropsEqual);