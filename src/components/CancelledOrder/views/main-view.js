import {
  Button,
  Col,
  Input,
  PageHeader,
  Radio,
  Row,
  Table,
  Tag
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import EditModal from "./edit-view";

class CancelledOrderUI extends Component {
  state = {
    selectedRowKeys: [],
    loading: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openEditModal: false,
    openRejectModal: false,
    editButton: true,
    viewButton: true,
  };

  start = () => {
        this.setState({ openEditModal: true });
         };

  changeStatus = (data) => {
    this.props.updateStatusOrder(data);
  };

  closeModal = () => {
    this.setState({
      selectedRowKeys: [],
      editButton: false,
      viewButton: false,
      record: {},
    });
    this.setState({
      openRejectModal: false,
      openEditModal: false,
    });
  };

  onSelectChange = (record) => {
    if (this.state.selectedRowKeys[0] !== record.key) {
      this.setState({
        selectedRowKeys: [record.key],
        record: record,
        editButton: true,
        viewButton: true,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        editButton: false,
        viewButton: false,
      });
    }
  };

  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      render: (_text, _object, index) => {
        return index + 1;
      },
      fixed: "left",
      width: 80,
    },
    {
      title: "First Name",
      dataIndex: "customerfirstname",
      key: "customerfirstname",
      sorter: (a, b) => a.customerfirstname.length - b.customerfirstname.length,
      fixed: "left",
      width: 120,
    },
    {
      title: "Last Name",
      dataIndex: "customerlastname",
      key: "customerlastname",
      sorter: (a, b) => a.customerlastname.length - b.customerlastname.length,
      fixed: "left",
      width: 120,
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 130,
      render: (_text, object) => {
        return (
          <NumberFormat
            value={object.totalprice}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      width: 130,
      render: (_text, object) => {
        return (
          <NumberFormat
            value={object.discountprice}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      width: 130,
      render: (_text, object) => {
        return (
          <NumberFormat
            value={object.totalprice - object.discountprice}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
      width: 130,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>;
      },
      width: 130,
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
        item.discountprice.includes(e.target.value) ||
        item.finalprice.includes(e.target.value) ||
        item.createdat.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  onRadioChange = (e) => {
    let { data } = this.props;
    let searchValue = e.target.value || e;
    let searchData = [];
    switch (searchValue) {
      case "retail":
        searchData = data.filter((item) => {
          return item.campaign.length === 0;
        });
        break;

      case "wholesale":
        searchData = data.filter((item) => {
          return item.campaign.length > 0;
        });
        break;

      default:
        searchValue = "";
        break;
    }

    this.setState({
      displayData: searchData,
      searchKey: searchValue,
    });
  };

  render() {
    const { updateStatusOrder, data } = this.props;

    const {
      selectedRowKeys,
      displayData,
      searchKey,
      openEditModal,
      viewButton,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelectChange,
      hideSelectAll: true,
    };
    
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title="CANCELLED ORDER"
        subTitle={`This is a cancelled order page`}
        footer={
          <div>
            <EditModal
              openModal={openEditModal}
              closeModal={this.closeModal}
              updateStatusOrder={updateStatusOrder}
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
                      !viewButton || this.state.selectedRowKeys.length === 0
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
              <Row style={{ marginTop: "10px" }}>
                <Col flex={6}>
                  <Radio.Group
                    onChange={(e) => this.onRadioChange(e)}
                    onFocus={(e) => this.onRadioChange(e)}
                    defaultValue="all"
                  >
                    <Radio value="all">All Orders</Radio>
                    <Radio value="retail">Retail Orders</Radio>
                    <Radio value="wholesale">Wholesale Orders</Radio>
                  </Radio.Group>
                </Col>
                <Col flex={4}></Col>
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
              scroll={{ y: 350, x: 1000 }}
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

export default memo(CancelledOrderUI, arePropsEqual);
