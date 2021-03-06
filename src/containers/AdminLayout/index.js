import {
  ContactsTwoTone, DollarCircleTwoTone,
  GoldTwoTone, HomeTwoTone, InteractionTwoTone, ReconciliationTwoTone,
  RedEnvelopeTwoTone
} from "@ant-design/icons";
import {
  AttachmentButton, Avatar, ChatContainer, Conversation, ConversationHeader, ConversationList, EllipsisButton, InputToolbox, MainContainer, Message,
  MessageInput, MessageList, Sidebar
} from "@chatscope/chat-ui-kit-react";
import { Drawer, Image, Layout, List, Menu, notification, Upload } from "antd";
import axios from "axios";
import { onValue, ref, remove, set } from "firebase/database";
import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import Notification from "../../components/Notification";
import { adminRoutePaths } from "../../routes/admin";
import { realtime } from "../../services/firebase";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"



const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

class AdminRender extends Component {
  state = {
    collapsed: false,
    visible: false,
    chatVisible: false,
    drawerLength: 0,
    userMessages: [],
    messages: {},
    messageDetails: {},
    from: null,
    to: null,
    notif: [],
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount = () => {
    if (!localStorage.getItem("user")) {
      return window.location.replace("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      this.setState({
        from: JSON.parse(localStorage.getItem("user")).accountid,
      });
      onValue(ref(realtime, `message/${user.accountid}`), (snapshot) => {
        if (snapshot.val()) {
          this.setState({
            userMessages: Object.keys(snapshot.val()),
            messages: snapshot.val(),
            to: Object.keys(snapshot.val())[0]
          });
          if (this.state.to) {
            this.setState({
              messageDetails: snapshot.val()[this.state.to],
            });
          }
        }
      });
      this.getNotif();
      axios.get(`/notif/getNotiForLoginUser`).then((res) => {
        const notif = res.data.data;
        this.setState({ notif });
      });
    }
  };

  getNotif = async () => {
    onValue(
      ref(realtime, `notif/${JSON.parse(localStorage.getItem("user")).id}`),
      (snapshot) => {
        if (snapshot.val()) {
          notification.info({
            description: snapshot.val().message,
            placement: "topRight",
            onClose: () => {
              remove(
                ref(
                  realtime,
                  `notif/${JSON.parse(localStorage.getItem("user")).id}`
                )
              );
            },
          });
          // notification.close();
        }
      }
    );
  };

  showChatDrawer = () => {
    this.setState({
      chatVisible: true,
      visible: false,
    });
  };

  showNotificationDrawer = () => {
    this.setState({
      visible: true,
      chatVisible: false,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      chatVisible: false,
    });
  };

  getDrawerContent = () => {
    return this.state.drawerLength == 0.3 ? <Notification /> : <Notification />;
  };

  setMessagesDetail = (data) => {
    this.setState({
      from: JSON.parse(localStorage.getItem("user")).accountid,
      to: data.userinfo.id,
      messageDetails: data,
    });
  };
  setMessageInputValue = (data) => {
    set(ref(realtime, "chat-message"), {
      to: this.state.to,
      from: this.state.from,
      message: data,
    });
  };
  onSendFile = (info) => {
    if (info.file.status === "done") {

      if (this.state.from && this.state.to) {
        set(ref(realtime, "chat-message"), {
          to: this.state.to,
          from: this.state.from,
          file: info.file.response.url,
        });
      }
    }
  };

  uploadConf = {
    name: "file",
    action: "/files/upload",
    headers: {
      authorization: "authorization-text",
    },
    showUploadList: false,
    onChange: (info) => {
      this.onSendFile(info);
    },
  };

