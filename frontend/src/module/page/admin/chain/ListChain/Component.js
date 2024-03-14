import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Table, Icon, Divider } from 'antd'
import I18N from '@/I18N'
import config from '@/config'

import './style.scss'
import moment from 'moment/moment'

export default class extends BaseComponent {

    viewDetail(id) {
        this.props.history.push(`/admin/chains/${id}`)
    }

    ord_render () {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            render: (name, record) => {
                return <a onClick={this.viewDetail.bind(this, record._id)}>{name}</a>
            }
        }, {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                return status
            }
        }, {
            title: 'Endpoint',
            dataIndex: 'endpoint',
            render: (endpoint) => {
                return endpoint
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
        }, {
            title: 'Action',
            dataIndex: '_id',
            width: '120px',
            render: (_id, record) => (
                <span>
                    <a onClick={this.viewDetail.bind(this, record._id)} href="javascript:;">Edit</a>
                    <Divider type="vertical" />
                    <a onClick={this.deleteChain.bind(this, record._id)} href="javascript:;">Delete</a>
                </span>
            )
        }]

        const data = this.props.data

        return (
            <Table
                columns={columns}
                dataSource={data}
                rowKey={record => record.username}
                loading={this.props.loading}
            />
        )
    }

    deleteChain(id) {
        this.props.deleteChain(id)
    }

    linkProfileInfo(userId) {
        this.props.history.push(`/admin/profile/${userId}`)
    }

}
