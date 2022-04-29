import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button, Col, DatePicker, Form, Input, InputNumber, Layout, Row, Select, Space, Tag, Tooltip, Typography
} from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import action from "../modules/action";
import { Link, Redirect, Route } from "react-router-dom";


const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const residences = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];
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

//  prototype
const propsProTypes = {
    closeModal: PropTypes.func,
    createCampaign: PropTypes.func,
    openModal: PropTypes.bool,
    productList: PropTypes.array,
};

//  default props
const propsDefault = {
    closeModal: () => { },
    createCampaign: () => { },
    openModal: false,
    productList: [],
};

class Registration extends Component {
    static propTypes = propsProTypes;
    static defaultProps = propsDefault;
    state = {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
        price: 0,
        autoCompleteResult: [],
        checkedProfile: {
            value: "",
            validateStatus: "",
            errorMsg: null,
        },
        phoneAvailable: false,
        OTPMessage: null,
        phone: ""
    };
    formRef = React.createRef();
    phoneRef = React.createRef();
    OTPRef = React.createRef();

    componentDidMount() {
    }

    onFinish = (values) => {
        //  //console.log('Received values of form: ', values);
        let record = {
            username: values.username,
            password: values.password,
            firstName: values.firstname,
            lastName: values.lastname,
            phone: values.phone,
            email: values.email,
            roleName: "Supplier"
        };
        this.props.registration(record, this.props.history);
    };

    onCheckPhoneNumber = () => {
        const value = this.phoneRef.current.value;
        //  //console.log(value);
        this.props.checkPhoneNumber(this.phoneRef.current.value);
        let profile = this.props.profile;
        return this.setState({
            checkedProfile: {
                validateStatus: profile === null ? "success" : "error",
                errorMsg: profile === null ? null : "Phone number exist",
            }
        });

    }

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
        // fileList = fileList.slice(-2);
        // //console.log(fileList);
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

    checkOTP = e => {
        const value = e.target.value;
        if (value === this.props.OTP && this.phoneRef.current.value === this.props.phone) {
            this.setState({
                phoneAvailable: true,
                OTPMessage: null,
            });
        }
        else {
            this.setState({
                phoneAvailable: false,
                OTPMessage: "OTP token is not correct!",
            });
        }
    }

    changePhoneNumber = (e) => {
        const value = this.phoneRef.current.value;
        //  //console.log(value);
        // //console.log(this.OTPRef.current.value);
        this.props.phoneNumberValidation(value);

        if (this.OTPRef.current.value === this.props.OTP && value === this.props.phone) {
            this.setState({
                phoneAvailable: true,
                OTPMessage: null,
            });
        }
        else {
            this.setState({
                phoneAvailable: false,
                OTPMessage: "OTP token is not correct!",
            });
        }
    }
    onChangePhoneNumber = e => {
        const phone = e.target.value;
        if (phone.length > 11 || phone.length < 10) {
            return this.props.checkingPhoneNumber("Phone is required, 10-11 numbers!!");
        }
        this.setState({
            phone: e.target.value,
            phoneMessage: "",
        })
        this.props.checkingPhoneNumber(null);
    }
    render() {
        const { load, imageUrl, checkedProfile, OTPMessage, phoneAvailable } = this.state;
        const uploadButton = (
            <div>
                {load ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        const { loading, profile, phone, OTP, message } = this.props;
        //  //console.log(this.props);
        // if (loading) return <Loader />;
        return (
            <>
                <div className="main_form_body">
                    <div className="form__wrapper">
                        <div className="registration_form__container">
                            <h2 style={{ textAlign: "center" }}>REGISTRATION</h2>
                            <Form
                                {...formItemLayout}
                                // form={form}
                                name="registrationForm"
                                onFinish={this.onFinish}
                                initialValues={{
                                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                                    prefix: '+084',
                                }}
                                scrollToFirstError
                            >



                                {/* <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" onClick={this.onCheckPhoneNumber}>
                                        Change
                                    </Button>

                                </Form.Item>

                                <Form.Item {...tailFormItemLayout}>


                                </Form.Item> */}
                                {/* <Form.Item label="Phone Number">
                                    <Row >
                                        <Col flex={4}>
                                            <Form.Item
                                                name="phone"
                                                // initialValue={phone}
                                                validateStatus={message === null ? "success" : "error"}
                                                help={message === null ? "We make sure phone number is available!" : message}
                                            >
                                                <InputNumber
                                                    // type="number"
                                                    addonBefore="+84"
                                                    disabled={phoneAvailable}
                                                    onChange={(e) => this.changePhoneNumber(e)}
                                                    ref={this.phoneRef}
                                                    style={{ width: "60vh" }}
                                                    placeholder="9-11 characters"
                                                />

                                            </Form.Item>
                                        </Col>
                                        <Col flex={2}>
                                            <Button type="primary" onClick={this.onCheckPhoneNumber} disabled={phoneAvailable}>
                                                {phone !== null && OTP !== null ? "Re-sent OTP" : "Send OTP"}
                                            </Button>
                                        </Col>
                                    </Row>

                                </Form.Item>

                                <Form.Item
                                    label="OTP"
                                    validateStatus={OTPMessage === null ? "success" : "error"}
                                    help={OTPMessage === null ? "Correct OTP Token will let you fill the rest of registration form!" : OTPMessage}
                                    disabled={phone === null || OTP === null}

                                >
                                    <Input
                                        onChange={e => this.checkOTP(e)}
                                        ref={this.OTPRef}
                                        disable={phoneAvailable}
                                    />

                                </Form.Item> */}
                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    hasFeedback
                                    tooltip={"Phone number is unique!"}
                                    rules={[
                                        // {
                                        //   required: true,
                                        //   message: 'Please enter your new phone',
                                        // },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!Number(value) < 0) {
                                                    return Promise.reject(new Error(`Number only`));
                                                }
                                                if ((value + "").length > 11 || (value + "").length < 10) {
                                                    return Promise.reject(new Error(`Phone number is between 10-11 characters`));
                                                }
                                                // if (getFieldValue("phoneMessage").length > 0) {
                                                //   return Promise.reject(new Error(`${getFieldValue("phoneMessage")}`));
                                                // }
                                                // //console.log(phoneValidation);
                                                //   if (value && !checkPhoneMessage) {
                                                return Promise.resolve();
                                                //   }
                                                //   return Promise.reject(new Error(`${checkPhoneMessage}`));

                                            },
                                        }),
                                        // {
                                        //   pattern: /[0-9]{10,11}/,
                                        //   message: 'Phone number is between 10-12 characters',
                                        // }
                                    ]}

