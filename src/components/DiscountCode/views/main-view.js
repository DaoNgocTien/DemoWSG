import { OpenInNew } from "@material-ui/icons";
import { Button, Col, Input, PageHeader, Row, Space, Table, Tag } from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import CreateModal from "./create-view";

class DiscountCodeUI extends Component {
  state = {
    loading: false,
    selectedRowKeys: [], // Check here to configure the default column
    addNewButton: true,
    openCreateModal: false,
    displayData: [],
    searchKey: "",
    record: {},
    orderList: [],
  };

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
      title: "Code",
      dataIndex: "code",
      key: "code",
      fix: "left",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Start Date",
      dataIndex: "startdate",
      key: "startdate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "enddate",
      key: "enddate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
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
        return (<>

          <Link to={`/discount/discount-codes/${object.id}`}>
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
        String(item?.description).toUpperCase().includes(searchString.toUpperCase()) ||
        String(item?.code).includes(searchString.toUpperCase()) ||
        String(item?.quantity).includes(searchString.toUpperCase()) ||
        String(item?.discountprice).includes(searchString.toUpperCase()) ||
        String(item?.minimunpricecondition).includes(searchString.toUpperCase()) ||
        String(item?.startdate).includes(searchString.toUpperCase()) ||
        String(item?.enddate).includes(searchString.toUpperCase()) ||
        String(item?.status).includes(searchString.toUpperCase())
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
        editButton: true && record?.status !== "deactivated",
        deleteButton: true && record?.status !== "deactivated",
        addNewButton: false,
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        record: {},
        editButton: false,
        deleteButton: false,
        addNewButton: true,
      });
    }
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
    } = this.state;

    const {
      productList,
      createDiscountCode,
      updateDiscountCode,
      deleteDiscountCode,
    } = this.props;

    const arrayLocation = window.location.pathname.split("/");
    const pageTitle = arrayLocation[2].split("-");
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={pageTitle[0].toUpperCase() + " " + pageTitle[1].toUpperCase()}
        subTitle={`This is a ${pageTitle[0] + " " + pageTitle[1]} page`}
        footer={
          <div>
            <CreateModal
              openModal={openCreateModal}
              closeModal={this.closeModal}
              createDiscountCode={createDiscountCode}
            />
            <div style={{ marginBottom: 16 }}>
              <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
                <Col flex="auto">
                  <Space size={3}>
                    <Button
                      type="primary"
                      onClick={() => this.start("openCreateModal")}
                      disabled={!addNewButton}
                    >
                      Add New
                    </Button>
                  </Space>
                </Col>
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

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(DiscountCodeUI, arePropsEqual);
