import {
  ClockCircleOutlined, IdcardTwoTone, LoadingOutlined,
  PlusOutlined, SafetyCertificateTwoTone, WalletTwoTone
} from "@ant-design/icons";
import {
  Button, Col, Descriptions, Form, Input, Modal, PageHeader, Row, Table, Tabs, Tag, Timeline, Typography, Upload
} from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { connect } from "react-redux";
import InformationModal from "../../HandleReturningOrder/views/information-view";
import action from "../modules/action";

const { Title } = Typography;
const { TabPane } = Tabs;
//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => { },
  updateCampaign: () => { },
  record: {},
  openModal: false,
};

class SettlePaymentUI extends Component {
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

  componentDidMount() {
    // console.log(this.props.record);
  }

  handleRejectAndClose = (data) => {
    // data.image = this.state.fileList;
    this.props.rejectOrder(this.props.record.ordercode, data.reason, JSON.stringify(this.state.fileList));
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.props.closeModal();
  };

  recordReasonToReject = e => {
    let reason = e.target.value;
    this.setState({
      isReasonable: reason === "" ? true : false,
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
    // console.log(this.state.fileList);
  };

  columns = [
    // {
    //   title: "No.",
    //   dataIndex: "No.",
    //   key: "No.",
    //   render: (text, object, index) => {
    //     return index + 1;
    //   },
    //   width: 100,
    // },
    {
      title: "Order Code",
      dataIndex: "ordercode",
      key: "ordercode",
      sorter: (a, b) => a.ordercode.length - b.ordercode.length,
      fix: "left"
    },

    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      sorter: (a, b) => a.content.length - b.content.length,
      fix: "left"
    },

    {
      title: "Order Value",
      dataIndex: "ordervalue",
      key: "ordervalue",
      sorter: (a, b) => a.ordervalue.length - b.ordervalue.length,
    },
    {
      title: "Advance Fee",
      dataIndex: "advancefee",
      key: "advancefee",
      sorter: (a, b) => a.advancefee.length - b.advancefee.length,
    },
    {
      title: "Platform Fee",
      dataIndex: "platformfee",
      key: "platformfee",
      sorter: (a, b) => a.platformfee.length - b.platformfee.length,
    },
    {
      title: "Payment Fee",
      dataIndex: "paymentfee",
      key: "paymentfee",
      sorter: (a, b) => a.paymentfee.length - b.paymentfee.length,
    },
    {
      title: "Penalty Fee",
      dataIndex: "penaltyfee",
      key: "penaltyfee",
      sorter: (a, b) => a.penaltyfee.length - b.penaltyfee.length,
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return <Tag>{data.toUpperCase()}</Tag>
      },
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.length - b.description.length,
    },
    {
      title: "Final Value",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount.length - b.amount.length,
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
    const { isReasonable, load, imageUrl, fileList } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    console.log(this.props.record);
    return (
      <>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="SETTLE AND WITHDRAW PAYMENT"
          subTitle={`In this page, suppliers can settle payment and withdraw cash into their E-wallet Account`}
          extra={[

            <Button
              type="primary"
              onClick={() => this.start("openHandleModal")}
              style={{ marginLeft: 3 }}
            >
              Submit
            </Button>
          ]}
          footer={
            <>
              <Tabs defaultActiveKey="complain" centered type="card">

                <TabPane tab={
                  <span>
                    <IdcardTwoTone style={{ fontSize: "25px" }} />
                    Complain Handle
                  </span>
                }
                  key="complain"
                  style={{ background: "#ffffff" }}
                >
                  <div>

                    <Title style={{ textAlign: "center", padding: "30px" }} level={3}>COMPLAIN PROOF</Title>

                    <Descriptions layout="vertical" column={2}>

                      <Descriptions.Item label="Customer service comment">
                        <Form.Item
                          name="reason"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
                          ]}
                        >
                          <Input.TextArea onChange={(e) => this.recordReasonToReject(e)} autoSize={{ minRows: 5, maxRows: 8 }} style={{ width: "60vh" }} />
                        </Form.Item>
                      </Descriptions.Item>
                      <Descriptions.Item label="Image">
                        <Form.Item name="image"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
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
                      <Descriptions.Item label="Supplier comment">
                        <Form.Item
                          name="supplierReason"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
                          ]}
                        >
                          <Input.TextArea onChange={(e) => this.recordReasonToReject(e)} autoSize={{ minRows: 5, maxRows: 8 }} style={{ width: "60vh" }} />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="Image">
                        <Form.Item name="image"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
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

