import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Notification} from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import {RECAPTCHA_KEY} from '@/config/constant';
import I18N from '@/I18N'

import './style.scss'

const FormItem = Form.Item

/**
 * We may require a username retrieval process and we should hide it in the future
 */
class C extends BaseComponent {

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (values.password !== values.cpassword) {
                    Notification.error({
                        message: 'incorrect'
                    })
                    return false
                }
                console.log('Received values of form: ', values)
                try {
                    await this.props.changePassword(values.password)
                    Notification.success({
                        message: 'updated password'
                    })
                } catch(e) {
                    Notification.error({
                        message: 'something wrong'
                    })
                    this.props.form.resetFields()
                }
            }
        })
    }

    getInputProps() {
        const {getFieldDecorator} = this.props.form
        /* const email_fn = getFieldDecorator('email', {
            rules: [{required: true, message: I18N.get('forgot.form.label_email')}],
            initialValue: ''
        })
        const email_el = (
            <Input size="large"
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder={I18N.get('forgot.form.email')}/>
        ) */

        const pwd_fn = getFieldDecorator('password', {
            rules: [{required: true, message: 'Password required'}]
        })
        const pwd_el = (
            <Input size="large"
                prefix={<Icon type="key" />}
                type="password" placeholder={'Password'}/>
        )

        const cpwd_fn = getFieldDecorator('cpassword', {
            rules: [{required: true, message: 'comfirm password required'}]
        })
        const cpwd_el = (
            <Input size="large"
                prefix={<Icon type="key" />}
                type="password" placeholder={'Comfirm Password'}/>
        )

        return {
            pwd: pwd_fn(pwd_el),
            cpwd: cpwd_fn(cpwd_el),
        }
    }

    ord_render() {
        const {getFieldDecorator} = this.props.form
        const p = this.getInputProps()
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="c_loginForm">
                <FormItem>
                    {p.pwd}
                </FormItem>
                <FormItem>
                    {p.cpwd}
                </FormItem>
                <FormItem>
                    <Button loading={this.props.loading} htmlType="submit" className="btn-game">
                        Change Password
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(C)
