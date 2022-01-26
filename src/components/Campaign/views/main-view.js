import React, { Component, memo } from "react";
import { Table, Button, Input, Row, Col } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
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
  defaultCampaign: {},
};

class CampaignUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    displayData: [],
    searchKey: "",
  };

  componentDidMount() {
    console.log("CampaignUI");
    console.log(this.props);
    console.log(this.state);
  }

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
      render: (data) => moment(data).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "todate",
      key: "todate",
      render: (data) => moment(data).format("DD/MM/YYYY"),
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
    const { selectedRowKeys, displayData, searchKey } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Row>
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
