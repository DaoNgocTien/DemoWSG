import React, { Component, memo } from "react";
import { Table, Button, Input, Row, Col } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
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

class OrderUI extends Component {
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

  componentDidMount() {}

  start = (openModal) => {
    switch (openModal) {
      case "openCreateModal":
        this.setState({ openCreateModal: true });
        break;

      case "openEditModal":
        this.setState({ openEditModal: true });
        break;

      default:
        break;
    }
  };
  changeStatus = (data) => {
    this.props.updateStatusOrder(data)
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
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({
      selectedRowKeys,
      editButton: selectedRowKeys.length === 1,
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
      title: "First Name",
      dataIndex: "customerfirstname",
      key: "customerfirstname",
      sorter: (a, b) => a.customerfirstname.length - b.customerfirstname.length,
      fix: "left",
    },
    {
      title: "Last Name",
      dataIndex: "customerlastname",
      key: "customerlastname",
      sorter: (a, b) => a.customerlastname.length - b.customerlastname.length,
      fix: "left",
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      render: (text, object) => {
        return object.totalprice - object.discountprice;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      render: (object) => {
        return (
          <Button
            onClick={() => this.changeStatus(object)}
            type="primary"
          >
            Change Status
          </Button>
        );
      },
      fixed: "right",
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchData = data.filter((item) => {
      return (
        item.customerfirstname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.customerlastname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.totalprice.includes(e.target.value) ||
        item.createdat.includes(e.target.value)
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
        <EditModal
          openModal={openEditModal}
          closeModal={this.closeModal}
          updateStatusOrder={this.props.updateStatusOrder}
          record={
            this.props.data.filter((item) => {
              return selectedRowKeys.includes(item.id);
            })[0]
          }
          selectedRowKeys={selectedRowKeys[0]}
        />

        <div style={{ marginBottom: 16 }}>
          <Row>
            <Col flex={3}>
              <Button
                type="primary"
                onClick={() => this.start("openEditModal")}
                disabled={
                  !editButton || this.state.selectedRowKeys.length === 0
                    ? true
                    : false
                }
                style={{ marginLeft: 3 }}
              >
                View Details
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
export default memo(OrderUI, arePropsEqual);
