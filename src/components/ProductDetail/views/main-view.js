import {
  Button,
  Col,
  Descriptions,
  Image,
  Input,
  PageHeader,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
// import CreateModal from "./create-view";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";
import NumberFormat from "react-number-format";

const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultProduct: PropTypes.object,
  createProduct: PropTypes.func,
  updateProduct: PropTypes.func,
  deleteProduct: PropTypes.func,
};

const propsDefault = {
  index: 1,
  data: [],
  defaultProduct: {},
  createCategory: () => {},
  updateCategory: () => {},
  deleteProduct: () => {},
};

class ProductUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {};

  componentDidMount() {}

  campaignColumns = [
    // {
    //   title: "No.",
    //   dataIndex: "No.",
    //   key: "No.",
    //   render: (text, object, index) => {
    //     return index + 1;
    //   },
    //   width: 100,
    //   fixed: "left",
    // },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      sorter: (a, b) => a.productname.length - b.productname.length,
      width: 300,
      fix: "left",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: 120,
      fix: "left",
    },
    {
      title: "Max Quantity",
      dataIndex: "maxquantity",
      key: "maxquantity",
      width: 120,
    },
    {
      title: "Created Date",
      dataIndex: "createdat",
      key: "createdat",
      width: 120,
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "Type",
      key: "type",
      render: (object) => {
        return (
          <Tag color={!object.isshare ? "blue" : "green"}>
            {!object.isshare ? "SINGLE" : "SHARED"}
          </Tag>
        );
      },
      width: 100,
      fix: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => {
        return (
          <Tag
            color={
              data === "ready"
                ? "blue"
                : data === "active"
                ? "red"
                : data === "done"
                ? "green"
                : "grey"
            }
          >
            {data.toUpperCase() === "DEACTIVATED" ? "STOP" : data.toUpperCase()}
          </Tag>
        );
      },
      width: 100,
      fix: "right",
    },
    {
      title: "",
      key: "",
      render: (object) => {
        if (object.status === "ready") {
          return (
            <Button
              // onClick={() => this.startCampaignBeforeHand(object)}
              type="primary"
            >
              Start Campaign
            </Button>
          );
        }
      },
      fixed: "right",
      width: 150,
    },
  ];
  closeModal = () => {
    this.setState({
      openCreateModal: false,
      openDeleteModal: false,
      openEditModal: false,
    });
  };

  start = (openModal) => {
    switch (openModal) {
      case "openDeleteModal":
        this.setState({ loadingActionButton: true, openDeleteModal: true });

        break;

      case "openEditModal":
        this.setState({ loadingActionButton: true, openEditModal: true });

        break;
      default:
        break;
    }
  };

  render() {
    const { record, categoryList, campaignList } = this.props;
    return (
      <>
        <PageHeader
          className="site-page-header-responsive"
          onBack={() => window.history.back()}
          title={record?.name.toUpperCase()}
          extra={[
            <Button
              type="danger"
              onClick={() => this.start("openDeleteModal")}
              // disabled={!deleteButton}
              style={{ width: 90 }}
            >
              Disable
            </Button>,
            <Button
              type="primary"
              onClick={() => this.start("openEditModal")}
              // disabled={!this.state.editButton}
              style={{ width: 90 }}
            >
              Edit
            </Button>,
          ]}
        ></PageHeader>
        <DeleteModal
          loading={this.props.loading}
          openModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          categoryList={categoryList}
          deleteProduct={this.props.deleteProduct}
          record={record}
          availableQuantity={
            this.state.record?.quantity - this.state.record?.maxquantity ?? 0
          }
          data={this.props.data}
        />
        <EditModal
          loading={this.props.loading}
          openModal={this.state.openEditModal}
          closeModal={this.closeModal}
          categoryList={categoryList}
          updateProduct={this.props.updateProduct}
          record={record}
          orderList={this.props.orderList}
          availableQuantity={true}
          data={this.props.data}
        />

        <Descriptions
          bordered
          column={2}
          size="small"
          labelStyle={{ width: "10%", fontWeight: "bold" }}
          // style={{ width: "100%" }}
        >
          <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>

          <Descriptions.Item label="Category">
            {
              categoryList?.find((element) => element.id === record?.categoryid)
                ?.categoryname
            }
          </Descriptions.Item>

          <Descriptions.Item label="Quantity">
            {record?.quantity}
          </Descriptions.Item>

          <Descriptions.Item label="Price">
            <NumberFormat
              value={record?.retailprice}
              thousandSeparator={true}
              suffix={" VND"}
              decimalScale={0}
              displayType="text"
            />
          </Descriptions.Item>

          <Descriptions.Item label="Image" span={2}>
            {record?.image ? (
              JSON.parse(record?.image)?.map((image) => {
                return (
                  <Image
                    width={100}
                    height={100}
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
          </Descriptions.Item>

          <Descriptions.Item label="Description" span={2}>
            <Input.TextArea
              value={record?.description}
              rows={3}
              bordered={false}
              disabled
              style={{
                color: "black",
                background: "white",
                pointerEvents: "none",
              }}
            />
          </Descriptions.Item>

          <Descriptions.Item label="Created Date">
            {moment(record?.createdat).format("MM/DD/YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label="Updated Date">
            {moment(record?.updatedat).format("MM/DD/YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {record?.status === "incampaign" ? (
              <Tag color="green">IN CAMPAIGN</Tag>
            ) : record?.status === "active" ? (
              <Tag color="blue">ACTIVE</Tag>
            ) : (
              <Tag color="red">DEACTIVE</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
        <Table
          loading={this.props.loading}
          // rowSelection={rowSelection}
          columns={this.campaignColumns}
          dataSource={campaignList}
          scroll={{ y: 350 }}
          style={{ marginTop: "50px" }}
          title={() => {
            return (
              <h6>
                <strong>Campaigns</strong>
              </h6>
            );
          }}
        />
      </>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(ProductUI, arePropsEqual);
