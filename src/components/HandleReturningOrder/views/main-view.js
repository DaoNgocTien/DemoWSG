import React, { Component, memo } from "react";
import action from "../modules/action";
import { connect } from "react-redux";
import {
  Modal,
  Button,
  Form,
  Table,
  Input,
  Descriptions,
  Upload,
  Tabs,
  Col,
  Row,
  PageHeader,
  Typography,
  Timeline,
} from "antd";
import PropTypes from "prop-types";

import {
  LoadingOutlined,
  PlusOutlined,
  IdcardTwoTone,
  WalletTwoTone,
  SafetyCertificateTwoTone,
  ClockCircleOutlined,
} from "@ant-design/icons";
import InformationModal from "./information-view";
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

  handleAccept = data => {
    
  }

  handleReject = (data) => {
    // data.image = this.state.fileList;
    this.props.rejectOrder(this.props.record.ordercode, data.reason, JSON.stringify(this.state.fileList));
    this.formRef.current.resetFields();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
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
        return (JSON.parse(data)).length === 0 ? (
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
    }
  ];

  render() {

    this.state.record = this.props.record;
    const {
      openModal,
      closeModal,
      acceptRequest,
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
          title="HANDLE ORDER RETURNING"
          subTitle={`This is a returning order handleing page`}
          extra={[
            <Button
              type="danger"
              onClick={() => this.start("openDetailModal")}
              // disabled={
              //   !viewButton || this.state.selectedRowKeys.length === 0
              //     ? true
              //     : false
              // }
              // hidden={
              //   !viewButton || this.state.selectedRowKeys.length === 0
              //     ? true
              //     : false
              // }

              style={{ marginLeft: 3 }}
            >
              Reject
            </Button>,

            <Button
              type="primary"
              onClick={() => this.start("openHandleModal")}
              // disabled={
              //   !actionButton || this.state.selectedRowKeys.length === 0
              //     ? true
              //     : false
              // }
              // hidden={
              //   !actionButton || this.state.selectedRowKeys.length === 0
              //     ? true
              //     : false
              // }

              style={{ marginLeft: 3 }}
            >
              Submit
            </Button>
          ]}
          footer={
            <>
              <Tabs defaultActiveKey="returning" centered type="card">
                <TabPane tab={
                  <span>
                    <IdcardTwoTone style={{ fontSize: "25px" }} />
                    Returning Request
                  </span>
                }
                  key="returning"
                  style={{ background: "#ffffff" }}
                >

                </TabPane>

                {/* <TabPane tab={
                  <span>
                    <WalletTwoTone style={{ fontSize: "25px" }} />
                    Order Information
                  </span>
                }
                  key="information"
                  style={{ background: "#ffffff" }}
                >

                </TabPane> */}

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
          <> <Title style={{ textAlign: "center", padding: "30px" }} level={3}>ORDER INFORMATION</Title>

            <InformationModal
              // openModal={openModal}
              // closeModal={closeModal}
              record={this.props.record.complainRecord}
              // selectedRowKeys={selectedRowKeys}
            />
          </>
          {/* <Descriptions
            bordered
            title="Order Infomation"
            column={2}
            style={{ marginBottom: "10px" }}
          >
            <Descriptions.Item label="Order Code">
              {this.state.record?.ordercode}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              {this.state.record?.totalprice}VND
            </Descriptions.Item>
            <Descriptions.Item label="Discount Price">
              {this.state.record?.discountprice}VND
            </Descriptions.Item>
            <Descriptions.Item label="Final Price">
              {" "}
              {this.state.record?.totalprice -
                this.state.record?.discountprice}
              VND
            </Descriptions.Item>


            <Descriptions.Item label="Status">
              {this.state.record?.status}
            </Descriptions.Item>

          </Descriptions>
          <Table
            columns={this.columns}
            dataSource={this.state.record.details}
          /> */}


        </PageHeader>
       
      </>
    );
  }
}


// const mapStateToProps = (state) => {
//   return {
//     loading: state.handleReturningOrderReducer.loading,
//     data: state.handleReturningOrderReducer.data,
//     error: state.handleReturningOrderReducer.err,
//     record: state.handleReturningOrderReducer.complainRecord,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getReturningOrder: async () => await dispatch(action.getOrder()),

//     acceptRequest: async (data) => {
//       // await dispatch(action.updateStatusOrder(data));
//       // await dispatch(action.getOrder())
//     },
//     rejectRequest: async (orderCode, reasonForCancel, imageProof) => {
//       // await dispatch(action.rejectOrder(orderCode, reasonForCancel, imageProof));
//     },

//     // storeComplainRecord: async (record) => {
//     //   console.log("storeComplainRecord");
//     //   console.log(record);
//     //   await dispatch(action.storeComplainRecord(record));
//     // }
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(HandleReturningOrderUI);

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(HandleReturningOrderUI, arePropsEqual);
