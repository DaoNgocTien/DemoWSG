import React, { Component } from "react";
import { getAllProduct } from "./modules/action";
import { connect } from "react-redux";
import { Button, Table, Space } from "antd";
import moment from "moment";

import Loader from "../Loader";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onViewClick(records) {
    // console.log(records);
    return this.props.history.push(`/products/${records.id}`)
  }
  componentDidMount() {
    this.props.getProducts();
  }

  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      width: 60,
      render: (text, object, index) => index + 1,
    },
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
              src={url[0].url}
              alt="avatar"
              style={{ width: "90px", height: "70px", margin: "auto" }}
            />
          );
        }
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryname",
      width: 200,
      key: "categoryname",
    },
    {
      title: "Retail Price",
      dataIndex: "retailprice",
      width: 200,
      key: "retailprice",
    },
    {
      title: "Wholesale Price",
      dataIndex: "wholesaleprice",
      width: 200,
      key: "wholesaleprice",
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
      render: (data) => moment(data).format("YYYY-MM-DD"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (text, records) => (
        <Space>
          <Button
            onClick={() => this.onViewClick(records)}
            shape="round"
            style={{ background: "#e3c7ff", color: "#6f0dd0", border: "none" }}
          >
            view
          </Button>
        </Space>
      ),
      fixed: "right",
    },
  ];

  render() {
    const { loading, data } = this.props;
    if (loading) return <Loader />;
    return (
      <div className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800" style={{ textAlign: "center" }}>Products</h1>
        <Button
          type="button"
          style={{
            marginBottom: "10px",
            background: "#0b5ed7",
            border: "none",
            width: "100px",
            height: "40px",
            color: "white",
          }}
        >
          <a href="/products/add">Add New</a>
        </Button>
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="table-responsive">
              <Table
                dataSource={data}
                columns={this.columns}
                // scroll={{ x: 4000 }}
                pagination={{ pageSize: 5 }}
                bordered
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.productReducer.loading,
    data: state.productReducer.data,
    error: state.productReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProducts: () => {
      dispatch(getAllProduct());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
