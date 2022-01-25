import React, { Component } from "react";
import { getCategory } from "./modules/action";
import { connect } from "react-redux";
import Loader from "../../components/Loader";
import {
  Table,
  Tag,
  Space,
  Modal,
  Button,
  Form,
  Input,
  Popconfirm,
} from "antd";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import PropTypes from "prop-types";

import { EditOutlined } from "@ant-design/icons";

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  getData: PropTypes.func
};

//  default props
const propsDefault = {
  index: 1,
  data: []
};

class CategoryUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    CreateModel: false,
    EditModel: false,
    DeleteModel: false,
    editRecord: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      CreateModel: false,
      EditModel: false,
      DeleteModel: false,
      editRecord: null,
    };
  }

  componentDidMount() {
    this.props.getCategory();
  }

  showCreateModal = () => {
    this.setState({
      CreateModel: true,
    });
  };
  showEditModal = (record) => {
    this.setState({
      EditModel: true,
      editRecord: record,
    });
  };
  showDeleteModal = () => {
    this.setState({
      DeleteModel: true,
    });
  };

  handleOk = (result) => {
    Axios({
      url: `/categories/`,
      method: "POST",
      data: result,
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        // console.log(response);
        return window.location.reload();
      }
    });
    this.setState({
      CreateModel: false,
    });
  };
  handleEditOk = (result) => {
    console.log(result);

    Axios({
      url: `/categories/${this.state.editRecord.id}`,
      method: "PUT",
      data: result,
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        // console.log(response);
        return window.location.reload();
      }
    });
    this.setState({
      EditModel: false,
    });
  };

  deleteConfirm = () => {
    Axios({
      url: `/categories/${this.state.editRecord.id}`,
      method: "DELETE",
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        // console.log(response);
        return window.location.reload();
      }
    });
    this.setState({
      DeleteModel: false,
    });
  };

  handleCancel = () => {
    this.setState({
      CreateModel: false,
      EditModel: false,
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
    },
    {
      title: "Name",
      dataIndex: "categoryname",
      key: "categoryname",
      sorter: (a, b) => a.categoryname.length - b.categoryname.length,
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => this.showEditModal(record)}>
            <EditOutlined />
          </Button>
        </Space>
      ),
      width: 100,
    },
  ];

  render() {
    const { loading, data } = this.props;
    if (loading) return <Loader />;
    return (
      <>
        <h2 style={{ textAlign: "center" }}>CATEGORIES</h2>
        <Button
          type="primary"
          onClick={this.showCreateModal}
          style={{
            margin: "0 0 10px 0",
          }}
        >
          Add New
        </Button>
        <Form id="createForm" onFinish={this.handleOk}>
          <Modal
            title="Add New"
            visible={this.state.CreateModel}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="createForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Form.Item label="Category Name" name="categoryName">
              <Input placeholder="Category Name" />
            </Form.Item>
          </Modal>
        </Form>

        <Form id="editForm" onFinish={this.handleEditOk}>
          <Modal
            title="Edit"
            visible={this.state.EditModel}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Popconfirm
                placement="topRight"
                title="Are you sure to delete this Category?"
                visible={this.DeleteModel}
                onConfirm={this.deleteConfirm}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger" onClick={this.showDeleteModal}>
                  Delete
                </Button>
              </Popconfirm>,
              <Button
                type="primary"
                form="editForm"
                key="submit"
                htmlType="submit"
              >
                Save
              </Button>,
            ]}
          >
            <Form.Item
              label="Category Name"
              name="categoryName"
              initialValue={this.state.editRecord?.categoryname}
            >
              <Input
                placeholder="Category Name"
                defaultValue={this.state.editRecord?.categoryname}
              // value={this.state.editRecord?.categoryname}
              />
            </Form.Item>
          </Modal>
        </Form>

        <Table
          columns={this.columns}
          dataSource={[...data]}
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15"],
          }}
          scroll={{ y: "350px" }}
          bordered
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.categoryReducer.loading,
    data: state.categoryReducer.data,
    error: state.categoryReducer.err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getData: () => dispatch(getCategory()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryUI);
