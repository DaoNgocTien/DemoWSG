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
  Statistic,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  Select,
  DatePicker,
} from "antd";

const { RangePicker } = DatePicker;
class OrdersInCampaign extends React.Component {
  state = {
    loading: false,
    selectedRowKeys: [], // Check here to configure the default column
    loadingActionButton: false,
    deleteButton: false,
    openDeleteModal: false,
    displayData: [],
    searchData: "",
  };

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    console.log(this.props.orderList);
    let record = this.props.orderList?.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];
    console.log(record);
    this.setState({
      selectedRowKeys,
      record: record,
      deleteButton: selectedRowKeys.length >= 1,
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
        console.log(object);
        return object.customerfirstname + " " + object.customerlastname;
      },
      fixed: "left",
    },
    {
      title: "Product Name",
      width: 200,
      render: (text, object, index) => {
        console.log(object);
        return object.details[0].productname;
      },
    },
    {
      title: "Product Image",
      width: 150,
      render: (text, object, index) => {
        console.log(object);
        return object.details[0].image === "" ? (
          ""
        ) : (
          <img
            width="100"
            height="100"
            src={JSON.parse(object.details[0].image)[0].url}
          />
        );
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 100,
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      width: 150,
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      width: 100,
      render: (text, object) => {
        return object.totalprice - object.discountprice;
      },
    },
    {
      title: "Notes",
      width: 300,
      render: (text, object, index) => {
        console.log(object);
        return object.details[0].notes;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      width: 120,
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchList = data.filter((item) => {
      return (
        item.categoryname.includes(e.target.value) ||
        item.createdat.includes(e.target.value) ||
        item.updatedat.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchList,
      searchData: e.target.value,
    });
  };

  render() {
    const { selectedRowKeys, deleteButton, displayData, searchData } =
      this.state;

    const { record, ordersInCampaign, loading, productList } = this.props;
    console.log(ordersInCampaign);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;

    const arr = window.location.pathname.split("/");

    let productSelected =
      this.props.productList?.find(
        (element) => element.id === this.props.record?.productid
      ) || {};
    let price = 0;
    return (
      <>
        {" "}
        <Form>
          <Descriptions bordered title="Campaign information" column={2}>
            <Descriptions.Item label="Campaign duration">
              {moment(record?.fromdate).format("MM/DD/YYYY") + ` - ` + moment(record?.todate).format("MM/DD/YYYY")}
            </Descriptions.Item>

            <Descriptions.Item label="Product">

              {record?.productname}
            </Descriptions.Item>

            <Descriptions.Item label="Quantity">
              {record?.quantity}
            </Descriptions.Item>

            <Descriptions.Item label="Wholesale percent">
              {
                (record?.price / record?.productretailprice) * 100 + ' %'
              }
            </Descriptions.Item>
          </Descriptions>
        </Form>
        <PageHeader
          className="site-page-header-responsive"
          footer={
            <div>
              <div style={{ marginBottom: 16 }}>
                <Row>
                  <Col flex="auto">
                    <Space size={3}>
                      <Button
                        type="danger"
                        onClick={() => this.start("openDeleteModal")}
                        hidden={!deleteButton}
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
                loading={loading}
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={
                  displayData.length === 0 && searchData === ""
                    ? ordersInCampaign
                    : displayData
                }
                scroll={{ y: 350 }}
              />
            </div>
          }
        ></PageHeader>
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default OrdersInCampaign;
