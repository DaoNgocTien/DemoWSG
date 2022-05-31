import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
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
  Upload
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import Loader from "../../../components/Loader";
import InformationModal from "./information-view";
import RejectModal from "./reject-view";


const { Title } = Typography;
const { TabPane } = Tabs;

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
      openRejectModal: false,
    };
  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  showRejectModal = () => {
    this.setState({ openRejectModal: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false, openRejectModal: false });
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
        file.url = file.response.url;
        file.name = file.response.fileName;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };

  handleRejectAndClose = (data) => {
    const user = JSON.parse(localStorage.getItem("user"));

    this.props.rejectRequest({
      type: this.props.data.order.campaignid ? "campaign" : "retail",
      orderId: this.props.data.order.id,
      orderCode: this.props.data.order.ordercode,
      description:
        "has been rejected by " + user.rolename + " for: " + data.reason,
      image: this.state.fileList || [],
      supplierId: user.id
    });
    this.handleCancel();
  };

  handleAcceptAndClose = () => {
    this.props.acceptRequest(
      this.props.data.order.ordercode,
      this.props.data.order.campaignid ? "campaign" : "retail",
      [],
      this.props.data.order.id
    );
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
        return (
          <NumberFormat
            value={object.price}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
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
        return (
          <NumberFormat
            value={object.totalprice}
            thousandSeparator={true}
            suffix={" VND"}
            decimalScale={0}
            displayType="text"
          />
        );
      },
    },
    {
      title: "Note",
      dataIndex: "notes",
      key: "notes",
      fix: "right",
    },
  ];

  render() {
    const { loading, data } = this.props;
    if (loading) return <></>;
    this.state.record = this.props.record;
    const { load, imageUrl } = this.state;

    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    console.log(data?.orderHistories.find(item => item.orderstatus === "requestAccepted"))

    let handledBySupplier = 0;
    if (data?.orderHistories) {
      handledBySupplier = data?.orderHistories.filter((item) => item.orderstatus === "returning").length
      if (data?.orderHistories.find(item => item.orderstatus === "requestAccepted")) {
        handledBySupplier = 0
      }
    }
    return (
      <>
        <Form id="rejectReturnOrderForm" onFinish={this.handleRejectAndClose}>
          <Modal
            title="Reason Of Reject Return Order"
            visible={this.state.isModalVisible}
            width={window.innerWidth * 0.7}
            onCancel={this.handleCancel}
            footer={[
              <Button key="cancel" onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="danger"
                form="rejectReturnOrderForm"
                key="submit"
                htmlType="submit"
              >
                Reject
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

        <RejectModal
          openModal={this.state.openRejectModal}
          closeModal={this.handleCancel}
          rejectOrder={this.props.rejectOrder}
          record={data?.order}
        />

        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="ORDER DETAIL"
          extra={[
            <Button
              key="reject"
              type="danger"
              onClick={this.showModal}
              style={{ marginLeft: 3 }}
              hidden={
                data?.status?.toUpperCase() === "RETURNING" && handledBySupplier === 1 ? false : true
              }
            >
              Reject Returning Request
            </Button>,

            <Button
              key="accept"
              type="primary"
              onClick={this.handleAcceptAndClose}
              style={{ marginLeft: 3 }}
              hidden={
                data?.status?.toUpperCase() === "RETURNING" && handledBySupplier === 1 ? false : true
              }
            >
              Accept Returning Request
            </Button>,
            <Button
              key="back"
              type="primary"
              onClick={() => window.history.back()}
              style={{ marginLeft: 3 }}
              hidden={!(handledBySupplier > 1)}
            >
              Back
            </Button>,
            <Button
              key="rej"
              type="danger"
              onClick={this.showRejectModal}
              style={{ marginLeft: 3 }}
              hidden={data.order?.status !== "processing" && data.order?.status !== "created" && data.order?.status !== "unpaid" && data.order?.status !== "advanced"}
            >
              reject
            </Button>,
          ]}
        >
          <>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Infomation" key="1">
                <InformationModal record={data} />
              </TabPane>
              <TabPane tab="History" key="2">
                <Title
                  style={{ textAlign: "left", fontWeight: "bold" }}
                  level={5}
                >
                  Order History
                </Title>
                <Timeline mode="left" reverse="true">
                  {data.orderHistories?.map((orderHistory) => {
                    return (
                      <Timeline.Item
                        key="timeline"
                        label={moment(orderHistory.createdat).format(
                          "MM/DD/YYYY HH:mm:ss"
                        )}
                      >
                        <h4>{(() => {
                          switch (orderHistory.orderstatus) {
                            case "advanced":
                              return "ADVANCED"
                            case "unpaid":
                              return "UNPAID"
                            case "created":
                              return "CREATED"
                            case "processing":
                              return "PROCESSING"
                            case "delivering":
                              return "DELIVERING"
                            case "delivered":
                              return "DELIVERED"
                            case "returning":
                              return "RETURNING"
                            case "return":
                              return "RETURN"
                            case "requestRefun":
                              return "REQUEST REFUN"
                            case "successRefun":
                              return "SUCCESS REFUN"
                            case "requestRejected":
                              return "REQUEST REJECTED"
                            case "requestAccepted":
                              return "REQUEST ACCEPTED"
                          }
                        })()}</h4>
                        <p>{orderHistory.description}</p>
                        <Image.PreviewGroup>
                          {orderHistory.image ? (
                            JSON.parse(orderHistory.image)?.map((image) => {
                              return (
                                <Image
                                  key={image.url}
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
              </TabPane>
            </Tabs>
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