                                // initialValue={this.state.phone}
                                // validateStatus={checkPhoneMessage == null ? "success" : "error"}
                                // help={checkPhoneMessage == null ? "We make sure phone number is available!" : checkPhoneMessage}
                                >
                                    <Input
                                        type="number"
                                        addonBefore="+84"
                                        // disabled={data.phoneOTP?? "false"}
                                        // onChange={(e) => this.onChangePhoneNumber(e)}
                                        ref={this.phoneRef}
                                        // addonBefore={this.prefixSelector}
                                        style={{ width: "100%" }}
                                        placeholder="10-11 characters"
                                    />

                                </Form.Item>
                                {this.props.error}

                                <Form.Item
                                    name="username"
                                    label="Username"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {

                                                //   if (listName.includes(value)) {
                                                //     return Promise.reject(new Error('Product Name exists!'));
                                                //   }
                                                if (value.length > 0 && value.length <= 50) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error('Username is required, length is 1-50 characters!'));
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {

                                                //   if (listName.includes(value)) {
                                                //     return Promise.reject(new Error('Product Name exists!'));
                                                //   }
                                                if (value.length > 0 && value.length <= 50) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error('Password is required, length is 1-50 characters!'));
                                            },
                                        }),
                                    ]}

                                    hasFeedback
                                    disabled={!phoneAvailable}

                                >
                                    <Input.Password placeholder="1-50 characters" />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                    disabled={!phoneAvailable}

                                >
                                    <Input.Password placeholder="1-50 characters" />
                                </Form.Item>

                                <Form.Item
                                    name="firstname"
                                    label="Firstname"
                                    tooltip="What is your firstname?"
                                    rules={[{ required: true, message: 'Please input your firstname!', whitespace: true }]}
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="lastname"
                                    label="Lastname"
                                    tooltip="What is your lastname?"
                                    rules={[{ required: true, message: 'Please input your lastname!', whitespace: true }]}
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item
                                    name="role"
                                    label="Role"
                                    tooltip="User's role in WSG System"
                                    disabled={!phoneAvailable}

                                >
                                    <Tooltip placement="topLeft" title="Suppliers are those who use the WSG System and website to process their business. Their main role is to cooperate with the WSG system to do business">
                                        <Tag color="blue">Supplier</Tag>
                                    </Tooltip>

                                </Form.Item>

                                <Form.Item
                                    name="loggingMethod"
                                    label="Logging method"
                                    tooltip="User's logging method in WSG System"
                                    disabled={!phoneAvailable}

                                >
                                    <Tooltip placement="topLeft" title="Logging by username / Logging by Google Mail">
                                        <Tag color="red">Username and password</Tag>
                                    </Tooltip>

                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="E-mail"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: 'Please input your E-mail!',
                                        },
                                    ]}
                                    disabled={!phoneAvailable}

                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item {...tailFormItemLayout} disabled={!phoneAvailable}
                                >
                                    <Space>
                                        <Button htmlType="submit">
                                            <Link
                                                className="LinkDecorations"
                                                to={"/"}
                                            >
                                                Back
                                            </Link>
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            Register
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </>
        );

    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.authReducer.loading,
        error: state.authReducer.err,
        profile: state.authReducer.profile,
        phone: state.authReducer.phone,
        OTP: state.authReducer.OTP,
        message: state.authReducer.message,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user, history) => {
            dispatch(action.actLoginApi(user, history));
        },
        googleOAuth2: (googleResponse) => {
            dispatch(action.googleOAuth2(googleResponse));
        },

        phoneNumberValidation: async phone => {
            await dispatch(action.phoneNumberValidation(phone));
        },

        checkPhoneNumber: async phone => {
            await dispatch(action.checkPhoneNumber(phone));
        },

        registration: async (data, history) => {
            await dispatch(action.registration(data));
            // await dispatch(action.actLoginApi({ username: data.username, password: data.password }, history));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
