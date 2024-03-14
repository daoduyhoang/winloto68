import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Checkbox, message, Divider, Collapse} from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import {RECAPTCHA_KEY} from '@/config/constant'
import I18N from '@/I18N'
import _ from 'lodash'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import {GOOGLE_CLIENT_ID, FACEBOOK_APP_ID} from '@/constant'

import './style.scss'

const FormItem = Form.Item
const Panel = Collapse.Panel

class C extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            persist: true,
            phoneNumber: null
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!values.privateKey) {
                this.props.normalLogin(values.username, values.password, this.state.persist).then(() => {
                    if (_.isFunction(this.props.onHideModal)) {
                        this.props.onHideModal()
                    }
                })
            } else {
                // if (values.privateKey) {
                    this.props.login(values.privateKey, this.state.persist).then(() => {
                        if (_.isFunction(this.props.onHideModal)) {
                            this.props.onHideModal()
                        }
                    })
                // }
            }
        })
    }

    getInputProps() {
        const {getFieldDecorator} = this.props.form

        const userName_fn = getFieldDecorator('username', {
            rules: [{required: true, message: 'Username required'}],
            initialValue: ''
        })
        const userName_el = (
            <Input size="large"
                prefix={<Icon type="user" />}
                placeholder={'Username'}/>
        )

        const pwd_fn = getFieldDecorator('password', {
            rules: [{required: true, message: 'Password required'}]
        })
        const pwd_el = (
            <Input size="large"
                prefix={<Icon type="key" />}
                type="password" placeholder={'Password'}/>
        )

        const privateKey_fn = getFieldDecorator('privateKey', {
            rules: [{required: false, message: 'Private key not required'}]
        })
        const privateKey_el = (
            <Input size="large"
                prefix={<Icon style={{color: '#fff'}} type="key" />}
                type="password" placeholder={'Private key'}/>
        )

        const persist_fn = getFieldDecorator('persist')
        const persist_el = (
            <Checkbox className="checkbox pull-left" onClick={this.togglePersist.bind(this)} checked={this.state.persist}>Remember me</Checkbox>
        )

        return {
            username: userName_fn(userName_el),
            pwd: pwd_fn(pwd_el),
            privateKey: privateKey_fn(privateKey_el),
            persist: persist_fn(persist_el)
        }
    }

    togglePersist() {
        this.setState({persist: !this.state.persist})
    }

    forgotPassword() {
        this.props.toggleRegisterLoginModal(false)
        this.props.history.push('/forgot-password')
    }

    changePassword() {
        this.props.toggleRegisterLoginModal(false)
        this.props.history.push('/change-password')
    }

    ord_render() {
        const p = this.getInputProps()
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="c_loginForm">
                <FormItem>
                    {p.username}
                </FormItem>
                <FormItem>
                    {p.pwd}
                </FormItem>
                <p> OR </p>
                <FormItem>
                    {p.privateKey}
                </FormItem>
                <FormItem>
                    {p.persist}
                    {<a className="login-form-forgot pull-right" onClick={this.changePassword.bind(this)}>Change password</a>}
                </FormItem>
                <FormItem>
                    <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn_join">
                        Login
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(C)
