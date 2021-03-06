import { AndroidOutlined, AppleOutlined, ClockCircleTwoTone, ContactsTwoTone } from '@ant-design/icons';
import {
  Avatar, Button, Descriptions, List,
  Space, Tabs
} from "antd";
import React, { Component, memo } from "react";

const { TabPane } = Tabs;
const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    key: i,
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

const IconText = ({ time, owner }) => (
  <>
    <Descriptions column={3}>
      <Descriptions.Item label={<ClockCircleTwoTone />}>
        {time}
      </Descriptions.Item>
      <Descriptions.Item label={<ContactsTwoTone />}>
        {owner}
      </Descriptions.Item>
    </Descriptions>
  </>
);

class NotificationUI extends Component {
  state = {
    current: "",
  };

  onShowDetail = key => {
    this.setState({
      current: key ? key : ""
    })
  }

  render() {
    return (
      <Tabs defaultActiveKey="2">
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              New notification
            </span>
          }
          key="1"
        >
          <List
            itemLayout="vertical"
            size="small"
            pagination={{
              onChange: page => {
              },
              pageSize: 10,
            }}
            dataSource={listData}
            footer={
              <div>
                <b>ant design</b> footer part
              </div>
            }
            renderItem={item => (
              <List.Item
                key={item.key}
                actions={[
                  <Space key="space">
                    <Button
                      key="detail"
                      type="primary"
                      onClick={() => this.onShowDetail(item.key)}
                    >
                      Detail
                    </Button>,
                    <Button
                      type="primary"
                      key="read"
                      onClick={() => this.onShowDetail()}
                    >
                      Read
                    </Button>
                  </Space>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={<IconText time="01-01-2022" owner="Ti???n ????o" />}
                />
                {this.state.current == item.key ? item.content : ""}
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Read notification
            </span>
          }
          key="2"
        >
          <List
            itemLayout="vertical"
            size="small"
            pagination={{
              onChange: page => {
              },
              pageSize: 10,
            }}
            dataSource={listData}
            footer={
              <div>
                <b>ant design</b> footer part
              </div>
            }
            renderItem={item => (
              <List.Item
                key={item.key}
                actions={[
                  <Space key="space">
                    <Button
                      type="primary"
                      key="detail"
                      onClick={() => this.onShowDetail(item.key)}
                    >
                      Detail
                    </Button>,
                    <Button
                      type="primary"
                      key="read"
                      onClick={() => this.onShowDetail()}
                    >
                      Read
                    </Button>
                  </Space>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={<IconText time="01-01-2022" owner="Ti???n ????o" />}
                />
                {this.state.current == item.key ? item.content : ""}
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>

    )
  }
}


const arePropsEqual = (prevProps, nextProps) => {
  return prevProps === nextProps;
};

// Wrap component using `React.memo()` and pass `arePropsEqual`
export default memo(NotificationUI, arePropsEqual);
