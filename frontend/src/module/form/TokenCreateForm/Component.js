import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {
    Form,
    Input,
    Button,
    message,
    InputNumber,
    Select
} from 'antd'

import {upload_file} from "@/util";
import I18N from '@/I18N'
import './style.scss'

import {TASK_CATEGORY, TASK_TYPE, TASK_STATUS} from '@/constant'

const FormItem = Form.Item
const TextArea = Input.TextArea

class C extends BaseComponent {
    async componentDidMount() {

    }

    handleSubmit (e) {
        e.preventDefault()
        this.props.form.validateFields( async (err, formData) => {
            if (!err) {
                if (this.props.token._id) {
                    const rs = await this.props.update({
                        chain: formData.chain,
                        name: formData.name,
                        address: formData.address,
                        symbol: formData.symbol,
                        decimal: formData.decimal,
                        total_supply: formData.total_supply,
                        id: this.props.token._id
                    })
                    if (rs) {
                        message.success('Update token success!')
                        this.props.history.push('/admin/tokens')
                    }
                } else {
                    const rs = await this.props.create(formData)
                    if (rs) {
                        message.success('Create token success!')
                        this.props.history.push('/admin/tokens')
                    }
                }
            }
        })
    }

    getInputProps () {
        const token = this.props.token
        const {getFieldDecorator} = this.props.form

        const chain_fn = getFieldDecorator('chain', {
            rules: [{required: true, message: 'Required field'}],
            initialValue: token.chain && token.chain._id || ''
        })
        const chain_el = (
            <Select showSearch
                placeholder="Select chain"
                getPopupContainer={x => {
                    while (x && x.tagName.toLowerCase() !== 'form') {
                        x = x.parentElement;
                    }

                    return x;
                }}>
                {_.map(this.props.chains, chain => {
                    return <Select.Option key={chain._id} value={chain._id}>
                        {chain.name}
                    </Select.Option>
                })}
            </Select>
        )

        const name_fn = getFieldDecorator('name', {
            rules: [],
            initialValue: token.name || ''
        })
        const name_el = (
            <Input size="large" placeholder="Name"/>
        )

        const address_fn = getFieldDecorator('address', {
            rules: [{required: true, message: 'Required field'}],
            initialValue: token.address || ''
        })
        const address_el = (
            <Input size="large" placeholder="Address"/>
        )

        const symbol_fn = getFieldDecorator('symbol', {
            rules: [],
            initialValue: token.symbol || ''
        })
        const symbol_el = (
            <Input size="large" placeholder="Symbol"/>
        )

        const decimal_fn = getFieldDecorator('decimal', {
            rules: [],
            initialValue: token.decimal
        })
        const decimal_el = (
            <InputNumber style={{width: '200px'}} size="large" />
        )

        const total_supply_fn = getFieldDecorator('total_supply', {
            rules: [],
            initialValue: token.total_supply
        })
        const total_supply_el = (
            <InputNumber style={{width: '200px'}} size="large" />
        )

        return {
            chain: chain_fn(chain_el),
            name: name_fn(name_el),
            address: address_fn(address_el),
            symbol: symbol_fn(symbol_el),
            decimal: decimal_fn(decimal_el),
            total_supply: total_supply_fn(total_supply_el),
        }
    }

    getFormItemLayout() {
        return {
            colon: false,
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        }
    }

    ord_render () {
        const {getFieldDecorator} = this.props.form
        const p = this.getInputProps()
        const formItemLayout = this.getFormItemLayout()

        // TODO: description CKE Editor
        return (
            <div className="c_taskCreateFormContainer">
                <Form onSubmit={this.handleSubmit.bind(this)} className="d_userContactForm">
                    <div>
                        <FormItem label='Chain' {...formItemLayout}>
                            {p.chain}
                        </FormItem>
                        <FormItem label='Address' {...formItemLayout}>
                            {p.address}
                        </FormItem>
                        <FormItem label='Name' {...formItemLayout}>
                            {p.name}
                        </FormItem>
                        <FormItem label='Symbol' {...formItemLayout}>
                            {p.symbol}
                        </FormItem>
                        <FormItem label='Decimal' {...formItemLayout}>
                            {p.decimal}
                        </FormItem>
                        <FormItem label='Total supply' {...formItemLayout}>
                            {p.total_supply}
                        </FormItem>

                        <FormItem {...formItemLayout}>
                            <Button loading={this.props.loading} type="primary" htmlType="submit" className="d_btn">
                                {this.props.token._id ? 'Save' : 'Create'}
                            </Button>
                        </FormItem>
                    </div>
                </Form>
            </div>
        )
    }

}
export default Form.create()(C)
