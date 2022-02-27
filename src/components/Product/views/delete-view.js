import React, { Component, memo } from "react";
import moment from "moment";
import {
  Modal,
  Button,
  Form,
  Table,
} from "antd";
import PropTypes from "prop-types";

//  prototype
const propsProTypes = {
  data: PropTypes.array,
  selectedRowKeys: PropTypes.array,
  closeModal: PropTypes.func,
  deleteProduct: PropTypes.func,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  data: [],
  selectedRowKeys: [],
  closeModal: () => { },
  deleteProduct: () => { },
  openModal: false,
};

class DeleteModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;

  componentDidMount() {
    // console.log("DeleteProductModal");
    // console.log(this.props);
  }

  handleDelete = () => {
    (this.props.selectedRowKeys).map(item => {
      // console.log(item);
      return this.props.deleteProduct(item);
    })
    this.props.closeModal();
  };

  handleCancel = () => {
    this.props.closeModal();
  };


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
              src={url[0]?.url}
              alt="show illustrative representation"
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
      render: (data) => moment(data).format("DD-MM-YYYY"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
  ];

  render() {
    const { openModal, selectedRowKeys } = this.props;
    return (
      <>

        <Form id="deleteProductForm" onFinish={this.handleDelete}>
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title={`Records to be deleted: ${selectedRowKeys.length} items`}
            visible={openModal}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="primary"
                form="deleteProductForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            { }
            <Table
              columns={this.columns}
              dataSource={(this.props.data).filter(item => { return selectedRowKeys.includes(item.id) })}
              scroll={{ y: 350 }} />
          </Modal>
        </Form>
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(DeleteModal, arePropsEqual);


