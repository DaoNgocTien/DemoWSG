import {
  ClockCircleOutlined,
  IdcardTwoTone,
  LoadingOutlined,
  PlusOutlined,
  SafetyCertificateTwoTone,
  WalletTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  PageHeader,
  Row,
  Table,
  Tabs,
  Timeline,
  Typography,
  Upload,
} from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { connect } from "react-redux";
import action from "../modules/action";
import InformationModal from "./information-view";
import NumberFormat from "react-number-format";
const { Title } = Typography;
const { TabPane } = Tabs;

const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

const propsDefault = {
  closeModal: () => { },
  updateCampaign: () => { },
  record: {},
  openModal: false,
};

class HandleUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      isReasonable: true,
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
    };
  }
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  formRef = React.createRef();

  componentDidMount() { }

  handleRejectAndClose = (data) => {
    this.props.rejectOrder(
      this.props.record.ordercode,
      data.reason,
      JSON.stringify(this.state.fileList)
    );
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
//   this.formRef.current.resetFields();
    this.props.closeModal();
  };

  recordReasonToReject = (e) => {
    let reason = e.target.value;
    this.setState({
      isReasonable: reason === "" ? true : false,
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

  handleChange = ({ fileList, file, event }) => {
    fileList = fileList.slice(-2);

    fileList = fileList.map((file) => {
      if (file.response) {
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
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (data) => {
        return JSON.parse(data).length === 0 ? (
          ""
        ) : (
          <img
            width="100"
            alt="show illustrative representation"
            height="100"
            src={JSON.parse(data)[0].url}
          />
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      sorter: (a, b) => a.productname.length - b.productname.length,
    },
    {
      title: "Type",
      dataIndex: "typeofproduct",
      key: "typeofproduct",
    },
    {
      title: "Price",
      dataIndex: "price",
       width: 200,
      key: "price",
      render: (_text, object) => {
        return <NumberFormat
          value={object.price}
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Price",
      dataIndex: "totalprice",
      key: "totalprice",
      render: (_text, object) => {
        return <NumberFormat
          value={object.totalprice}
          thousandSeparator={true}
          suffix={" VND"}
          decimalScale={0}
          displayType="text"
        />

      },
    },
    {
      title: "Note",
      dataIndex: "notes",
      key: "notes",
      fix:"right"
    },
  ];

  render() {
    this.state.record = this.props.record;
    const {
      openModal,
      closeModal,
      updateStatusOrder,
      record,
      selectedRowKeys,
    } = this.props;
    const { isReasonable, load, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="HANDLE ORDER COMPLAINING"
          subTitle={`This is a complaining order handleing page`}
          extra={[
            <Button
              type="danger"
              onClick={() => this.start("openDetailModal")}
              style={{ marginLeft: 3 }}
            >
              Reject
            </Button>,

            <Button
              type="primary"
              onClick={() => this.start("openHandleModal")}
              style={{ marginLeft: 3 }}
            >
              Submit
            </Button>,
          ]}
          footer={
            <>
              <Tabs defaultActiveKey="complain" centered type="card">
                <TabPane
                  tab={
                    <span>
                      <IdcardTwoTone style={{ fontSize: "25px" }} />
                      Complain Handle
                    </span>
                  }
                  key="complain"
                  style={{ background: "#ffffff" }}
                >
                  <div>
                    <Title
                      style={{ textAlign: "center", padding: "30px" }}
                      level={3}
                    >
                      COMPLAIN PROOF
                    </Title>
                    <Descriptions
                      layout="vertical"
                      column={2}
                      title="Complain Information"
                    >
                      <Descriptions.Item label="Supplier comment">
                        <Form.Item
                          name="supplierReason"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input your reason to reject order!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            onChange={(e) => this.recordReasonToReject(e)}
                            autoSize={{ minRows: 5, maxRows: 8 }}
                            style={{ width: "60vh" }}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="Image">
                        <Form.Item
                          name="image"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input your reason to reject order!",
                            },
                          ]}
                        >
                          <>
                            <Upload
                              disabled="true"
                              name="file"
                              action="/files/upload"
                              listType="picture-card"
                              fileList={this.props.record ? fileList : []}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                              style={{ width: "60vh" }}
                            >
                              {this.state.fileList.length >= 8
                                ? null
                                : uploadButton}
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
                      </Descriptions.Item>

                      <Descriptions.Item label="Customer comment">
                        <Form.Item
                          name="reason"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input your reason to reject order!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            onChange={(e) => this.recordReasonToReject(e)}
                            autoSize={{ minRows: 5, maxRows: 8 }}
                            style={{ width: "60vh" }}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="Image">
                        <Form.Item
                          name="image"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input your reason to reject order!",
                            },
                          ]}
                        >
                          <>
                            <Upload
                              disabled="true"
                              name="file"
                              action="/files/upload"
                              listType="picture-card"
                              fileList={this.props.record ? fileList : []}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                              style={{ width: "60vh" }}
                            >
                              {this.state.fileList.length >= 8
                                ? null
                                : uploadButton}
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
                      </Descriptions.Item>

                      <Descriptions.Item label="System comment">
                        <Form.Item
                          name="reason"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input your reason to reject order!",
                            },
                          ]}
                        >
                          <Input.TextArea
                            onChange={(e) => this.recordReasonToReject(e)}
                            autoSize={{ minRows: 5, maxRows: 8 }}
                            style={{ width: "60vh" }}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="Image">
                        <Form.Item
                          name="image"
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input your reason to reject order!",
                            },
                          ]}
                        >
                          <>
                            <Upload
                              disabled="true"
                              name="file"
                              action="/files/upload"
                              listType="picture-card"
                              fileList={this.props.record ? fileList : []}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                              style={{ width: "60vh" }}
                            >
                              {this.state.fileList.length >= 8
                                ? null
                                : uploadButton}
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
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <WalletTwoTone style={{ fontSize: "25px" }} />
                      Order Information
                    </span>
                  }
                  key="information"
                  style={{ background: "#ffffff" }}
                >
                  <>
                    {" "}
                    <Title
                      style={{ textAlign: "center", padding: "30px" }}
                      level={3}
                    >
                      ORDER INFORMATION
                    </Title>
                    <InformationModal
                      openModal={openModal}
                      closeModal={closeModal}
                      updateStatusOrder={updateStatusOrder}
                      record={record}
                      selectedRowKeys={selectedRowKeys}
                    />
                  </>
                </TabPane>

                <TabPane
                  tab={
                    <span style={{ alignItems: "center" }}>
                      <SafetyCertificateTwoTone style={{ fontSize: "25px" }} />
                      Order History
                    </span>
                  }
                  key="history"
                  style={{ background: "#ffffff" }}
                >
                  <>
                    <Title
                      style={{ textAlign: "center", padding: "30px" }}
                      level={3}
                    >
                      ORDER HISTORY
                    </Title>
                    <Timeline pending="Recording..." mode="left" reverse="true">
                      <Timeline.Item label="2015-09-01">
                        Create a services
                      </Timeline.Item>
                      <Timeline.Item label="2015-09-01 09:12:11">
                        Solve initial network problems
                      </Timeline.Item>
                      <Timeline.Item
                        dot={
                          <ClockCircleOutlined className="timeline-clock-icon" />
                        }
                        color="red"
                      >
                        Technical testing 2015-09-01
                      </Timeline.Item>
                      <Timeline.Item>Technical testing</Timeline.Item>
                      <Timeline.Item label="2015-09-01 09:12:11">
                        Network problems being solved
                      </Timeline.Item>
                    </Timeline>
                  </>
                </TabPane>
              </Tabs>
            </>
          }
        >
          <Descriptions layout="vertical" column={2}>
            <Descriptions.Item label="Customer service comment">
              <Form.Item
                name="reason"
                rules={[
                  {
                    required: true,
                    message: "Please input your reason to reject order!",
                  },
                ]}
              >
                <Input.TextArea
                  onChange={(e) => this.recordReasonToReject(e)}
                  autoSize={{ minRows: 5, maxRows: 8 }}
                  style={{ width: "60vh" }}
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              <Form.Item
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please input your reason to reject order!",
                  },
                ]}
              >
                <>
                  <Upload
                    name="file"
                    action="/files/upload"
                    listType="picture-card"
                    fileList={this.props.record ? fileList : []}
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
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.ReturningOrderReducer.loading,
    data: state.ReturningOrderReducer.data,
    error: state.ReturningOrderReducer.err,
    record: state.ReturningOrderReducer.complainRecord,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getComplainingOrder: async () => await dispatch(action.getOrder()),
    updateStatusOrder: async (data) => {
      await dispatch(action.updateStatusOrder(data));
      await dispatch(action.getOrder());
    },
    rejectOrder: async (orderCode, reasonForCancel, imageProof) => {
      await dispatch(
        action.rejectOrder(orderCode, reasonForCancel, imageProof)
      );
    },

    storeComplainRecord: async (record) => {
      await dispatch(action.storeComplainRecord(record));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleUI);
