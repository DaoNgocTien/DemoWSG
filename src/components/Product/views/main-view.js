import { SearchOutlined } from "@ant-design/icons";
import { OpenInNew } from "@material-ui/icons";
import { Button, Col, Input, PageHeader, Row, Table, Tag } from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import CreateModal from "./create-view";

class ProductUI extends Component {
  state = {
    loading: false,
    addNewButton: true,
    openCreateModal: false,
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

  start = () => {
    this.setState({ loadingActionButton: true, openCreateModal: true });
  };

  closeModal = () => {
    this.setState({
      openCreateModal: false,
    });
  };

  columns = [
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
    let searchString = e.target.value.toUpperCase();
    let searchList = data.filter((item) => {
      return (
        String(item?.name)?.toUpperCase().includes(searchString) ||
        String(item?.retailprice)?.toString().toUpperCase().includes(searchString) ||
        String(item?.quantity)?.toString().toUpperCase().includes(searchString) ||
        String(item?.createdat)?.toUpperCase().includes(searchString) ||
        String(item?.status)?.toUpperCase().includes(searchString)
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };

  render() {
    const {
      openCreateModal,
      displayData,
      searchKey,
    } = this.state;

    const {
      categoryList = [],
      createProduct,
    } = this.props;

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
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              categoryList={categoryList}
              createProduct={createProduct}
              data={this.props.data}
            />
            <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
              <Col span={12}>
                <Input
                  prefix={<SearchOutlined />}
                  ref={this.searchSelf}
                  onChange={(e) => this.onChangeHandler(e)}
                  placeholder="Search data"
                />
              </Col>
              <Col span={2} offset={10}>
                <Button
                  type="primary"
                  onClick={() => this.start("openCreateModal")}
                  block
                >
                  Add New
                </Button>
              </Col>
            </Row>

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

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(ProductUI, arePropsEqual);
