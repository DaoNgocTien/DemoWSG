import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  Space,
  Tag,
  PageHeader,
  Row,
  Col,
  Table,
} from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

import NumberFormat from "react-number-format";
//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  updateProduct: PropTypes.func,
  defaultProduct: PropTypes.object,
  openModal: PropTypes.bool,
  categoryList: PropTypes.array,
};

//  default props
const propsDefault = {
  closeModal: () => { },
  updateProduct: () => { },
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

class UpdateModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: undefined,
    displayData: [],
    searchKey: "",
  };
  formRef = React.createRef();

  componentDidMount() {
    // console.log(this.props);
  }

  handleUpdateAndClose = (data) => {
    // switch (this.props.record?.status) {
    //   case "incampaign":
    //     alert("This product in campaign cannot update");
    //     break;

    //   default:
    data.image =
      this.state.fileList?.length === 0 && this.props.record
        ? JSON.parse(this.props.record?.image)
        : this.state.fileList;
    // console.log(data);
    this.props.updateProduct(data);
    // break;


    this.formRef.current.resetFields();
    this.setState({
      fileList: [],
    });
    this.props.closeModal();
  };

  handleCancel = () => {
//   this.formRef.current.resetFields();
    this.setState({
      fileList: undefined,
    });
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

  handleChange = ({ fileList }) => {
    // fileList = fileList.slice(-2);
    // console.log(fileList);
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
      title: "Campaign Name",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.length - b.description.length,
      width: 200,
      fix: "left",
    },
    {
      title: "Orders",
      dataIndex: "numorder",
      key: "numorder",
      width: 120,
      fix: "left",
      // title: "Quantity",
      // render: (object) => {
      //   // let disabled = object.status === "created" ? "false" : "true";
      //   // console.log(object);
      //   return <Tag color={!object.isshare ? "blue" : "green"}>{!object.isshare ? "SINGLE" : "SHARED"}</Tag>;


      //   // if (object.status === "processing") {
      //   //   return (
      //   //     <Button onClick={() => this.openUploadModal(object)} type="primary">
      //   //       Deliver Order
      //   //     </Button>
      //   //   );
      //   // }
      // },
      // key: "quantity",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: 120,
      fix: "left",
      // title: "Quantity",
      // render: (object) => {
      //   // let disabled = object.status === "created" ? "false" : "true";
      //   // console.log(object);
      //   return <Tag color={!object.isshare ? "blue" : "green"}>{!object.isshare ? "SINGLE" : "SHARED"}</Tag>;


      //   // if (object.status === "processing") {
      //   //   return (
      //   //     <Button onClick={() => this.openUploadModal(object)} type="primary">
      //   //       Deliver Order
      //   //     </Button>
      //   //   );
      //   // }
      // },
      // key: "quantity",
    },
    {
      title: "Max Quantity",
      dataIndex: "maxquantity",
      key: "maxquantity",
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
        return <Tag color={data === "ready" ? "blue" : data === "active" ? "red" : data === "done" ? "green" : "grey"}>{data.toUpperCase() === "DEACTIVATED" ? "STOP" : data.toUpperCase()}</Tag>;
      },
      width: 100,
      fix: "right",
    },

  ];

  onChangeHandler = (e) => {
    let data = this.props.campaignList;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        String(item.status)
          .toUpperCase()
          .includes(searchString.toUpperCase()) ||
        // String(item.fromdate)
        //   .toUpperCase()
        //   .includes(searchString.toUpperCase()) ||
        // String(item.todate)
        //   .toUpperCase()
        //   .includes(searchString.toUpperCase()) ||
        String(item.description)
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

  render() {
    const { openModal, record, availableQuantity } = this.props;

    const { data, categoryList, campaignList } = this.props;
    const {
      load,
      fileList = JSON.parse(record?.image || "[]"),
      displayData,
      searchKey, } = this.state;
    // this.state.fileList =
    //   this.props.record && this.state.fileList !== 0
    //     ? JSON.parse(this.props.record?.image)
    //     : [];
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    let listName = [];
    data.map((item) => {
      if (item.name !== record?.name) listName.push(item.name);
    });
    return (
      <>

        <Modal
          width={window.innerWidth * 0.7}
          heigh={window.innerHeight * 0.5}
          style={{
            top: 10,
          }}
          title="Edit a record"
          visible={openModal}
          onCancel={this.handleCancel}
          footer={[
            <Button onClick={this.handleCancel}>Cancel</Button>,
            <Button
              type="primary"
              form="updateProductForm"
              key="submit"
              htmlType="submit"
            >
              Submit
            </Button>,
          ]}
        >
          <Form
            key={record?.id}
            id="updateProductForm"
            ref={this.formRef}
            onFinish={this.handleUpdateAndClose}
            layout="vertical"
          >
            <Form.Item
              label="Product ID"
              name="id"
              initialValue={record?.id}
              hidden="true"
            >
              <Input
                placeholder="Product ID"
                // defaultValue=={record?.id}
                disabled={true}
                hidden={true}
              />
            </Form.Item>
            <Space size={30}>
              <Form.Item name="name" label="Product Name"
                initialValue={record?.name}
                rules={[
                  // {
                  //   required: true,
                  //   message: 'Name is required!',
                  // },
                  ({ getFieldValue }) => ({
                    validator(_, value) {

                      if (listName.includes(value)) {
                        return Promise.reject(new Error('Product Name exists!'));
                      }
                      if (value.length > 0 && value.length <= 50) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Product Name is required, length is 1-50 characters!'));
                    },
                  }),
                ]}
              >
                <Input style={{ width: "60vh" }} placeholder="Name is required, length is 1-50 characters" />
              </Form.Item>
              <Form.Item name="categoryId" label="Category"
                initialValue={record?.categoryid}
                rules={[
                  {
                    required: true,
                    message: 'Category is required!',
                  },
                  // ({ getFieldValue }) => ({
                  //   validator(_, value) {
                  //     if (value.length >= 0 && value.length <= 50) {
                  //       return Promise.resolve();
                  //     }

                  //     return Promise.reject(new Error('Category Name length is 1-20 characters!'));
                  //   },
                  // }),
                ]}
              >
                <Select style={{ width: "60vh" }}>
                  {categoryList.map((item) => (
                    <Select.Option key={item.key} value={item.id}>
                      {item.categoryname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item
                name="quantity"
                label="Quantity"
                tooltip="Minimum quantity = total quantity in stock - total quantity in active campaigns"
                initialValue={record?.quantity}
                rules={[
                  // {
                  //   required: true,
                  //   message: 'Quantity is required!',
                  // },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Quantity is positive number!'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={Number(record?.maxquantity) + 1}
                  max={999999999999}
                  default={0}
                  placeholder={"Minimum quantity is " + (Number(record?.maxquantity) + 1)}
                  style={{ width: "60vh" }} />
              </Form.Item>
              <Form.Item
                label="Retail Price"
                name="retailPrice"
                initialValue={record?.retailprice}
                rules={[
                  // {
                  //   required: true,
                  //   message: 'Price is required!',
                  // },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (Number(value) > 0) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Price is positive number!'));
                    },
                  }),
                ]}
              >
                <InputNumber min={0} max={999999999999} default={0} style={{ width: "60vh" }} />
              </Form.Item>
            </Space>

            <Space size={30}>
              <Form.Item name="description" label="Description"
                initialValue={record?.description}
                rules={[
                  {
                    required: true,
                    message: 'Description is required!',
                  },

                ]}
              >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "60vh" }} placeholder="Description is required!" />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image"
                rules={[
                  () => ({
                    validator(_) {
                      if (fileList.length >= 1) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Product Image is required!!")
                      );
                    },
                  }),
                ]}
              >
                <>
                  <Upload
                    name="file"
                    action="/files/upload"
                    listType="picture-card"
                    fileList={this.props.record ? fileList : []}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    style={{ width: "60vh" }}
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={this.state.previewVisible}
                    title={this.state.previewTitle}
                    footer={null}
                    onCancel={this.handleCancelUploadImage}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={this.state.previewImage}
                    />
                  </Modal>
                </>
              </Form.Item>
            </Space>


          </Form>

          <PageHeader
            className="site-page-header-responsive"
            title={"Campaigns: " + campaignList.length}
            footer={
              <div>

                <div style={{ marginBottom: 16 }}>
                  <Row>
                    <Col flex="auto">
                      <Space size={4}>
                        <span style={{ marginLeft: 8 }}>
                          {"Total products in active campaign: " + record?.maxquantity + " products"}
                        </span>
                      </Space>
                    </Col>
                    <Col flex="300px">
                      <Input
                        onChange={(e) => this.onChangeHandler(e)}
                        placeholder="Search data"
                      />
                    </Col>
                  </Row>
                </div>
                <Table
                  key={record?.key}
                  loading={this.props.loading}
                  // rowSelection={rowSelection}
                  columns={this.columns}
                  dataSource={
                    displayData.length === 0 && searchKey === ""
                      ? this.props.campaignList
                      : displayData
                  }
                  scroll={{ y: 350 }}
                />
              </div>
            }
          >

          </PageHeader>
        </Modal>
      </>
      //   <Form
      //     key={record?.id}
      //     id="updateProductForm"
      //     ref={this.formRef}
      //     onFinish={this.handleUpdateAndClose}
      //   >
      //     <Modal
      //       width={window.innerWidth * 0.7}
      //       heigh={window.innerHeight * 0.5}
      //       style={{
      //         top: 10,
      //       }}
      //       title="Edit a record"
      //       visible={openModal}
      //       onCancel={this.handleCancel}
      //       footer={[
      //         <Button onClick={this.handleCancel}>Cancel</Button>,
      //         <Button
      //           type="primary"
      //           form="updateProductForm"
      //           key="submit"
      //           htmlType="submit"
      //         >
      //           Submit
      //         </Button>,
      //       ]}
      //     >
      //       <Form.Item
      //         label="Product ID"
      //         name="id"
      //         initialValue={record?.id}
      //         hidden="true"
      //       >
      //         <Input
      //           placeholder="Product ID"
      //           // defaultValue=={record?.id}
      //           disabled={true}
      //           hidden={true}
      //         />
      //       </Form.Item>

      //       {/* <Descriptions layout="vertical" column={2}>
      //         <Descriptions.Item label="Name">
      //           <Form.Item
      //             name="name"
      //             initialValue={record?.name}
      //             rules={[
      //               // {
      //               //   required: true,
      //               //   message: 'Name is required!',
      //               // },
      //               () => ({
      //                 validator(_, value) {
      //                   if (listName.includes(value)) {
      //                     return Promise.reject(
      //                       new Error("Product Name exists!")
      //                     );
      //                   }
      //                   if (value.length >= 0 && value.length <= 50) {
      //                     return Promise.resolve();
      //                   }

      //                   return Promise.reject(
      //                     new Error(
      //                       "Product Name is required, length is 1-50 characters!"
      //                     )
      //                   );
      //                 },
      //               }),
      //             ]}
      //           >
      //             <Input
      //               style={{ width: "60vh" }}
      //               // defaultValue=={record?.name}
      //               placeholder="Name is required, length is 1-20 characters"
      //             />
      //           </Form.Item>
      //         </Descriptions.Item>

      //         <Descriptions.Item label="Category">
      //           <Form.Item
      //             name="categoryId"
      //             initialValue={record?.categoryid}
      //             rules={[
      //               {
      //                 required: true,
      //                 message: "Category is required!",
      //               },
      //               // ({ getFieldValue }) => ({
      //               //   validator(_, value) {
      //               //     if (value.length >= 0 && value.length <= 50) {
      //               //       return Promise.resolve();
      //               //     }

      //               //     return Promise.reject(new Error('Category Name length is 1-20 characters!'));
      //               //   },
      //               // }),
      //             ]}
      //           >
      //             <Select
      //               style={{ width: "60vh" }}
      //             // defaultValue=={record?.categoryid}
      //             >
      //               {categoryList.map((item) => (
      //                 <Select.Option key={item.key} value={item.id}>
      //                   {item.categoryname}
      //                 </Select.Option>
      //               ))}
      //             </Select>
      //           </Form.Item>
      //         </Descriptions.Item>

      //         <Descriptions.Item label="Quantity">
      //           <Form.Item
      //             name="quantity"
      //             initialValue={record?.quantity}
      //             rules={[
      //               // {
      //               //   required: true,
      //               //   message: 'Quantity is required!',
      //               // },
      //               () => ({
      //                 validator(_, value) {
      //                   if (Number(value) > 0) {
      //                     return Promise.resolve();
      //                   }

      //                   return Promise.reject(
      //                     new Error("Quantity is positive number!")
      //                   );
      //                 },
      //               }),
      //             ]}
      //           >
      //             <InputNumber
      //               min={record?.maxquantity + 1}
      //               max={999999999999}
      //               style={{ width: "60vh" }}
      //             // defaultValue=={record?.quantity}
      //             />
      //           </Form.Item>
      //         </Descriptions.Item>

      //         <Descriptions.Item label="Retail Price">
      //           <Form.Item
      //             name="retailPrice"
      //             initialValue={record?.retailprice}
      //             rules={[
      //               // {
      //               //   required: true,
      //               //   message: 'Price is required!',
      //               // },
      //               () => ({
      //                 validator(_, value) {
      //                   if (Number(value) > 0) {
      //                     return Promise.resolve();
      //                   }

      //                   return Promise.reject(
      //                     new Error("Price is positive number!")
      //                   );
      //                 },
      //               }),
      //             ]}
      //           >
      //             <InputNumber
      //               min={0}
      //               max={999999999999}
      //               // defaultValue=={record?.retailprice}
      //               style={{ width: "60vh" }}
      //             />
      //           </Form.Item>
      //         </Descriptions.Item>

      //         <Descriptions.Item label="Description">
      //           <Form.Item
      //             name="description"
      //             initialValue={record?.description}
      //             rules={[
      //               {
      //                 required: true,
      //                 message: "Description is required!",
      //               },
      //             ]}
      //           >
      //             <Input.TextArea
      //               placeholder="Description is required!"
      //               autoSize={{ minRows: 3, maxRows: 5 }}
      //               style={{ width: "60vh" }}
      //             // defaultValue=={record?.description}
      //             />
      //           </Form.Item>
      //         </Descriptions.Item>

      //         <Descriptions.Item label="Image">
      //           <Form.Item
      //             name="image"
      //             rules={[
      //               () => ({
      //                 validator(_) {
      //                   if (fileList.length >= 1) {
      //                     return Promise.resolve();
      //                   }

      //                   return Promise.reject(
      //                     new Error("Product Image is required!!")
      //                   );
      //                 },
      //               }),
      //             ]}
      //           >
      //             <>
      //               <Upload
      //                 name="file"
      //                 action="/files/upload"
      //                 listType="picture-card"
      //                 fileList={this.props.record ? fileList : []}
      //                 onPreview={this.handlePreview}
      //                 onChange={this.handleChange}
      //                 style={{ width: "60vh" }}
      //               >
      //                 {fileList.length >= 8 ? null : uploadButton}
      //               </Upload>
      //               <Modal
      //                 visible={this.state.previewVisible}
      //                 title={this.state.previewTitle}
      //                 footer={null}
      //                 onCancel={this.handleCancelUploadImage}
      //               >
      //                 <img
      //                   alt="example"
      //                   style={{ width: "100%" }}
      //                   src={this.state.previewImage}
      //                 />
      //               </Modal>
      //             </>
      //           </Form.Item>
      //         </Descriptions.Item>
      //       </Descriptions> */}
      //     </Modal>
      //   </Form>
      // </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(UpdateModal, arePropsEqual);
