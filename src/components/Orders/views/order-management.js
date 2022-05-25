import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  LocalShipping, OpenInNew,
  PlayCircleOutline
} from "@material-ui/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  PageHeader, Row,
  Select,
  Table, Tabs, Tag,
  Upload
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
const { TabPane } = Tabs;
class OrderManagement extends Component {
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

  handleChangeInSelect = (data) => {
    this.props.getOrder(data);
  };

  columns = [
    {
      title: "Order Code",
      dataIndex: "ordercode",
      key: "ordercode",
    },
    {
      title: "Customer",
      render: (_text, object, _index) => {
        return object.customerfirstname + " " + object.customerlastname;
      },
    },

    {
      title: "Order date",
      dataIndex: "createdat",
      key: "createdat",
      render: (data) => {
        return moment(data).format("MM/DD/YYYY");
      },
    },
    {
      title: "Total amount",
      dataIndex: "totalprice",
      key: "totalprice",
      render: (data) => {
        return data ? (
          <NumberFormat
            value={data}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        ) : (
          <NumberFormat
            value={"0"}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>;
      },
      width: 100,
    },
    {
      title: "",
      width: 130,
      render: (object) => {
        return (
          <>
            <Link to={`/orders/${object.ordercode}`}>
              <Button
                icon={<OpenInNew />}
                type="default"
                shape="circle"
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "none",
                }}
              />
            </Link>
            <Button
              onClick={() => this.changeStatus(object, [])}
              icon={<PlayCircleOutline />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }}
              hidden={object.status !== "created"}
            />
            <Button
              onClick={() => this.openUploadModal(object)}
              icon={<LocalShipping />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }}
              hidden={object.status !== "processing"}
            />
          </>
        );
      },
      fixed: "right",
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchData = data.filter((item) => {
      return (
        String(item.customerfirstname)?.toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        String(item.customerlastname)?.toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        String(item.ordercode)?.toUpperCase()
          .includes(e.target.value.toUpperCase()) ||
        String(item.createdat)?.toUpperCase()
          .includes(e.target.value.toUpperCase())
      );
    });
    this.setState({
      displayData: searchData,
      searchKey: e.target.value,
    });
  };

  onClickOrderTab = (searchValue) => {
    let { data } = this.props;
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

  openUploadModal = (object) => {
    this.setState({
      openUploadModal: true,
      record: object,
    });
  };

  cancelUploadImage = () => {
    this.setState({
      openUploadModal: false,
    });
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
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        file.name = file.response.fileName;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };

  uploadImageForDelivering = () => {
    this.changeStatus(this.state.record, this.state.fileList);
    this.setState({
      openUploadModal: false,
    });
  };

  render() {
    const {
      displayData,
      searchKey,
      openUploadModal,
      load,
      fileList
    } = this.state;

    const arrayLocation = window.location.pathname.split("/");

    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[1].toUpperCase()}
        footer={
          <div>
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
                <Form.Item
                  name="image"
                  rules={[
                    () => ({
                      validator(_) {
                        if (fileList.length >= 1) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error("Image required!!"));
                      },
                    }),
                  ]}
                >
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
              </Modal>
            </Form>
            <div>
              <Tabs defaultActiveKey="all" >
                <TabPane
                  tab={
                    <span onClick={() => this.onClickOrderTab("all")}>
                      All Orders
                    </span>
                  }
                  key="profile"
                  style={{ background: "#ffffff" }}
                />
                <TabPane
                  tab={
                    <span onClick={() => this.onClickOrderTab("retail")}>
                      Retail orders
                    </span>
                  }
                  key="retail"
                  style={{ background: "#ffffff" }}
                />
                <TabPane
                  tab={
                    <span onClick={() => this.onClickOrderTab("wholesale")}>
                      Wholesale Order
                    </span>
                  }
                  key="wholesale"
                  style={{ background: "#ffffff" }}
                />
              </Tabs>

              <Row style={{ padding: "20px 0" }} gutter={[8, 0]}>
                <Col span={12}>
                  <Input
                    prefix={<SearchOutlined />}
                    ref={this.searchSelf}
                    onChange={(e) => this.onChangeHandler(e)}
                    placeholder="Search data"
                  />
                </Col>
                <Col>
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
                    <Select.Option value="returning">Returning</Select.Option>
                    <Select.Option value="returned">Returned</Select.Option>                    
                    <Select.Option value="completed">Completed</Select.Option>
                  </Select>
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

export default memo(OrderManagement, arePropsEqual);
