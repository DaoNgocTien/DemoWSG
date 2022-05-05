import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button, Form, Input, Space, Tag, Tooltip, Steps
} from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from '../../../services/firebase';
import action from "../modules/action";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            otpResult: null,
            phoneNumber: "",
            otp: null,
            verify: null,
            otpSuccess: false
        };
    }

    formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };

    tailFormItemLayout = {
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

    sendOtpPhone = () => {
        let verify = this.state.verify || new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        }, auth);
        this.setState({
            verify: verify
        })
        console.log(this.state.phoneNumber)
        if (this.state.phoneNumber !== "") {
            signInWithPhoneNumber(auth, this.state.phoneNumber, verify).then((result) => {
                this.setState({
                    otpResult: result
                })
            }).catch((err) => {
                alert(err);
            });
        }
    }

    setPhoneNumber = (data) => {
        console.log(data.target.value)
        this.setState({
            phoneNumber: `+${data.target.value}`
        })
    }

    setOtp = (data) => {
        this.setState({
            otp: data.target.value
        })
    }

    confirmOtp = () => {
        this.state.otpResult.confirm(this.state.otp).then((result) => {
            this.setState({
                otpSuccess: true
            });
            return alert("OTP Success");
        }).catch((err) => {
            console.log(err)
            return alert("Incorrect code");
        })
    }

    next = () => {
        this.setState({
            currentStep: this.state.currentStep + 1
        });
    };


    prev = () => {
        this.setState({
            currentStep: (this.state.currentStep - 1) > 0 ? this.state.currentStep - 1 : 0
        });
    };

    steps = [
        {
            title: 'Validation Phone',
            content: 'First-content',
        },
        {
            title: 'Register Infomation',
            content: 'Second-content',
        },
    ];

    render() {
        return (
            <div className="main_form_body">
                <div className="main_form_body">
                    <h2>Registration</h2>
                    <br />
                    <div id="recaptcha-container">
                    </div>
                    <div className="form__wrapper">
                        <div className="register__form__container">
                            <Steps current={this.state.currentStep} progressDot>
                                {this.steps.map(item => (
                                    <Steps.Step key={item.title} title={item.title} />
                                ))}
                            </Steps>
                            {this.state.currentStep === 0 && (<div className="steps-content">
                                <Form name="set_phone" onFinish={this.sendOtpPhone}>
                                    <Input.Group compact>
                                        <Form.Item
                                            name="phone"
                                            rules={[{
                                                type: "regexp",
                                                pattern: /(84[3|5|7|8|9])+([0-9]{8})\b/,
                                                message: "Phone number is not valid"
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || value.length !== 11) {
                                                        return Promise.reject(new Error('Phone number is not valid'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),]}>
                                            <Input style={{ width: '250px' }} placeholder="Phone Number" onChange={this.setPhoneNumber} />
                                        </Form.Item>
                                        <Button type="primary" htmlType='submit' >
                                            Send OTP
                                        </Button>
                                    </Input.Group>

                                    <Input.Group compact>
                                        <Input style={{ width: '230px' }} placeholder="OTP" onChange={this.setOtp} />
                                        <Button type="primary" onClick={this.confirmOtp} >
                                            Confirm OTP
                                        </Button>
                                    </Input.Group>

                                </Form>
                            </div>)}
                            {this.state.currentStep === 1 && (<div className="steps-content">
                                <Form
                                    {...this.formItemLayout}
                                    name="registrationForm"
                                    onFinish={this.onFinish}
                                    initialValues={{
                                        residence: ['zhejiang', 'hangzhou', 'xihu'],
                                        prefix: '+084',
                                    }}
                                    scrollToFirstError
                                >

                                    <Form.Item
                                        name="username"
                                        label="Username"
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (value.length > 0 && value.length <= 50) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(new Error('Username is required, length is 1-50 characters!'));
                                                },
                                            }),
                                        ]}
                                        hasFeedback
                                        required
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {

                                                    if (value.length > 0 && value.length <= 50) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(new Error('Password is required, length is 1-50 characters!'));
                                                },
                                            }),
                                        ]}
                                        hasFeedback
                                        required
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

                                    >
                                        <Input.Password placeholder="1-50 characters" />
                                    </Form.Item>

                                    <Form.Item
                                        name="firstname"
                                        label="Firstname"
                                        tooltip="What is your firstname?"
                                        rules={[{ required: true, message: 'Please input your firstname!', whitespace: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="lastname"
                                        label="Lastname"
                                        tooltip="What is your lastname?"
                                        rules={[{ required: true, message: 'Please input your lastname!', whitespace: true }]}

                                    >
                                        <Input />
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
                                    >
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </div>)}
                            {this.state.currentStep === 2 && (<div className="steps-content">3</div>)}

                            <div className="steps-action">
                                <Button style={{ margin: '0 8px' }} onClick={this.prev}>
                                    Previous
                                </Button>
                                <Button type="primary" onClick={this.next}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    // return {
    //     loading: state.authReducer.loading,
    //     error: state.authReducer.err,
    //     profile: state.authReducer.profile,
    //     phone: state.authReducer.phone,
    //     OTP: state.authReducer.OTP,
    //     message: state.authReducer.message,
    // };
};

const mapDispatchToProps = (dispatch) => {
    // return {
    //     login: (user, history) => {
    //         dispatch(action.actLoginApi(user, history));
    //     },
    //     googleOAuth2: (googleResponse) => {
    //         dispatch(action.googleOAuth2(googleResponse));
    //     },

    //     phoneNumberValidation: async phone => {
    //         await dispatch(action.phoneNumberValidation(phone));
    //     },

    //     checkPhoneNumber: async phone => {
    //         await dispatch(action.checkPhoneNumber(phone));
    //     },

    //     registration: async (data, history) => {
    //         await dispatch(action.registration(data));
    //     }
    // };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
