import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {
    Form,
    Input,
    Button,
    message

} from 'antd'

import {upload_file} from "@/util";
import I18N from '@/I18N'
import './style.scss'

import {TASK_CATEGORY, TASK_TYPE, TASK_STATUS} from '@/constant'

const FormItem = Form.Item
const TextArea = Input.TextArea

class C extends BaseComponent {

    handleSubmit (e) {
        e.preventDefault()
        this.props.form.validateFields( async (err, formData) => {
            if (!err) {
                if (this.props.chain._id) {
                    const rs = await this.props.update({
                        name: formData.name,
                        endpoint: formData.endpoint,
                        website: formData.website,
                        id: this.props.chain._id
                    })
                    if (rs) {
                        message.success('Update chain success!')
                        this.props.history.push('/admin/chains')
                    }
                } else {
                    const rs = await this.props.create(formData)
                    if (rs) {
                        message.success('Create chain success!')
                        this.props.history.push('/admin/chains')
                    }
                }
            }
        })
    }

    getInputProps () {
        const chain = this.props.chain

        const {getFieldDecorator} = this.props.form

        const name_fn = getFieldDecorator('name', {
            rules: [{required: true, message: 'Required field'}],
            initialValue: chain.name || ''
        })
        const name_el = (
            <Input size="large" placeholder="Name"/>
        )

        const endpoint_fn = getFieldDecorator('endpoint', {
            rules: [{required: true, message: 'Required field'}],
            initialValue: chain.endpoint || ''
        })
        const endpoint_el = (
            <Input size="large" placeholder="Endpoint"/>
        )

        const website_fn = getFieldDecorator('website', {
            rules: [],
            initialValue: chain.website || ''
        })
        const website_el = (
            <Input size="large" placeholder="Website URL"/>
        )

        return {
            name: name_fn(name_el),
            endpoint: endpoint_fn(endpoint_el),
            website: website_fn(website_el)
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
                        <FormItem label='Name' {...formItemLayout}>
                            {p.name}
                        </FormItem>
                        <FormItem label='Endpoint' {...formItemLayout}>
                            {p.endpoint}
                        </FormItem>
                        <FormItem label='Website URL' {...formItemLayout}>
                            {p.website}
                        </FormItem>

                        <FormItem {...formItemLayout}>
                            <Button loading={this.props.loading} type="primary" htmlType="submit" className="d_btn">
                                {this.props.chain._id ? 'Save' : 'Create'}
                            </Button>
                        </FormItem>
                    </div>
                </Form>
            </div>
        )
    }

}
export default Form.create()(C)
