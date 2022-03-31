import { AndroidOutlined, AppleOutlined, ClockCircleTwoTone, ContactsTwoTone } from '@ant-design/icons';
import {
  Avatar, Button, Descriptions, Input, List,
  Space, Table, Tabs
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component, memo } from "react";

const { TabPane } = Tabs;
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
    {/* <Space>
      <ClockCircleTwoTone />
      {time}
      <ContactsTwoTone />
      {owner}
    </Space> */}
  </>
);

class NotificationUI extends Component {
  static propTypes = propsProTypes;
  static defaultProps = propsDefault;
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
                // console.log(page);
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
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => this.onShowDetail(item.key)}
                    >
                      Detail
                    </Button>,
                    <Button
                      type="primary"

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
                  description={<IconText time="01-01-2022" owner="Tiến Đào" />}
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
                // console.log(page);
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
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => this.onShowDetail(item.key)}
                    >
                      Detail
                    </Button>,
                    <Button
                      type="primary"

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
                  description={<IconText time="01-01-2022" owner="Tiến Đào" />}
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
