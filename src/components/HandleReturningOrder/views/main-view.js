import React, { Component, memo } from "react";
import Loader from "../../../components/Loader";
import { Button, Tabs, PageHeader, Typography, Timeline, Image } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import {
  LoadingOutlined,
  PlusOutlined,
  IdcardTwoTone,
  SafetyCertificateTwoTone,
  ClockCircleOutlined,
} from "@ant-design/icons";
import InformationModal from "./information-view";
const { Title } = Typography;
const { TabPane } = Tabs;

const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  record: PropTypes.object,
  openModal: PropTypes.bool,
};

const propsDefault = {
  closeModal: () => {},
  updateCampaign: () => {},
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
    };
  }
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  formRef = React.createRef();

  componentDidMount() {
    console.log(this.props.record);
  }

  handleAccept = () => {};

  handleReject = (data) => {
    this.props.rejectOrder(
      this.props.record.ordercode,
      data.reason,
      JSON.stringify(this.state.fileList)
    );
    this.formRef.current.resetFields();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
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

  handleChange = ({ fileList }) => {
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
      key: "price",
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
    },
    {
      title: "Note",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  render() {
    const { loading } = this.props;
    if (loading) return <Loader />;
    this.state.record = this.props.record;
    const { data } = this.props;
    console.log(data);
    const { load } = this.state;
    return (
      <>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title="HANDLE ORDER RETURNING"
          subTitle={`This is a returning order handleing page`}
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
                            {orderHistory.image
                              ? JSON.parse(orderHistory.image)?.map((image) => {
                                  return (
                                    <Image
                                      width={200}
                                      src={image.url}
                                      preview={{
                                        src: image.url,
                                      }}
                                    />
                                  );
                                })
                              : null}
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
