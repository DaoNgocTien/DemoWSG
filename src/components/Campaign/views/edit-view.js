import React, { Component, memo } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Descriptions,
  Upload,
  Switch,
} from "antd";
import PropTypes from "prop-types";
import moment from "moment";

//  prototype
const propsProTypes = {
  closeModal: PropTypes.func,
  updateCampaign: PropTypes.func,
  openModal: PropTypes.bool,
};

//  default props
const propsDefault = {
  closeModal: () => {},
  updateCampaign: () => {},
  openModal: false,
};

class UpdateModal extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    // productSelected: null,
    price: 0,
    // (this.props.record?.price /
    //   this.props.productList?.find(
    //     (element) => element.id === this.props.record?.productid
    //   )?.retailprice) *
    //   100 || 0,
  };
  formRef = React.createRef();

  componentDidMount() {}

  handleUpdateAndClose = (data) => {
    // console.log(data);

    const productSelected = !this.state.productSelected
      ? this.props.productList?.find(
          (element) => element.id === this.props.record?.productid
        )
      : this.state.productSelected;
    let newCampaign = {
      id: this.props.record?.id,
      productId: data.productId,
      fromDate: data.date[0].format("MM/DD/YYYY"),
      toDate: data.date[1].format("MM/DD/YYYY"),
      quantity: data.quantity,
      price: (data.wholesalePercent * productSelected.retailprice) / 100,
      maxQuantity: data.maxQuantity,
      isShare: data.isShare,
      advanceFee: data.advancePercent
    };

    // console.log(newCampaign);
    // data.image = this.state.fileList;
    this.props.updateCampaign(newCampaign);
    // this.formRef.current.resetFields();
    this.props.closeModal();
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
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
  };

  onSelectProduct = (value) => {
    this.setState({
      productSelected: this.props.productList?.find(
        (element) => element.id === value
      ),
    });
  };

  onChangePrice = (value) => {
    this.setState({
      price: value,
    });
  };

  render() {
    const { RangePicker } = DatePicker;
    const { openModal } = this.props;

    const { productList, record } = this.props;
    const {
      productSelected = this.props.productList?.find(
        (element) => element.id === this.props.record?.productid
      ) || {},
      shareChecked = record?.isshare,
    } = this.state;

    // console.log(this.state.price);
    // console.log(
    //   (this.props.record?.price / productSelected?.retailprice) * 100
    // );

    this.state.price =
      this.state.price === 0 || !this.state.price
        ? (this.props.record?.price / productSelected?.retailprice) * 100
        : this.state.price;

    if (this.props.loading || !this.props.record) {
      return <></>;
    }
    return (
      <>
        <Form
          id="updateCampaignForm"
          ref={this.formRef}
          onFinish={this.handleUpdateAndClose}
        >
          <Modal
            width={window.innerWidth * 0.7}
            heigh={window.innerHeight * 0.5}
            style={{
              top: 10,
            }}
            title="Update"
            visible={openModal}
            onCancel={this.handleCancel}
            footer={[
              <Button onClick={this.handleCancel} key="btnCancel">
                Cancel
              </Button>,
              <Button
                type="primary"
                form="updateCampaignForm"
                key="submit"
                htmlType="submit"
              >
                Submit
              </Button>,
            ]}
          >
            <Descriptions layout="vertical" column={2}>
              <Descriptions.Item label="Campaign duration">
                <Form.Item
                  name="date"
                  initialValue={[
                    moment(this.props.record?.fromdate),
                    moment(this.props.record?.todate),
                  ]}
                >
                  <RangePicker
                    ranges={{
                      Today: [moment(), moment()],
                      "This Week": [
                        moment().startOf("week"),
                        moment().endOf("week"),
                      ],
                      "This Month": [
                        moment().startOf("month"),
                        moment().endOf("month"),
                      ],
                    }}
                    defaultValue={[
                      moment(this.props.record?.fromdate),
                      moment(this.props.record?.todate),
                    ]}
                    format="MM/DD/YYYY"
                    onChange={this.onChange}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Product">
                <Form.Item name="productId" initialValue={record.productid}>
                  <Select
                    onChange={this.onSelectProduct}
                    style={{ width: "60vh" }}
                  >
                    {productList?.map((item) => {
                      return (
                        <Select.Option key={item.key} value={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Quantity">
                <Form.Item name="quantity" initialValue={record.quantity}>
                  <InputNumber
                    addonAfter=" products"
                    defaultValue={record?.quantity}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Max Quantity">
                <Form.Item
                  name="maxQuantity"
                  initialValue={record?.maxquantity}
                >
                  <InputNumber
                    addonAfter=" products"
                    defaultValue={record?.maxquantity}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Advance Percent">
                <Form.Item name="advancePercent" initialValue={record?.advancefee}>
                  <InputNumber
                    addonAfter="%"
                    defaultValue={record?.advancefee}
                    min={0}
                    max={100}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Share">
                <Form.Item name="isShare" initialValue={record?.isshare}>
                  <Switch
                    checked={shareChecked}
                    onClick={() => {
                      this.setState({ shareChecked: !shareChecked });
                    }}
                  />
                </Form.Item>
              </Descriptions.Item>

              <Descriptions.Item label="Wholesale percent">
                <Form.Item
                  name="wholesalePercent"
                  initialValue={
                    (this.props.record?.price / productSelected?.retailprice) *
                    100
                  }
                >
                  <InputNumber
                    addonAfter="%"
                    defaultValue={
                      (this.props.record?.price /
                        productSelected?.retailprice) *
                      100
                    }
                    onChange={this.onChangePrice}
                    min={0}
                    max={100}
                    style={{ width: "60vh" }}
                  />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions bordered title="Product in campaign" column={2}>
              <Descriptions.Item label="Name">
                {productSelected?.name ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {productSelected?.categoryname ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity in stock">
                {productSelected?.quantity ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity in campaign">
                {productSelected?.name ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Retail price">
                {productSelected?.retailprice ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Wholesale price">
                {(this.state.price * productSelected?.retailprice) / 100 ?? ""}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                <Input.TextArea
                  value={productSelected?.description}
                  rows={5}
                  bordered={false}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Image">
                <Upload
                  name="file"
                  action="/files/upload"
                  listType="picture-card"
                  fileList={
                    productSelected.image
                      ? JSON.parse(productSelected?.image)
                      : []
                  }
                  // onPreview={this.handlePreview}
                  // onChange={this.handleChange}
                >
                  {/* {this.state.fileList.length >= 8 ? null : uploadButton} */}
                </Upload>
              </Descriptions.Item>
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
export default memo(UpdateModal, arePropsEqual);
