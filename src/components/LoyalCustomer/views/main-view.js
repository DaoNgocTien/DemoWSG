import { Button, Col, Input, PageHeader, Row, Space, Table, Tag } from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultDiscountCode: PropTypes.object,
  createLoyalCustomer: PropTypes.func,
  updateLoyalCustomer: PropTypes.func,
  disableLoyalCustomer: PropTypes.func,
};

const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultDiscountCode: {},
  updateLoyalCustomer: () => {},
};

class LoyalCustomerUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    loading: false,
    selectedRowKeys: [],
    loadingActionButton: false,
    activateButton: false,
    deactivateButton: false,

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

  start = (openModal) => {
    let selectedRowKeys = this.state.selectedRowKeys;
    let data = this.props.data;

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
      render: (_text, _object, index) => {
        return index + 1;
      },
      width: 100,
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
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>;
      },
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        item.customerfirstname
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        item.customerlastname
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        item.numoforder.includes(searchString) ||
        item.numofproduct.includes(searchString) ||
        item.discountpercent.includes(searchString) ||
        item.status.includes(searchString)
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
        activateButton: true && record?.status === "deactive",
        deactivateButton: true && record?.status === "active",
        addNewButton: false,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        activateButton: false,
        deactivateButton: false,
        addNewButton: true,
      });
    }
  };

  manageLoyalCustomerPosition = (position) => {
    let record = {
      ...(this.state.record ?? this.state.record),
      status: position,
    };
    //  console.log(record);
    this.props.updateLoyalCustomer(record, this.state.record?.id);
  };

  render() {
    const {
      selectedRowKeys,
      deactivateButton,
      activateButton,
      displayData,
      searchKey,
    } = this.state;

    const {
      productList,
      createLoyalCustomer,
      updateLoyalCustomer,
      disableLoyalCustomer,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        subTitle={`This is a ${arrayLocation[2]} page`}
        footer={
          <div>
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex="auto">
                  <Space size={4}>
                    <Button
                      type="primary"
                      onClick={() => this.manageLoyalCustomerPosition("active")}
                      disabled={!activateButton}
                      style={{ width: 90 }}
                    >
                      Activate
                    </Button>
                    <Button
                      type="danger"
                      onClick={() =>
                        this.manageLoyalCustomerPosition("deactive")
                      }
                      disabled={!deactivateButton}
                      style={{ width: 90 }}
                    >
                      Deactivate
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

export default memo(LoyalCustomerUI, arePropsEqual);