  render() {
    const { collapsed, messages } = this.state;
    return (
      <Layout>
        <Header
          style={{
            background: "#fff",
            margin: "5px 0px 5px 0px",
            padding: "0px 5px 0px 5px",
          }}
        >
          <NavbarAdmin
            toggleCollapsed={this.toggleCollapsed}
            collapsed={collapsed}
            showChatDrawer={this.showChatDrawer}
            showNotificationDrawer={this.showNotificationDrawer}
          />
        </Header>
        <Layout>
          <Sider
            width={200}
            className="site-layout-background"
            collapsedWidth={50}
            breakpoint="md"
            collapsed={collapsed}
          >
            <Menu
              mode="inline"
              style={{ height: "100%", borderRight: 0 }}
              defaultSelectedKeys={["Dashboard"]}
            >
              <Menu.Item key="Dashboard" icon={<HomeTwoTone />}>
                <Link
                  className="LinkDecorations"
                  to={adminRoutePaths.dashboard}
                >
                  Dashboard
                </Link>
              </Menu.Item>

              <SubMenu key="product" title="Products" icon={<GoldTwoTone />}>
                <Menu.Item key="1">
                  <Link className="LinkDecorations" to="/products/categories">
                    Categories
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link className="LinkDecorations" to="/products/catalog">
                    Catalog
                  </Link>
                </Menu.Item>
              </SubMenu>

              <Menu.Item key="Orders" icon={<ReconciliationTwoTone />}>
                <Link className="LinkDecorations" to={adminRoutePaths.orders}>
                  Orders
                </Link>
              </Menu.Item>

              <SubMenu
                key="Discount"
                title="Discounts"
                icon={<RedEnvelopeTwoTone />}
              >
                <Menu.Item key="campaigns">
                  <Link className="LinkDecorations" to="/discount/campaigns">
                    Campaigns
                  </Link>
                </Menu.Item>
                <Menu.Item key="discount-codes">
                  <Link
                    className="LinkDecorations"
                    to="/discount/discount-codes"
                  >
                    Discount Codes
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="loyalCustomer"
                title="Loyal Customer"
                icon={<ContactsTwoTone />}
              >
                <Menu.Item key="condition">
                  <Link
                    className="LinkDecorations"
                    to="/loyal-customer/conditon"
                  >
                    Conditions
                  </Link>
                </Menu.Item>
                <Menu.Item key="Customers">
                  <Link
                    className="LinkDecorations"
                    to="/loyal-customer/customer"
                  >
                    Loyal Customers
                  </Link>
                </Menu.Item>
              </SubMenu>

              {/* <Menu.Item key="returning" icon={<InteractionTwoTone />}>
                <Link className="LinkDecorations" to="/returning">
                  Returning
                </Link>
              </Menu.Item> */}

              <Menu.Item key="transaction" icon={<DollarCircleTwoTone />}>
                <Link className="LinkDecorations" to="/transaction">
                  Transaction
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0px 5px 0px 5px" }}>
            <Content
              className="site-layout-background scrollable-container"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {this.props.children}
              <Drawer
                width={window.innerWidth * 0.3}
                placement="right"
                size={"736px"}
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
              >
                <List
                  className="demo-loadmore-list"
                  itemLayout="horizontal"
                  dataSource={this.state.notif}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Link to={`/orders/${item.link}`}>{item.link}</Link>}
                        description={item.message}
                      />
                    </List.Item>
                  )}
                />
              </Drawer>

              <Drawer
                width={window.innerWidth * 0.45}
                placement="right"
                size={"736px"}
                closable={false}
                onClose={this.onClose}
                visible={this.state.chatVisible}
              >
                <MainContainer responsive>
                  <Sidebar position="left" scrollable={false}>
                    <ConversationList>
                      {this.state.userMessages.map((element, index) => {
                        return (
                          <Conversation
                            key={index}
                            name={ `${this.state.messageDetails.userinfo?.firstname ?? this.state.messageDetails.userinfo?.name} ${this.state.messageDetails.userinfo?.lastname ?? ""}`}
                            onClick={() =>
                              this.setMessagesDetail(messages[element])
                            }
                          >
                            <Avatar src={messages[element].userinfo?.avt} />
                          </Conversation>
                        );
                      })}
                    </ConversationList>
                  </Sidebar>

                  <ChatContainer>
                    <ConversationHeader>
                      <ConversationHeader.Back />
                      <ConversationHeader.Content
                        userName=
                        { `${this.state.messageDetails.userinfo?.firstname ?? this.state.messageDetails.userinfo?.name} ${this.state.messageDetails.userinfo?.lastname ?? ""}`}
                      />
                      <ConversationHeader.Actions>
                        <EllipsisButton orientation="vertical" />
                      </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList>
                      {this.state.messageDetails.data?.map((message) => {
                        if (
                          message.from ===
                          JSON.parse(localStorage.getItem("user")).accountid
                        ) {
                          if (message.message) {
                            return (
                              <Message
                                model={{
                                  message: `${message.message}`,
                                  direction: "outgoing",
                                  position: "normal",
                                  sender: "Me",
                                }}
                              />
                            );
                          } else {
                            return (
                              <Message
                                type="custom"
                                model={{
                                  direction: "outgoing",
                                }}
                              >
                                <Message.CustomContent>
                                  <Image
                                    width={150}
                                    height={150}
                                    src={message.file}
                                    preview={{
                                      src: message.file,
                                    }}
                                  />
                                </Message.CustomContent>
                              </Message>
                            );
                          }
                        } else {
                          if (message.message) {
                            return (
                              <Message
                                model={{
                                  message: `${message.message}`,
                                  direction: "incoming",
                                  position: "normal",
                                }}
                              />
                            );
                          } else {
                            return (
                              <Message
                                model={{
                                  direction: "incoming",
                                  type: "custom",
                                }}
                              >
                                <Message.CustomContent>
                                  <Image
                                    width={150}
                                    height={150}
                                    src={message.file}
                                    preview={{
                                      src: message.file,
                                    }}
                                  />
                                </Message.CustomContent>
                              </Message>
                            );
                          }
                        }
                      })}
                    </MessageList>
                    <InputToolbox>
                      <Upload {...this.uploadConf}>
                        <AttachmentButton />
                      </Upload>
                    </InputToolbox>
                    <MessageInput
                      placeholder="Type message here"
                      attachButton={false}
                      onSend={(val) => this.setMessageInputValue(val)}
                    />
                  </ChatContainer>
                </MainContainer>
              </Drawer>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default function AdminLayout({ Component, ...props }) {
  return (
    <Route
      {...props}
      render={(propsComponent) => {
        return (
          <AdminRender>
            <Component {...propsComponent} />
          </AdminRender>
        );
      }}
    />
  );
}
