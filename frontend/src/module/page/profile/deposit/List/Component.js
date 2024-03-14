import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Table, Icon } from 'antd'
import I18N from '@/I18N'
import config from '@/config'

import './style.scss'
import moment from 'moment/moment'

export default class extends BaseComponent {

    ord_render () {
        const columns = [{
            title: '#',
            dataIndex: '_id',
            render: (_id, item, key) => {
                return key + 1
            }
        }, {
            title: 'Name',
            dataIndex: 'chain',
            render: (chain, item) => {
                return chain.name
            }
        }, {
            title: 'Value',
            dataIndex: 'value',
            render: (value, item) => {
                return <span>{(Number(value) || 0) / (1.0 * 10 ** item.chain.decimal)} {item.chain.symbol}</span>
            }
        }, {
            title: 'Date',
            dataIndex: 'createdAt',
            render: (createdAt) => {
                return moment(createdAt).format('DD/MM/YYYY')
            },
            sorter: (a, b) => {
                return a.createdAt - b.createdAt
            },
        }]

        const data = this.props.list

        return (
            <Table
                columns={columns}
                dataSource={data}
                rowKey={record => record.chain._id}
                loading={this.props.loading}
            />
        )
    }

    linkProfileInfo(userId) {
        this.props.history.push(`/admin/profile/${userId}`)
    }

}
