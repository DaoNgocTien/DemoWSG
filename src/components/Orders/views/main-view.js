import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button, Col, Form, Input, Modal, PageHeader,
  Radio, Row, Select, Table, Tag, Upload
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import EditModal from "./edit-view";
import RejectModal from "./reject-view";


const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  rejectOrder: PropTypes.func,
  updateStatusOrder: PropTypes.func,
  getOrder: PropTypes.func,
};

const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
  rejectOrder: () => { },
  updateStatusOrder: () => { },
  getOrder: (status) => { },
};

class OrderUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    selectedRowKeys: [],
    loading: false,
    addNewButton: true,
    displayData: [],
    searchKey: "",
    openEditModal: false,
    openRejectModal: false,
    editButton: true,
    rejectButton: true,
    openUploadModal: false,
    closeUploadModal: true,
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    record: {},
  };
  radioSelf = React.createRef();
  searchSelf = React.createRef();
  selectSelf = React.createRef();

  componentDidMount() {
    // console.log(this.radioSelf.current.defaultValue);
    // console.log(this.searchSelf.current.defaultValue);
    // console.log(this.selectSelf.current.defaultValue);
  }

  start = (openModal) => {
    switch (openModal) {
      case "openRejectModal":
        this.setState({ openRejectModal: true });
        break;

      case "openEditModal":
        this.setState({ openEditModal: true });
        break;

      default:
        break;
    }
  };

  changeStatus = (record, image) => {
    this.props.updateStatusOrder(record, image);
    this.setState({
      displayData: [],
      searchKey: "",
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
    });

  };

  closeModal = () => {
    this.setState({
      selectedRowKeys: [],
      editButton: false,
      rejectButton: false,
    });
    this.setState({
      openRejectModal: false,
      openEditModal: false,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    this.setState({
      selectedRowKeys,
      editButton: selectedRowKeys.length === 1,
      rejectButton:
        selectedRowKeys.length === 1 &&
        record?.status != "delivering" &&
        record?.status != "delivered" &&
        record?.status != "completed" &&
        record?.status != "returned" &&
        record?.status != "cancelled",
      addNewButton: selectedRowKeys.length === 0,
    });
  };

  handleChangeInSelect = (data) => {
    this.props.getOrder(data);
  };

  columns = [
    {
      title: "No.",
      dataIndex: "No.",
      key: "No.",
      render: (text, object, index) => {
        return index + 1;
      },
      fixed: "left",
      width: 80,
    },
    {
      title: "Customer Name",
      width: 150,
      render: (_text, object, _index) => {
        // console.log(object);
        return object.customerfirstname + " " + object.customerlastname;
      },
    },

    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      width: 130,
    },
    {
      title: "Discount Price",
      dataIndex: "discountprice",
      key: "discountprice",
      width: 130,
    },
    {
      title: "Final Price",
      dataIndex: "finalprice",
      key: "finalprice",
      render: (text, object) => {
        return object.totalprice - object.discountprice;
      },
      width: 130,
    },
    {
      title: "Created At",
      dataIndex: "createdat",
      key: "createdat",
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
      width: 130,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data}</Tag>
      },
      width: 130,
    },
    {
      title: "Action",
      render: (object) => {
        // let disabled = object.status === "created" ? "false" : "true";
        // console.log(disabled);
        if (object.status === "created") {
          return (
            <Button
              onClick={() => this.changeStatus(object, [])}
              type="primary"
            >
              Processing Order
            </Button>
          );
        }

        if (object.status === "processing") {
          return (
            <Button
              onClick={() => this.openUploadModal(object)}
              type="primary"
            >
              Deliver Order
            </Button>
          );
        }


      },
      fixed: "right",
      width: 150,
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchData = data.filter((item) => {
      return (
        item.customerfirstname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.customerlastname
          .toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        item.totalprice.includes(e.target.value) ||
        item.discountprice.includes(e.target.value) ||
        item.createdat.includes(e.target.value) ||
        item.status.includes(e.target.value)
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  onRadioChange = (e) => {
    console.log(e);
    let { data } = this.props;
    let searchValue = e.target.value || e;
    let searchData = [];
    switch (searchValue) {
      case "retail":
        searchData = data.filter((item) => {
          return item.campaign.length === 0;
        });
        break;

      case "wholesale":
        searchData = data.filter((item) => {
          return item.campaign.length > 0;
        });
        break;

      default:
        searchValue = "";
        break;
    }

    this.setState({
      displayData: searchData,
      searchKey: searchValue,
    });
  };

  openUploadModal = object => {
    this.setState({
      openUploadModal: true,
      record: object,
    });
  }

  cancelUploadImage = () => {
    this.setState({
      openUploadModal: false,
    })
  }

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

  uploadImageForDelivering = data => {
    this.changeStatus(this.state.record, this.state.fileList);
    this.setState({
      openUploadModal: false,
    })
  }

  render() {
    const { rejectOrder, updateStatusOrder, data } = this.props;

    const {
      selectedRowKeys,
      displayData,
      searchKey,
      openEditModal,
      editButton,
      openRejectModal,
      rejectButton,
      openUploadModal,
      closeUploadModal
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const arrayLocation = window.location.pathname.split("/");
    const { load, fileList } = this.state;
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
    // console.log(data);
    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[1].toUpperCase()}
        subTitle={`This is a ${arrayLocation[1]} page`}
        footer={
          <div>
            <EditModal
              openModal={openEditModal}
              closeModal={this.closeModal}
              updateStatusOrder={updateStatusOrder}
              record={
                this.props.data.filter((item) => {
                  return selectedRowKeys.includes(item.id);
                })[0]
              }
              selectedRowKeys={selectedRowKeys[0]}
            />

            <RejectModal
              openModal={openRejectModal}
              closeModal={this.closeModal}
              rejectOrder={rejectOrder}
              record={
                this.props.data.filter((item) => {
                  return selectedRowKeys.includes(item.id);
                })[0]
              }
              selectedRowKeys={selectedRowKeys[0]}
            />

            <Form
              id="uploadImageForDeliveringForm"
              onFinish={this.uploadImageForDelivering}
              layout="vertical"

            >
              <Modal
                width={window.innerWidth * 0.7}
                title="Upload image when supplier finish order preparation"
                visible={openUploadModal}
                onCancel={this.cancelUploadImage}
                footer={[
                  <Button onClick={this.cancelUploadImage}>Cancel</Button>,
                  <Button
                    type="primary"
                    form="uploadImageForDeliveringForm"
                    key="submit"
                    htmlType="submit"
                  >
                    Submit
                  </Button>,
                ]}
              >

                <Form.Item name="image" rules={[
                  // {
                  //   required: true,
                  //   message: 'Please confirm your password!',
                  // },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (fileList.length >= 1) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Image required!!'));
                    },
                  }),
                ]}>
                  <>
                    <Upload
                      name="file"
                      action="/files/upload"
                      listType="picture-card"
                      fileList={this.state.fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      style={{ width: "60vh" }}
                    >
                      {this.state.fileList.length >= 8 ? null : uploadButton}
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
                {/* <Form.Item>
                  <Button onClick={this.handleCancel}>Cancel</Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    form="uploadImageForDeliveringForm"
                    key="submit"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item> */}

              </Modal>
            </Form>
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col flex={3}>
                  <Button
                    type="primary"
                    onClick={() => this.start("openEditModal")}
                    disabled={
                      !editButton || this.state.selectedRowKeys.length === 0
                        ? true
                        : false
                    }
                    style={{ marginLeft: 3 }}
                  >
                    View Details
                  </Button>

                  <Button
                    type="danger"
                    onClick={() => this.start("openRejectModal")}
                    disabled={
                      !rejectButton || this.state.selectedRowKeys.length === 0
                        ? true
                        : false
                    }
                    style={{ marginLeft: 3 }}
                  >
                    Reject Order
                  </Button>
                </Col>
                <Col flex={3}>
                  <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 0
                      ? `Selected ${selectedRowKeys.length} items`
                      : ""}
                  </span>
                </Col>

                <Col flex={4}>
                  <Input
                    ref={this.searchSelf}
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Col flex={6}>
                  <Radio.Group
                    onChange={(e) => this.onRadioChange(e)}
                    onFocus={(e) => this.onRadioChange(e)}
                    defaultValue="all"
                    ref={this.radioSelf}
                  >
                    <Radio value="all">All Orders</Radio>
                    <Radio value="retail">Retail Orders</Radio>
                    <Radio value="wholesale">Wholesale Orders</Radio>
                  </Radio.Group>
                  Status:
                  <Select
                    ref={this.selectSelf}
                    title="Status"
                    defaultValue="All"
                    style={{ width: 120, marginLeft: "2px" }}
                    onChange={this.handleChangeInSelect}
                  >
                    <Select.Option value={undefined}>All</Select.Option>
                    <Select.Option value="advanced">Advanced</Select.Option>
                    <Select.Option value="unpaid">Unpaid</Select.Option>
                    <Select.Option value="created">Created</Select.Option>
                    <Select.Option value="processing">Processing</Select.Option>
                    <Select.Option value="delivering">Delivering</Select.Option>
                    <Select.Option value="delivered">Delivered</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                    <Select.Option value="returned">returned</Select.Option>
                  </Select>
                </Col>
                <Col flex={4}></Col>
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
              scroll={{ y: 350, x: 1000 }}
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

export default memo(OrderUI, arePropsEqual);
