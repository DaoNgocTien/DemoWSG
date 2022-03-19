import React, { Component, memo } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  PageHeader,
  Space,
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Rate,
  Checkbox,
  Avatar,
  Descriptions,
  Tag,
  Statistic,
  Tabs,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { UserOutlined, WalletTwoTone, IdcardTwoTone, SafetyCertificateTwoTone } from '@ant-design/icons';


import ProfileTab from "./profile-view";
import EWalletTab from "./e-wallet-view";
import PasswordTab from "./password-view";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
const { Option } = Select;
const { TabPane } = Tabs;

const IconLink = ({ src, text, link }) => (
  <a className="example-link">
    <img className="example-link-icon" src={src} alt={text} style={{ marginRight: "5px" }} />
    <Link
      className="LinkDecorations"
      to={link}
    >
      {text}
    </Link>
  </a>
);

//  prototype
const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
  defaultCampaign: PropTypes.object,
  createCampaign: PropTypes.func,
  updateCampaign: PropTypes.func,
  deleteCampaign: PropTypes.func,
};

//  default props
const propsDefault = {
  index: 1,
  data: [],
  products: [],
  defaultCampaign: {},
};

class ProfileUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    loading: false,
    selectedRowKeys: [], // Check here to configure the default column
    loadingActionButton: false,
    editButton: false,
    deleteButton: false,
    addNewButton: true,
    openCreateModal: false,
    openDeleteModal: false,
    openEditModal: false,
    displayData: [],
    searchKey: "",
    openDrawer: false,
    record: {},
    orderList: [],
  };

  componentDidMount() { }

  showDrawer = () => {
    this.setState({
      openDrawer: true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      openDrawer: false,
    });
  };

  start = (openModal) => {
    let selectedRowKeys = this.state.selectedRowKeys;
    let data = this.props.data;
    //  Get campaign record
    let recordToEdit = data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    switch (openModal) {
      case "openCreateModal":
        this.setState({ loadingActionButton: true, openCreateModal: true });
        break;

      case "openDeleteModal":
        this.setState({ loadingActionButton: true, openDeleteModal: true });

        break;

      case "openEditModal":
        this.setState({
          loadingActionButton: true,
          openEditModal: true,
          record: recordToEdit,
        });

        break;
      case "openOrdersInCampaign": {
        //  Get orders in campaign
        let orderList = this.props.orderList;
        let orderListInCampaign = orderList?.filter((item) => {
          return selectedRowKeys.includes(item.campaignid);
        });
        this.props.getCampaign(selectedRowKeys);

        //  Set campaign record and orders in campaign into state
        this.setState({
          openDrawer: true,
          record: recordToEdit,
          orderList: orderListInCampaign,
        });

        break;
      }
      default:
        break;
    }
  };

  closeModal = () => {
    this.setState({
      openCreateModal: false,
      openDeleteModal: false,
      openEditModal: false,
    });
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
      fixed: "left",
    },
    {
      title: "Product Name",
      dataIndex: "productname",
      key: "productname",
      sorter: (a, b) => a.productname.length - b.productname.length,
      fix: "left",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Max Quantity",
      dataIndex: "maxquantity",
      key: "maxquantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Orders",
      dataIndex: "numorder",
      key: "numorder",
    },
    {
      title: "Advance Percent",
      dataIndex: "advancefee",
      key: "advancefee",
      render: (data) => data + "%",
    },
    {
      title: "Start Date",
      dataIndex: "fromdate",
      key: "fromdate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "todate",
      key: "todate",
      render: (data) => moment(data).format("MM/DD/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  onChangeHandler = (e) => {
    let { data } = this.props;
    let searchString = e.target.value;
    let searchList = data.filter((item) => {
      return (
        item.productname.toUpperCase().includes(searchString.toUpperCase()) ||
        item.fromdate.includes(searchString) ||
        item.todate.includes(searchString)
      );
    });
    this.setState({
      displayData: searchList,
      searchKey: searchString ?? "",
    });
  };

  onSelectChange = (selectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    // console.log(this.props.data);
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    // console.log(record);
    // this.setState({
    //   record: this.props.data.filter((item) => {
    //     return selectedRowKeys.includes(item.id);
    //   })[0]
    // });
    // // console.log(this.state.record);
    this.setState({
      selectedRowKeys,
      record: record,
      editButton: selectedRowKeys.length === 1,
      deleteButton: selectedRowKeys.length === 1,
      addNewButton: selectedRowKeys.length === 0,
    });
  };

  onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };



  render() {
    const {
      selectedRowKeys,
      deleteButton,
      editButton,
      addNewButton,
      openCreateModal,
      openDeleteModal,
      openEditModal,
      displayData,
      searchKey,
    } = this.state;

    const { productList, createCampaign, updateCampaign, deleteCampaign } =
      this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // const hasSelected = selectedRowKeys.length > 0;
    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        style={{ background: "#fafafa" }}
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[1].toUpperCase()}
        // subTitle={`This is a ${arrayLocation[1]} page`}
        tags={
          <>
            <Tag color="blue">Role</Tag>
            <Tag color="red">Login Method</Tag>
          </>
        }
        // avatar={
        //   <Avatar
        //     shape="square"
        //     size={100}
        //     icon={<UserOutlined />}
        //   />
        // }
        footer={
          <Tabs defaultActiveKey="profile" centered type="card">
            <TabPane tab={
              <span>
                <IdcardTwoTone style={{ fontSize: "25px" }} />
                Profile
              </span>
            }
              key="profile"
              style={{ background: "#ffffff" }}
            >
              <div>


                <ProfileTab />

              </div>
            </TabPane>

            <TabPane tab={
              <span style={{ alignItems: "center" }}>
                <SafetyCertificateTwoTone style={{ fontSize: "25px" }} />
                Security
              </span>
            }
              key="security"
              style={{ background: "#ffffff" }}
            >
              <PasswordTab />
            </TabPane>

            <TabPane tab={
              <span>
                <WalletTwoTone style={{ fontSize: "25px" }} />
                E-Wallet
              </span>
            }
              key="ewallet"
              style={{ background: "#ffffff" }}
            >
              <EWalletTab />
            </TabPane>
          </Tabs>

        }
      >
        <Descriptions size="small" column={10}>
          <Descriptions.Item>
            <Avatar
              shape="square"
              size={120}
              icon={<UserOutlined />}
            />
          </Descriptions.Item>

          <Descriptions.Item span={3}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Name">

              </Descriptions.Item>
              <Descriptions.Item label="Phone number">

              </Descriptions.Item>
              <Descriptions.Item label="Email">

              </Descriptions.Item>
              <Descriptions.Item>
                <Space>
                  <IconLink
                    src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
                    text="List orders"
                    link="/orders/catalog"
                  />
                  <IconLink
                    src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"
                    text=" Product Info"
                    link="/products/catalog"
                  />
                  <IconLink
                    src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"
                    text="Income"
                    link="/"
                  />
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>

          <Descriptions.Item span={2}>
            <Statistic
              title="Total Products"
              suffix=" products"
              value="100"
            // style={{
            //   marginRight: 32,
            // }}
            />
          </Descriptions.Item>

          <Descriptions.Item span={2}>
            <Statistic
              title="Total Campaigns"
              suffix=" campaigns"
              value="10"
            // style={{
            //   marginRight: 32,
            // }}
            />
          </Descriptions.Item>
          <Descriptions.Item span={2}>
            <Statistic title="Orders" prefix="$" value={568.08} />
          </Descriptions.Item>
        </Descriptions>


      </PageHeader >
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(ProfileUI, arePropsEqual);
