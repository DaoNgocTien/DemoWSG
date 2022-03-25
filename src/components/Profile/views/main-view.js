import {
  IdcardTwoTone,
  SafetyCertificateTwoTone,
  WalletTwoTone,
} from "@ant-design/icons";
import { PageHeader, Select, Tabs, Tag } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import EWalletTab from "./e-wallet-view";
import ProfileTab from "./profile-view";
import PasswordTab from "./security-view";

const { Option } = Select;
const { TabPane } = Tabs;

const propsProTypes = {
  index: PropTypes.number,
  data: PropTypes.array,
};

const propsDefault = {
  index: 1,
  data: [],
  products: [],
};

class ProfileUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
  state = {
    user: {
      username: "",
      googleId: "",
      loginMethod: "",
      rolename: "",
    },
    loading: false,
    selectedRowKeys: [],
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

  componentDidMount() {
    let storedUser = JSON.parse(localStorage.getItem("user"));
    this.setState({
      user: {
        username: storedUser.username,
        googleId: storedUser.googleid,
        loginMethod: storedUser.googleid ? "BY GOOGLE MAIL" : "BY USERNAME",
        ...this.props.data,
      },
    });
  }

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
    let record = this.props.data.filter((item) => {
      return selectedRowKeys.includes(item.id);
    })[0];

    this.setState({
      selectedRowKeys,
      record: record,
      editButton: selectedRowKeys.length === 1,
      deleteButton: selectedRowKeys.length === 1,
      addNewButton: selectedRowKeys.length === 0,
    });
  };

  onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  normFile = (e) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  render() {
    const { selectedRowKeys, user } = this.state;

    const { productList,  } =
      this.props;

    console.log(this.props.data);
    console.log(user);

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        style={{ background: "#fafafa" }}
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[1].toUpperCase()}
        tags={
          <>
            <Tag color="blue">{this.props.data.rolename}</Tag>
            <Tag color="red">{user.loginMethod}</Tag>
          </>
        }
        footer={
          <Tabs defaultActiveKey="profile" centered type="card">
            <TabPane
              tab={
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

            <TabPane
              tab={
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

            <TabPane
              tab={
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
      ></PageHeader>
    );
  }
}

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

export default memo(ProfileUI, arePropsEqual);
