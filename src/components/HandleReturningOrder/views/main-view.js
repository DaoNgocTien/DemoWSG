import {
  IdcardTwoTone,
  LoadingOutlined,
  PlusOutlined,
  SafetyCertificateTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  PageHeader,
  Tabs,
  Timeline,
  Typography,
  Upload,
} from "antd";
import { Link, Redirect, Route } from "react-router-dom";

import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import Loader from "../../../components/Loader";
import InformationModal from "./information-view";
import NumberFormat from "react-number-format";
const { Title } = Typography;
const { TabPane } = Tabs;

const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
  rejectOrder: PropTypes.func,
  acceptRequest: PropTypes.func,
};

const propsDefault = {
  closeModal: () => { },
  updateCampaign: () => { },
  rejectOrder: () => { },
  acceptRequest: () => { },
  record: {},
  openModal: false,
};

class HandleReturningOrderUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      isReasonable: true,
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
      isModalVisible: false,
    };
  }
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;

  componentDidMount() { }
  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
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

  handleRejectAndClose = (data) => {
    // alert("handleRejectAndClose");
    const user = JSON.parse(localStorage.getItem("user"));

    this.props.rejectRequest({
      type: this.props.data.order.campaignid ? "campaign" : "retail",
      orderId: this.props.data.order.id,
      orderCode: this.props.data.order.ordercode,
      description:
        "has been rejected by " + user.rolename + " for: " + data.reason,
      image: this.state.fileList || [],
    });
    this.handleCancel();
    window.history.back();
  };

  handleAcceptAndClose = () => {
    // data.image = this.state.fileList;
    //orderCode, type, image = [], orderId
    console.log(this.props.data);
    this.props.acceptRequest(
      this.props.data.order.ordercode,
      this.props.data.order.campaignid ? "campaign" : "retail",
      [],
      this.props.data.order.id
    );
    // this.handleCancel();
    // window.history.back();
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
    },
  ];

  render() {
    const { loading, acceptRequest, rejectRequest, record } = this.props;
    if (loading) return <Loader />;
    this.state.record = this.props.record;
    const { data } = this.props;
    const { load, imageUrl } = this.state;

    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    console.log(this.props.record);
    let handledBySupplier = 0;
    record?.complainRecord?.orderstatushistory?.map(item => {
      if (item.statushistory === "returning") {
        handledBySupplier++;
      }
    })
    return (
      <>
        <Form id="rejectOrderForm" onFinish={this.handleRejectAndClose}>
          <Modal
            title="Reason Of Reject Return Order"
            visible={this.state.isModalVisible}
            width={window.innerWidth * 0.7}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="danger"
                form="rejectOrderForm"
                key="submit"
                htmlType="submit"
              >
                {/* <Link
                  className="LinkDecorations"
                  to={
                    "/returning"
                  } */}
                {/* > */}
                Reject
                {/* </Link> */}
              </Button>,
            ]}
          >
            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Reason">
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
                    autoSize={{ minRows: 5, maxRows: 8 }}
                    style={{ width: "60vh" }}
                    rules={[
                      {
                        required: true,
                        message: "Please input your reason to reject order!",
                      },
                    ]}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Image">
                <Form.Item name="image">
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
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </Form>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="HANDLE ORDER RETURNING"
          subTitle={`This is a returning order handleing page`}
          extra={[
            <Button
              type="danger"
              onClick={this.showModal}
              style={{ marginLeft: 3 }}
              hidden={this.props.record?.complainRecord?.status === "returned" || handledBySupplier > 0}
            >
              Reject Returning Request
            </Button>,

            <Button
              type="primary"
              onClick={this.handleAcceptAndClose}
              style={{ marginLeft: 3 }}
              hidden={this.props.record?.complainRecord?.status === "returned" || handledBySupplier > 0}
            >
              Accept Returning Request
            </Button>,
            <Button
              type="primary"
              onClick={() => window.history.back()}
              style={{ marginLeft: 3 }}
              hidden={!(this.props.record?.complainRecord?.status === "returned" || handledBySupplier > 0)}
            >
              Back
            </Button>,
          ]}
          footer={
            <>
              <Tabs defaultActiveKey="returning" centered type="card">
                <TabPane
                  tab={
                    <span>
                      <IdcardTwoTone style={{ fontSize: "25px" }} />
                      Returning Request
                    </span>
                  }
                  key="returning"
                  style={{ background: "#ffffff" }}
                ></TabPane>

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
                    <Timeline mode="left" reverse="true">
                      {data.orderHistories?.map((orderHistory) => {
                        return (
                          <Timeline.Item
                            label={moment(orderHistory.createdat).format(
                              "MM/DD/YYYY HH:mm:ss"
                            )}
                          >
                            <h4>{orderHistory.statushistory}</h4>
                            <p>{orderHistory.description}</p>
                            <Image.PreviewGroup>
                              {orderHistory.image ? (
                                JSON.parse(orderHistory.image)?.map((image) => {
                                  return (
                                    <Image
                                      width={200}
                                      height={200}
                                      src={image.url}
                                      preview={{
                                        src: image.url,
                                      }}
                                    />
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </Image.PreviewGroup>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  </>
                </TabPane>
              </Tabs>
            </>
          }
        >
          <>
            <Title style={{ textAlign: "center", padding: "30px" }} level={3}>
              ORDER INFORMATION
            </Title>
            <InformationModal record={data} />
          </>
        </PageHeader>
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(HandleReturningOrderUI, arePropsEqual);
