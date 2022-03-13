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


import React, { Component, memo } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Descriptions,
  Upload,
} from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import Axios from "axios";

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  deleteDiscountCode: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => {},
  deleteDiscountCode: () => {},
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

  componentDidMount() {}

  handleDeleteAndClose = (data) => {
    // console.log(data);
    // let newDiscountCode = {
    //   productId: data.productId,
    //   startDate: data.date[0],
    //   endDate: data.date[1],
    //   quantity: data.quantity,
    //   discountPrice: data.discountPrice,
    //   minimunPriceCondition: data.minimunPrice,
    //   // status: "private",
    //   code: data.code,
    // };

    // console.log(newDiscountCode);
    this.props.deleteDiscountCode(this.props.record?.id);
    // this.props.updateDiscountCode(newDiscountCode, this.props.record?.id);
    // data.image = this.state.fileList;
    // this.props.updateProduct(data);
    // this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleDelete = (data) => {
    this.props.deleteDiscountCode(this.props.record?.id);
    this.formRef.current.resetFields();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleCancelUploadImage = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = ({ fileList, file, event }) => {
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response[0].url;
        file.name = file.response[0].name;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };

  onFinish = (values) => {
    values.image = this.state.fileList;
    Axios({
      url: `/products`,
      method: "POST",
      data: values,
      withCredentials: true,
      exposedHeaders: ["set-cookie"],
    })
      .then((result) => {
        return window.location.replace("/products/catalog");
      })
      .catch((err) => console.error(err));
  };

  onSelectProduct = (value) => {
    this.setState({
      productSelected: this.props.productList?.find(
        (element) => element.id === value
      ),
    });
  };

  onChangePrice = (value) => {
    this.setState({
      price: value,
    });
  };

  render() {
    const { RangePicker } = DatePicker;
    const { openModal } = this.props;

    const { productList, record } = this.props;
    // const {
    //   productSelected = this.props.productList?.find(
    //     (element) => element.id === this.props.record?.productid
    //   ) || {},
    // } = this.state;

    if (this.props.loading || !this.props.record || !productList) {
      return <></>;
    }
    return (
      <>
        <Form
          id="deleteDiscountCodeForm"
          ref={this.formRef}
          onFinish={this.handleDeleteAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Delete a record"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="danger"
                form="deleteDiscountCodeForm"
                key="submit"
                htmlType="submit"
              >
                Delete
              </Button>,
            ]}
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Discount Code duration">
                <Form.Item
                  name="date"
                  initialValue={[
                    moment(this.props.record?.startdate),
                    moment(this.props.record?.enddate),
                  ]}
                >
                  <RangePicker
                  disabled={true}
                  style={{ width: "60vh" }}
                    ranges={{
                      Today: [moment(), moment()],
                      "This Week": [
                        moment().startOf("week"),
                        moment().endOf("week"),
                      ],
                      "This Month": [
                        moment().startOf("month"),
                        moment().endOf("month"),
                      ],
                    }}
                    defaultValue={[
                      moment(this.props.record?.startdate),
                      moment(this.props.record?.enddate),
                    ]}
                    format="MM/DD/YYYY"
                    onChange={this.onChange}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Code">
                <Form.Item name="code" initialValue={this.props.record?.code}>
                  <Input defaultValue={this.props.record?.code} style={{ width: "60vh" }} disabled={true}/>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Discount price">
                <Form.Item
                  name="discountPrice"
                  initialValue={this.props.record?.discountprice}
                >
                  <InputNumber
                  disabled={true}
                    defaultValue={this.props.record?.discountprice}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Minimun price">
                <Form.Item
                  name="minimunPrice"
                  initialValue={this.props.record?.minimunpricecondition}
                >
                  <InputNumber
                  disabled={true}
                    defaultValue={this.props.record?.minimunpricecondition}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item
                  name="productId"
                  initialValue={this.props.record?.productid}
                >
                  <Select onChange={this.onSelectProduct} style={{ width: "60vh" }} disabled={true}>
                    {productList.map((item) => {
                      return (
                        <Select.Option key={item.key} value={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Descriptions.Item>
{/* 
              <Descriptions.Item label="Status">
                <Form.Item
                  name="status"
                  initialValue={this.props.record?.status}
                >
                  <Select>
                    <Select.Option key="public" value="public">
                      Public
                    </Select.Option>
                    <Select.Option key="private" value="private">
                      Private
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Descriptions.Item> */}

              <Descriptions.Item label="Quantity">
                <Form.Item
                  name="quantity"
                  initialValue={this.props.record?.quantity}
                >
                  <InputNumber defaultValue={this.props.record?.quantity} style={{ width: "60vh" }} disabled={true}/>
                </Form.Item>
              </Descriptions.Item>
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
