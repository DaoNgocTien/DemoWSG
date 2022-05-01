import { Lock, LockOpenTwoTone } from "@material-ui/icons";
import { Button, Col, Input, PageHeader, Row, Table, Tag } from "antd";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";

class LoyalCustomerUI extends Component {
  state = {
    loading: false,
    displayData: [],
    searchKey: "",
  };

  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      render: (_text, _object, index) => {
        return index + 1;
      },
      width: 70,
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
      render: data =>
        <NumberFormat
          value={data ?? ""}
          thousandSeparator={true}
          decimalScale={0}
          displayType="text"
        />,
    },
    {
      title: "Num Of Product",
      dataIndex: "numofproduct",
      key: "numofproduct",
      render: data =>
        <NumberFormat
          value={data ?? ""}
          thousandSeparator={true}
          decimalScale={0}
          displayType="text"
        />,
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
    {
      title: "",
      key: "",
      render: (object) => {
        return (
          <Button icon={object.status === "active" ? <Lock /> : <LockOpenTwoTone />}
            onClick={() => this.props.updateLoyalCustomer(
              {
                ...object,
                status: object.status === "active" ? "deactive" : "active"
              },
              object.id)
            }
            type="default"
            shape="circle"
            style={{
              border: "none",
              boxShadow: "none",
              background: "none",
            }} />)
      },
      fixed: "right",
      width: 100,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        String(item.customerfirstname)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.customerlastname)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.numoforder)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.numofproduct)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.discountpercent)?.toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.status)?.toUpperCase()
          .includes(searchString).toUpperCase())
        ;
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };


  render() {
    const {
      displayData,
      searchKey,
    } = this.state;

    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title="LOYAL CUSTOMER"
        subTitle={`This is a loyal customer page`}
        footer={
          <div>
            <div style={{ marginBottom: 16 }}>
            <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
                <Col span={12}>
                  <Input
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
              </Row>
            </div>
            <Table
              loading={this.props.loading}
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
