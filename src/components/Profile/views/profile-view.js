import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Modal,
  Tag,
  Tooltip,
  Typography,
  Upload
} from "antd";
import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "./../../../components/Loader";
import action from "./../modules/action";

const { Title } = Typography;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class ProfileTab extends Component {
  state = {
    user: {
      username: "",
      googleId: "",
      loginMethod: "",
      rolename: "",
      phone: "",
    },
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: undefined,
    price: 0,
    autoCompleteResult: [],
    address: JSON.parse(this.props.data.address || JSON.stringify({})),
    addressByDelivery: {}
  };
  formRef = React.createRef();

  componentDidMount() {
    this.props.getProfile();
    let storedUser = JSON.parse(localStorage.getItem("user"));
    this.setState({
      user: storedUser,
    });

    axios({
      url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
      method: 'GET',
      headers: {
        token: "73457c0b-d0f5-11ec-ac32-0e0f5adc015a"
      }
    }).then(rs => {
      rs.data.data = rs.data.data.map(element => {
        return {
          value: element.ProvinceName,
          ...element
        }
      })
      this.setState({
        addressByDelivery: {
          province: rs.data.data
        }
      })
    })
  }

  handleCancel = () => {
    this.props.closeModal();
  };

  onFinish = (values) => {
    values.avatar =
      this.state.fileList?.length === 0 && this.props.record
        ? JSON.parse(this.props.record?.avt)
        : this.state.fileList;
    this.setState({
      user: {
        phone: this.props.data.phone,
        avatar: values.avatar,
        name: values.name,
        email: values.email,
        address: this.state.address,
      },
    });
    this.props.updateProfile(this.state.user);
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

  handleChange = ({ fileList }) => {
    this.props.onChangeUpdateProfile();
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        file.name = file.response.fileName;
        file.thumbUrl = null;
      }
      return file;
    });

    this.setState({ fileList });
  };

  setProvince = (data, _) => {
    if (_) {
      this.setState({
        address: {
          ...this.state.address,
          province: {
            provinceId: _.ProvinceID,
            provinceName: _.ProvinceName
          }
        }
      })
      if (this.state.addressByDelivery.province) {
        axios({
          url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
          method: 'POST',
          headers: {
            token: "73457c0b-d0f5-11ec-ac32-0e0f5adc015a"
          },
          data: {
            province_id: parseInt(_.ProvinceID)
          }
        }).then(rs => {
          rs.data.data = rs.data.data.map(element => {
            return {
              value: element.DistrictName,
              ...element
            }
          })

          this.setState({
            addressByDelivery: {
              ...this.state.addressByDelivery,
              district: rs.data.data
            }
          })
        })
      }
    }
  }
  setDistrict = (data, _) => {
    if (_) {
      this.setState({
        address: {
          ...this.state.address,
          district: {
            districtId: _.DistrictID,
            districtName: _.DistrictName
          }
        }
      })
      if (this.state.addressByDelivery.district) {
        axios({
          url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
          method: 'POSt',
          headers: {
            token: "73457c0b-d0f5-11ec-ac32-0e0f5adc015a"
          },
          data: {
            district_id: parseInt(_.DistrictID)
          }
        }).then(rs => {
          rs.data.data = rs.data.data.map(element => {
            return {
              value: element.WardName,
              ...element
            }
          })

          this.setState({
            addressByDelivery: {
              ...this.state.addressByDelivery,
              ward: rs.data.data
            }
          })
        })
      }
    }
  }

  setWard = (data, _) => {
    if (_) {
      this.setState({
        address: {
          ...this.state.address,
          ward: {
            wardId: _.WardCode,
            wardName: _.WardName
          }
        }
      })
    }
  }

  setStreet = (data, _) => {
    this.setState({
      address: {
        ...this.state.address,
        street: {
          streetName: data.target.value
        }
      }
    })
  }


  render() {
    const { loading, changeProfileMessage } = this.props;
    if (loading) return <Loader />;

    const { data } = this.props;
    const { load, fileList = JSON.parse(data?.avt || "[]") } = this.state;
    const uploadButton = (
      <div>
        {load ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Title style={{ textAlign: "center", padding: "30px" }} level={3}>
          USER PROFILE
        </Title>
        <Title type="success" style={{ textAlign: "center", }} level={3}> {changeProfileMessage ? `${changeProfileMessage}` : ""}</Title>

        <Form
          {...formItemLayout}
          name="register"
          onFinish={this.onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Username"
            tooltip="Username can not be channged!"
          >
            <Tag color="green">{data.username ?? "Unavailable"}</Tag>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role name"
            tooltip="User's role in WSG System"
          >
            <Tooltip
              placement="topLeft"
              title="Suppliers are those who use the WSG System and website to process their business. Their main role is to cooperate with the WSG system to do business"
            >
              <Tag color="blue">{data.rolename ?? ""}</Tag>
            </Tooltip>
          </Form.Item>

          <Form.Item
            name="loggingMethod"
            label="Logging Method"
            tooltip="User's logging method in WSG System"
          >
            <Tooltip
              placement="topLeft"
              title="Logging by username / Logging by Google Mail"
            >
              <Tag color="red">
                {data.username ? "BY USERNAME" : "BY EMAIL"}
              </Tag>
            </Tooltip>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
          // tooltip="User's logging method in WSG System"
          >
            {/* <Tooltip
              placement="topLeft"
              title="Logging by username / Logging by Google Mail"
            > */}
            <Tag color="green">
              {this.state.user.phone}
            </Tag>
            {/* </Tooltip> */}
          </Form.Item>

          <Form.Item
            name="name"
            label="Fullname"
            tooltip="What is your fullname?"
            rules={[
              {
                required: true,
                message: "Please input your fullname!",
                whitespace: true,
              },
              {
                max: 50,
                message: "Length: 1-50 characters",
                whitespace: true,
              }
            ]}
            initialValue={data.name}
          >
            <Input onChange={this.props.onChangeUpdateProfile} />
          </Form.Item>

          <Form.Item name="avatar" label="Avatar">
            <>
              <Upload
                //JSON.parse(data?.avt || "[]")
                name="file"
                action="/files/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                style={{ width: "60vh" }}
              >
                {fileList.length >= 1 ? null : uploadButton}
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

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
            initialValue={data.email}
          >
            {data.username ?
              <Input onChange={this.props.onChangeUpdateProfile} />
              :
              <Tooltip
                placement="topLeft"
                title="User logins by Gmail can not change email"
              >
                <Input onChange={this.props.onChangeUpdateProfile} disabled="false" />
              </Tooltip>
            }
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            tooltip="What is your address?"
          // rules={[{
          //     required: true,
          //     message: 'Please input your address!',
          //     whitespace: true
          // }]}
          >
            <Input.Group >
              <Form.Item
                name="province"
                label="Province"
                // noStyle
                rules={[{
                  required: true,
                  message: 'Province is required'
                }]}
                initialValue={JSON.parse(data.address || JSON.stringify({ province: {} })).province?.provinceName}
              >
                <AutoComplete
                  style={{ width: 200, float: "right" }}
                  options={this.state.addressByDelivery.province || []}
                  placeholder=""
                  value={JSON.parse(data.address || JSON.stringify({ province: {} })).province?.provinceName || ""}
                  onChange={this.setProvince}
                />
              </Form.Item>

              <Form.Item
                name="district"
                label="District"
                rules={[{
                  required: true,
                  message: 'Province is required'
                }]}
                initialValue={JSON.parse(data.address || JSON.stringify({ district: {} })).district?.districtName}
              >
                <AutoComplete
                  style={{ width: 200, float: "right" }}
                  options={this.state.addressByDelivery.district || []}
                  placeholder=""
                  value={JSON.parse(data.address || JSON.stringify({ district: {} })).district?.districtName}
                  onChange={this.setDistrict}
                />
              </Form.Item>

              <Form.Item
                name="ward"
                label="Ward"
                rules={[{
                  required: true,
                  message: 'Province is required'
                }]}
                initialValue={JSON.parse(data.address || JSON.stringify({ ward: {} })).ward?.wardName}
              >
                <AutoComplete
                  style={{ width: 200, float: "right" }}
                  options={this.state.addressByDelivery.ward || []}
                  placeholder=""
                  value={JSON.parse(data.address || JSON.stringify({ ward: {} })).ward?.wardName}
                  onChange={this.setWard}
                />
              </Form.Item>

              <Form.Item
                name="street"
                label="Street"
                rules={[{
                  required: true,
                  message: 'Province is required'
                }]}
                initialValue={JSON.parse(data.address || JSON.stringify({ street: {} })).street?.streetName}
              >
                <Input
                  style={{ width: 200, float: "right" }}
                  onChange={this.setStreet}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item >

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.profileReducer.loading,
    data: state.profileReducer.data,
    error: state.profileReducer.err,
    changeProfileMessage: state.profileReducer.phoneValidation.changeProfileMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: async () => {
      await dispatch(action.getProfile());
    },

    checkPhoneNumber: async (phone) => {
      await dispatch(action.checkPhoneNumber(phone));
    },

    updateProfile: async (profile) => {
      await dispatch(action.updateProfile(profile));
      await dispatch(action.getProfile());
    },

    onChangeUpdateProfile: async () => {
      await dispatch(action.onChangeUpdateProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileTab);
