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
import Axios from "axios";
import axios from 'axios';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            otpResult: null,
            phoneNumber: "",
            otp: null,
            verify: null,
            otpSuccess: false,
            username: "",
            password: "",
            firstName: "",
            email: "",
            roleName: "Supplier",
            address: ""
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
        if (this.state.phoneNumber !== "") {

            Axios({
                url: `/users/${this.state.phoneNumber}`,
                method: "GET",
                withCredentials: true,
            }).then(result => {
                if (result.data.data.length > 0) {
                    return alert('This phone number is existed!')
                } else {
                    let verify = this.state.verify || new RecaptchaVerifier('recaptcha-container', {
                        'size': 'invisible'
                    }, auth);
                    this.setState({
                        verify: verify
                    })
                    signInWithPhoneNumber(auth, this.state.phoneNumber, verify).then((result) => {
                        this.setState({
                            otpResult: result
                        })
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }).catch(error => {
                console.log(error)
            })

        }
    }

    setPhoneNumber = (data) => {
        this.setState({
            phoneNumber: `+84${data.target.value}`
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


    register = () => {
        Axios({
            url: `/users/register`,
            method: "POST",
            withCredentials: true,
            data: {
                username: this.state.username,
                password: this.state.password,
                firstName: this.state.firstName,
                email: this.state.email,
                address: this.state.address,
                phone: this.state.phoneNumber,
                roleName: this.state.roleName,

            }
        }).then(result => {
            if (result.status === 200 || result.status === 204) {
                return window.location.replace('/login')
            }
        }).catch((error) => {
            if (error) {
                return alert('Registration Failed')
            }
        })

    }

    setUsername = (data) => {
        this.setState({
            username: data.target.value
        })
    }

    setPassword = (data) => {
        this.setState({
            password: data.target.value
        })
    }

    setFirstName = (data) => {
        this.setState({
            firstName: data.target.value
        })
    }

    setEmail = (data) => {
        this.setState({
            email: data.target.value
        })
    }

    setAddress = (data) => {
        this.setState({
            address: data.target.value
        })
    }



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
                    <p className="create_account_title">Do not have an account yet?
                        <a href="/login" className="create_account_navigation">Login</a>
                    </p>
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
                                                pattern: /([3|5|7|8|9])+([0-9]{8})\b/,
                                                message: "Phone number is not valid"
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || value.length !== 9) {
                                                        return Promise.reject(new Error('Phone number is not valid'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),]}>
                                            <Input addonBefore="+84" style={{ width: '250px' }} placeholder="Phone Number" onChange={this.setPhoneNumber} />
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
                                    id="registrationForm"
                                    name="registrationForm"
                                    onFinish={this.register}
                                    initialValues={{
                                        residence: ['zhejiang', 'hangzhou', 'xihu'],
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
                                        <Input onChange={this.setUsername} />

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
                                        <Input.Password onChange={this.setPassword} placeholder="1-50 characters" />
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
                                        label="Name"
                                        tooltip="What is your name?"
                                        rules={[{ required: true, message: 'Please input your name!', whitespace: true }]}
                                    >
                                        <Input onChange={this.setFirstName} />
                                    </Form.Item>

                                    <Form.Item
                                        name="address"
                                        label="Address"
                                        tooltip="What is your address?"
                                        rules={[{ required: true, message: 'Please input your address!', whitespace: true }]}
                                    >
                                        <Input onChange={this.setAddress} />
                                    </Form.Item >

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
                                        <Input onChange={this.setEmail} />
                                    </Form.Item>
                                </Form>
                            </div>)}
                            {this.state.currentStep === 2 && (<div className="steps-content">3</div>)}

                            <div className="steps-action">

                                {this.state.currentStep === 0 && <Button type="primary" onClick={this.next} disabled={!this.state.otpSuccess}>
                                    Next
                                </Button>}
                                {this.state.currentStep === 1 && <Button type="primary" form='registrationForm' htmlType='submit' disabled={!this.state.otpSuccess}>
                                    Submit
                                </Button>}

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
