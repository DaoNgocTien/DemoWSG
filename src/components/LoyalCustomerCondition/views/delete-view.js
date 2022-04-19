// import React, { Component, memo } from "react";
// import moment from "moment";
// import {
//   Modal,
//   Button,
//   Form,
//   Table,
// } from "antd";
// import PropTypes from "prop-types";

// //  prototype
// const propsProTypes = {
//   data: PropTypes.array,
//   selectedRowKeys: PropTypes.array,
//   closeModal: PropTypes.func,
//   deleteDiscountCode: PropTypes.func,
//   openModal: PropTypes.bool,
// };

// //  default props
// const propsDefault = {
//   data: [],
//   selectedRowKeys: [],
//   closeModal: () => { },
//   deleteDiscountCode: () => { },
//   openModal: false,
// };

// class DeleteModal extends Component {
//   static propTypes = propsProTypes;
//   static defaultProps = propsDefault;

//   componentDidMount() {
//     // console.log("DeleteDiscountCodeModal");
//     // console.log(this.props);
//   }

//   handleDelete = () => {
//     (this.props.selectedRowKeys).map(item => {
//       // console.log(item);
//       return this.props.deleteDiscountCode(item);
//     })
//     this.props.closeModal();
//   };

//   handleCancel = () => {
//     this.props.closeModal();
//   };


//   columns = [
//     {
//       title: "No.",
//       dataIndex: "No.",
//       key: "No.",
//       width: 60,
//       render: (text, object, index) => index + 1,
//     },
//     {
//       title: "Product Image",
//       dataIndex: "productimage",
//       width: 100,
//       key: "productimage",
//       render: (url) => {
//         if (url.length > 0) {
//           url = JSON.parse(url);
//           return (
//             <img
//               src={url[0]?.url}
//               alt="show illustrative representation"
//               style={{ width: "90px", height: "70px", margin: "auto" }}
//             />
//           );
//         }
//       },
//     },
//     {
//       title: "Product Name",
//       dataIndex: "productname",
//       width: 200,
//       key: "productname",
//     },
//     {
//       title: "Retail Price",
//       dataIndex: "retailprice",
//       width: 200,
//       key: "retailprice",
//     },
//     {
//       title: "Wholesale Price",
//       dataIndex: "wholesaleprice",
//       width: 200,
//       key: "wholesaleprice",
//     },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//       width: 100,
//     },
//     {
//       title: "Created Date",
//       dataIndex: "createdat",
//       key: "createdat",
//       width: 150,
//       render: (data) => moment(data).format("DD-MM-YYYY"),
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       width: 250,
//     },
//   ];

//   render() {
//     const { openModal, selectedRowKeys } = this.props;
//     return (
//       <>

//         <Form id="deleteDiscountCodeForm" onFinish={this.handleDelete}>
//           <Modal
//             width={window.innerWidth * 0.7}
//             heigh={window.innerHeight * 0.5}
//             style={{
//               top: 10,
//             }}
//             title={`Records to be deleted: ${selectedRowKeys.length} items`}
//             visible={openModal}
//             // onOk={this.handleOk}
//             onCancel={this.handleCancel}
//             footer={[
//               <Button onClick={this.handleCancel}>Cancel</Button>,
//               <Button
//                 type="primary"
//                 form="deleteDiscountCodeForm"
//                 key="submit"
//                 htmlType="submit"
//               >
//                 Submit
//               </Button>,
//             ]}
//           >
//             { }
//             <Table
//               columns={this.columns}
//               dataSource={(this.props.data).filter(item => { return selectedRowKeys.includes(item.id) })}
//               scroll={{ y: 350 }} />
//           </Modal>
//         </Form>
//       </>
//     );
//   }
// }

// const arePropsEqual = (prevProps, nextProps) => {
//   return prevProps === nextProps;
// };

// // Wrap component using `React.memo()` and pass `arePropsEqual`
// export default memo(DeleteModal, arePropsEqual);


import {
  Button, DatePicker, Descriptions, Form,
  Input, InputNumber, Modal, Select, Upload
} from "antd";
import Axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  deleteLoyalCustomerCondition: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => { },
  deleteLoyalCustomerCondition: () => { },
  defaultProduct: {
    key: "e5d02fef-987d-4ecd-b3b2-890eb00fe2cc",
    id: "e5d02fef-987d-4ecd-b3b2-890eb00fe2cc",
    name: "test222 again Product",
    supplierid: "99ba5ad1-612c-493f-8cdb-2c2af92ae95a",
    retailprice: "5.00",
    quantity: 11,
    description: "testttttt",
    image: "",
    categoryid: null,
    status: "active",
    typeofproduct: "",
    createdat: "2022-01-07T14:08:02.994Z",
    updatedat: "2022-01-13T16:34:09.908Z",
    categoryname: null,
  },
  openModal: false,
  categoryList: [],
};

class DeleteModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    // productSelected: null,
    // price: 1,
  };
  formRef = React.createRef();

  componentDidMount() { }

  handleDeleteAndClose = (data) => {
    this.props.deleteLoyalCustomerCondition(this.props.record?.id);
    this.props.closeModal();
  };

  handleCancel = () => {
//   this.formRef.current.resetFields();
    this.props.closeModal();
  };

  render() {
    const { openModal } = this.props;

    const { productList, record } = this.props;
    // console.log(record);
    if (this.props.loading || !this.props.record || !productList) {
      return <></>;
    }
    return (
      <>
        <Form
          id="deleteLoyalCustomerConditionForm"
          ref={this.formRef}
          onFinish={this.handleDeleteAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Update"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="danger"
                form="deleteLoyalCustomerConditionForm"
                key="submit"
                htmlType="submit"
              >
                Delete
              </Button>,
            ]}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Min Order">
                <Form.Item
                  name="minOrder"
                  initialValue={this.props.record?.minorder}
                >
                  <InputNumber
                    disabled={true}
                    defaultValue={this.props.record?.minorder}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Min Product">
                <Form.Item
                  name="minProduct"
                  initialValue={this.props.record?.minproduct}
                >
                  <InputNumber
                    disabled={true}
                    defaultValue={this.props.record?.minproduct}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Discount Percent">
                <Form.Item
                  name="discountPercent"
                  initialValue={this.props.record?.discountpercent}
                >
                  <InputNumber
                    disabled={true}
                    defaultValue={this.props.record?.discountpercent}
                    min="0"
                    max="100"
                    addonAfter="%"
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label=""></Descriptions.Item>
            </Descriptions>
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
