import {
  IdcardTwoTone,
  SafetyCertificateTwoTone,
  WalletTwoTone
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

  render() {
    const { selectedRowKeys, user } = this.state;

    const { productList,  } =
      this.props;

    const arrayLocation = window.location.pathname.split("/");
    return (
      <PageHeader
        style={{ background: "#fafafa" }}
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={arrayLocation[1]?.toUpperCase()}
        tags={
          <>
            <Tag color="blue">{this.props.data.rolename?.toUpperCase()}</Tag>
            <Tag color="red">{user.loginMethod?.toUpperCase()}</Tag>
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
