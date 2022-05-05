import { OpenInNew } from "@material-ui/icons";
import {
  Button,
  Descriptions,
  Image,
  Input,
  PageHeader,
  Table,
  Tag
} from "antd";
import moment from "moment";
import React, { Component, memo } from "react";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import DeleteModal from "./delete-view";
import EditModal from "./edit-view";

class ProductUI extends Component {
  state = {};

  campaignColumns = [
    {
      title: "Campaign Name",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.length - b.description.length,
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
      title: "Duration",
      key: "duration",
      width: 120,
      render: (object) => {
        return (
          <Tag color="blue">
            {moment(object.statdate).format("MM/DD/YYYY")}
          </Tag>
          -
          <Tag color="green">
            {moment(object.enđate).format("MM/DD/YYYY")}
          </Tag>
        );
      },
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
          return (<>

            <Link to={`/discount/campaign/${object.id}`}>
              <Button icon={<OpenInNew />}
                type="default"
                shape="circle"
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "none",
                }} />
            </Link>
          </>
          );
        } else {
          return <Link to={`/discount/campaign/${object.id}`}>
            <Button icon={<OpenInNew />}
              type="default"
              shape="circle"
              style={{
                border: "none",
                boxShadow: "none",
                background: "none",
              }} />
          </Link>
        }
      },
      fixed: "right",
      width: 150,
    },
  ];

  closeModal = () => {
    this.setState({
      openDeleteModal: false,
      openEditModal: false,
    });
  };

  start = (openModal) => {
    switch (openModal) {
      case "openDeleteModal":
        this.setState({ openDeleteModal: true });
        break;

      case "openEditModal":
        this.setState({ openEditModal: true });
        break;

      default:
        break;
    }
  };

  activeProduct = (id) => {
    return this.props.activeProduct(id);
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
              hidden={record?.status === "deactivated"}
              style={{ width: 90 }}
            >
              Disable
            </Button>,
            <Button
              type="primary"
              onClick={() => this.activeProduct(record?.id)}
              hidden={record?.status === "active"}
              style={{ width: 90 }}
            >
              Active
            </Button>,
            <Button
              type="primary"
              onClick={() => this.start("openEditModal")}
              style={{ width: 90 }}
              hidden={record?.status === "deactivated"}
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
        >
          <Descriptions.Item label="Name">
            {record?.name}
          </Descriptions.Item>

          <Descriptions.Item label="Category">
            {categoryList?.find((element) => element.id === record?.categoryid)
              ?.categoryname}
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
