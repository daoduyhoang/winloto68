import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Checkbox, message, Divider, Collapse, InputNumber} from 'antd'
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
            if (!err) {
                this.props.withdraw({
                    to: values.to,
                    amount: Number(values.amount) * `1e${this.props.balance.decimal}`,
                    chain: this.props.balance._id
                }).then(() => {
                    if (_.isFunction(this.props.onHideModal)) {
                        this.props.onHideModal()
                    }
                })
            }
        })
    }

    getInputProps() {
        const {getFieldDecorator} = this.props.form
        const wallet_fn = getFieldDecorator('to', {
            rules: [{required: true, message: 'To wallet address required'}],
            initialValue: ''
        })
        const wallet_el = (
            <Input size="large"
                placeholder={'To wallet address'}/>
        )

        const amount_fn = getFieldDecorator('amount', {
            rules: [{required: true, message: 'Amout required'}],
            initialValue: ''
        })
        const amount_el = (
            <InputNumber placeholder="Amout" size="large" />
        )

        return {
            wallet: wallet_fn(wallet_el),
            amount: amount_fn(amount_el),
        }
    }

    togglePersist() {
        this.setState({persist: !this.state.persist})
    }

    forgotPassword() {
        this.props.toggleRegisterLoginModal(false)
        this.props.history.push('/forgot-password')
    }

    ord_render() {
        const p = this.getInputProps()
        return (
            <div className="">
                <h3 className="title">{this.props.balance.name} {Number(this.props.balance.value) / `1e${this.props.balance.decimal}`} {this.props.balance.symbol}</h3>
                <Form onSubmit={this.handleSubmit.bind(this)} className="c_loginForm">
                    <FormItem>
                        {p.wallet}
                    </FormItem>
                    <FormItem>
                        {p.amount}
                    </FormItem>
                    <FormItem>
                        <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn_join">
                            Withdraw
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(C)