                      <Descriptions.Item label="Customer comment">
                        <Form.Item
                          name="reason"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
                          ]}
                        >
                          <Input.TextArea onChange={(e) => this.recordReasonToReject(e)} autoSize={{ minRows: 5, maxRows: 8 }} style={{ width: "60vh" }} />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="Image">
                        <Form.Item name="image"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
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

                      <Descriptions.Item label="System comment">
                        <Form.Item
                          name="reason"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
                          ]}
                        >
                          <Input.TextArea onChange={(e) => this.recordReasonToReject(e)} autoSize={{ minRows: 5, maxRows: 8 }} style={{ width: "60vh" }} />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="Image">
                        <Form.Item name="image"
                          rules={[
                            { required: true, message: "Please input your reason to reject order!" },
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

                  </div>
                </TabPane>

                <TabPane tab={
                  <span>
                    <WalletTwoTone style={{ fontSize: "25px" }} />
                    Order Information
                  </span>
                }
                  key="information"
                  style={{ background: "#ffffff" }}
                >
                  <> <Title style={{ textAlign: "center", padding: "30px" }} level={3}>ORDER INFORMATION</Title>

                    <InformationModal
                      // openModal={openModal}
                      // closeModal={closeModal}
                      // updateStatusOrder={updateStatusOrder}
                      record={record}
                    // selectedRowKeys={selectedRowKeys}
                    />
                  </>
                </TabPane>

                <TabPane tab={
                  <span style={{ alignItems: "center" }}>
                    <SafetyCertificateTwoTone style={{ fontSize: "25px" }} />
                    Order History
                  </span>
                }
                  key="history"
                  style={{ background: "#ffffff" }}
                >
                  <>
                    <Title style={{ textAlign: "center", padding: "30px" }} level={3}>ORDER HISTORY</Title>
                    <Timeline pending="Recording..." mode="left" reverse="true">
                      <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
                      <Timeline.Item label="2015-09-01 09:12:11">Solve initial network problems</Timeline.Item>
                      <Timeline.Item dot={<ClockCircleOutlined className="timeline-clock-icon" />} color="red">
                        Technical testing 2015-09-01
                      </Timeline.Item>
                      <Timeline.Item>Technical testing</Timeline.Item>
                      <Timeline.Item label="2015-09-01 09:12:11">Network problems being solved</Timeline.Item>
                    </Timeline>
                  </>
                </TabPane>

              </Tabs>
            </>
          }
        >
          <Table
            loading={this.props.loading}
            columns={this.columns}
            dataSource={
              []
            }
            scroll={{ y: 100 }}
          />
        </PageHeader>
        {/* <Form
          id="rejectOrderForm"
          key={this.state.record?.key}
          ref={this.formRef}
          onFinish={this.handleRejectAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            title={`Order of ${this.state.record.customerfirstname +
              " " +
              this.state.record.customerlastname
              }`}
            visible={openModal}
            onCancel={this.handleCancel}
            footer={

            }
          >

          </Modal>
        </Form> */}
      </>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    loading: state.transactionReducer.loading,
    data: state.transactionReducer.data,
    error: state.transactionReducer.err,
    record: state.transactionReducer.settlingPaymentList.settlingList[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getComplainingOrder: async () => await dispatch(action.getOrder()),
    updateStatusOrder: async (data) => {
      await dispatch(action.updateStatusOrder(data));
      await dispatch(action.getOrder())
    },
    rejectOrder: async (orderCode, reasonForCancel, imageProof) => {
      await dispatch(action.rejectOrder(orderCode, reasonForCancel, imageProof));
    },

    storeComplainRecord: async (record) => {
      console.log("storeComplainRecord");
      console.log(record);
      await dispatch(action.storeComplainRecord(record));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettlePaymentUI);

// const arePropsEqual = (prevProps, nextProps) => {
//   return prevProps === nextProps;
// };

// // Wrap component using `React.memo()` and pass `arePropsEqual`
// export default memo(SettlePaymentUI, arePropsEqual);
