import { SearchOutlined } from "@ant-design/icons";
import { OpenInNew } from "@material-ui/icons";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Input,
  PageHeader,
  Row,
  Table,
  Tag
} from "antd";
import React, { Component, memo } from "react";
import CreateModal from "./create-view";

class CampaignUI extends Component {
  state = {
    loading: false,
    selectedRowKeys: [],
    addNewButton: true,
    openCreateModal: false,
    displayData: [],
    searchKey: "",
    record: {},
  };


  start = () => {
    this.setState({ openCreateModal: true });
  };

  closeModal = () => {
    this.setState({
      openCreateModal: false,
    });
  };

  columns = [
    {
      title: "Name",
      dataIndex: "description",
      key: "description",
      width: 200,
      fix: "left",
    },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      sorter: (a, b) => a.productname.length - b.productname.length,
      width: 150,
      fix: "left",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: 120,
      fix: "left",
    },
    {
      title: "Max Quantity",
      dataIndex: "maxquantity",
      key: "maxquantity",
      width: 120,
    },

    {
      title: "Type",
      key: "type",
      render: (object) => {
        return (
          <Tag color={!object.isshare ? "blue" : "green"}>
            {!object.isshare ? "SINGLE" : "SHARED"}
          </Tag>
        );
      },
      width: 100,
      fix: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return (
          <Tag
            color={
              data === "ready"
                ? "blue"
                : data === "active"
                  ? "red"
                  : data === "done"
                    ? "green"
                    : "grey"
            }
          >
            {data.toUpperCase() === "DEACTIVATED" ? "STOP" : data.toUpperCase()}
          </Tag>
        );
      },
      width: 100,
      fix: "right",
    },
    {
      title: "",
      key: "",
      render: (object) => {
        if (object.status === "ready") {
          return (<>

            <Link to={`/discount/campaign/${object.id}`}>
              <Button icon={<OpenInNew />}
                type="default"
                shape="circle"
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "none",
                }} />
            </Link>
          </>
          );
        } else {
          return <Link to={`/discount/campaign/${object.id}`}>
            <Button icon={<OpenInNew />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }} />
          </Link>
        }
      },
      fixed: "right",
      width: 150,
    },
  ];


  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        String(item.status)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.fromdate)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.todate)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.productname)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.quantity)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.maxquantity)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.numorder)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.advancefee)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        String(item.price).toUpperCase().includes(searchString.toUpperCase())
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };

  onSelectChange = (record) => {
    if (this.state.selectedRowKeys[0] !== record.key) {
      this.props.getCampaignById(record.id);
      this.setState({
        selectedRowKeys: [record.key],
        record: record,
        addNewButton: false,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        addNewButton: true,
      });
    }
  };

  render() {
    const {
      addNewButton,
      openCreateModal,
      displayData,
      searchKey,
    } = this.state;

    const {
      productList = [],
      createCampaign,
      data,
    } = this.props;

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[2].toUpperCase()}
        subTitle={`This is a ${arrayLocation[2]} page`}
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              createCampaign={createCampaign}
              productList={productList}
              campaingList={data}
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
              <Col span={3}>
                <Button
                  type="primary"
                  onClick={() => this.start()}
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

export default memo(CampaignUI, arePropsEqual);
