import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Checkbox, message, Select, Divider, Collapse} from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    RECAPTCHA_KEY,
    MIN_LENGTH_PASSWORD
} from '@/config/constant'
import config from '@/config'
import I18N from '@/I18N'
import _ from 'lodash'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import { CSVLink, CSVDownload } from "react-csv"
import {GOOGLE_CLIENT_ID, FACEBOOK_APP_ID} from '@/constant'
import URI from 'urijs'

import './style.scss'

const FormItem = Form.Item

class C extends BaseComponent {

    ord_states() {
        const params = new URI(this.props.location.search || '').search(true)

        return {
            requestedCode: null,
            ref: params.ref || '',
            email: ''
        }
    }

    handleSubmit(e) {
        e.preventDefault()

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (this.props.isLogin) {
                    this.props.toggleRegisterLoginModal(false)
                } else {
                    this.props.autoCreateAccount({ref: this.state.ref, username: this.state.username})
                }
            }
        })
    }

    checkEmail(rule, value, callback, source, options) {
        const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if (value && emailRegex.test(value)) {
            this.props.checkEmail(value).then((isExist) => {
                if (isExist) {
                    callback(I18N.get('register.error.duplicate_email'))
                } else {
                    callback()
                }
            })
        } else {
            callback()
        }
    }

    onChangeEmail(data) {
        this.setState({email: data.target.value})
    }

    onUsernameChange(data) {
        this.setState({username: data.target.value})
    }

    backupPrivateKey() {
        if (!this.state.email) {
            return message.error('Please input your email!')
        }

        this.props.sendBackupKey({
            email: this.state.email,
            privateKey: this.props.privateKey,
        })
    }

    getInputProps() {
        const {getFieldDecorator} = this.props.form

        const email_fn = getFieldDecorator('email', {
            rules: [{
                type: 'email', message: I18N.get('register.error.email'),
            }]
        })
        const email_el = (
            <Input size="large"
                onChange={this.onChangeEmail.bind(this)}
                placeholder={I18N.get('register.form.email')}/>
        )

        return {
            email: email_fn(email_el),
        }
    }

    getForm() {
        if (this.props.isLogin) {
            const csvData = [
                ['Username'],
                [this.props.wallet],
                ['Private Key'],
                [this.props.privateKey],
            ]

            const p = this.getInputProps()
            return (
                <div>
                    <p className="register-successs-title">{I18N.get('register.code.title')}</p>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="d_registerForm">
                        <FormItem>
                            <p className="private-key">
                                {this.props.privateKey}
                            </p>
                        </FormItem>
                        <Divider>Backup</Divider>
                        <FormItem>
                            {p.email}
                        </FormItem>
                        <FormItem>
                            <Button loading={this.props.loading}
                                onClick={this.backupPrivateKey.bind(this)}
                                type="ebp">
                                Send mail
                            </Button>
                            <CSVLink data={csvData}>
                                <Button loading={this.props.loading} type="ebp">
                                    Download key
                                </Button>
                            </CSVLink>
                        </FormItem>
                        <FormItem>
                            <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn d_btn_join" onClick={this.handleSubmit.bind(this)}>
                                {I18N.get('register.success')}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            )
        } else {
            const p = this.getInputProps()
            return (
                <Form onSubmit={this.handleSubmit.bind(this)} className="d_registerForm">
                    <FormItem>
                        <h3>Please contract admin</h3>
                        {/* <Input size="large"
                            onChange={this.onUsernameChange.bind(this)}
                            placeholder={'Username'}/>
                        <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn_join" onClick={this.handleSubmit.bind(this)}>
                            Register
                        </Button> */}
                    </FormItem>
                </Form>
            )
        }
    }

    ord_render() {
        const form = this.getForm()

        return (
            <div className="c_registerContainer">
                {form}
            </div>
        )
    }
}

export default Form.create()(C)
