import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Descriptions, Form, Input, Modal, Switch, Table, Upload } from "antd";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

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

class RejectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      isReasonable: true,
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
      requester: "Customer",
    };
  }
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  formRef = React.createRef();

  componentDidMount() {
  }
  // orderCode, type, description, image, orderId
  handleRejectAndClose = (data) => {
    // console.log(this.props.record);
    //  this.props.campaignId != null => request from orders-in-campaign component
    this.props.campaignid != null ?

      this.props.rejectOrder(
        this.props.record.ordercode,
        "campaign",
        data.reason,
        this.state.fileList,
        this.props.record.id,
        this.props.campaignId)
      :
      this.props.rejectOrder(
        this.props.record.ordercode,
        "retail",
        data.reason,
        this.state.fileList,
        this.props.record.id);
    // this.formRef.current.resetFields();
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
      width: 200,
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
      fix: "right"
    },
  ]
  getRequester = checked => {
  //  console.log(checked)
    this.setState({
      requester: checked ? "Customer" : "Supplier"
    })
  }
  render() {
    this.state.record = this.props.record;
    const { openModal, record } = this.props;
    const { isReasonable, load, imageUrl, fileList, requester } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
  //  console.log(record);
    return (
      <>
        <Form
          id="rejectOrderForm"
          key={this.state.record?.key}
          ref={this.formRef}
          onFinish={this.handleRejectAndClose}
          layout="vertical"
        >
          <Modal
            width={window.innerWidth * 0.7}
            title={`Order of ${this.state.record.customerfirstname +
              " " +
              this.state.record.customerlastname
              }`}
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel}>Cancel</Button>,
              <Button
                type="danger"
                form="rejectOrderForm"
                key="submit"
                htmlType="submit"
                disabled={isReasonable}
              >
                Reject
              </Button>,
            ]}
          >
            <Descriptions
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
              scroll={{ y: 350, x: 1000 }}

            />

            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Reason">
                <Form.Item
                  name="reason"
                  rules={[
                    { required: true, message: "Please input your reason to reject order!" },
                  ]}
                  initialValue={record?.reasonforcancel ? record?.reasonforcancel : ""}
                >
                  <Input.TextArea placeholder="Reason is required!" onChange={(e) => this.recordReasonToReject(e)} autoSize={{ minRows: 5, maxRows: 8 }} style={{ width: "60vh" }} />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Image">
                <Form.Item name="image"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please confirm your password!',
                    // },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (fileList.length >= 1) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('Image proof for cancel order please!!'));
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
              {/* <Descriptions.Item label="Request from"> */}
              <Form.Item
                label="Request from"
                name="cancellingRequester"
              // initialValue={record?.isshare}
              >
                <Switch
                  checkedChildren="Customer"
                  unCheckedChildren="Supplier"
                  defaultChecked={record?.cancellingRequester === "Customer" ? "true" : "false"}
                  onChange={(e) =>
                    this.getRequester(e)
                  }
                />
              </Form.Item>
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
export default memo(RejectModal, arePropsEqual);
