import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Table, Icon } from 'antd'
import I18N from '@/I18N'
import config from '@/config'

import './style.scss'
import moment from 'moment/moment'
import { Col, Button, Notification} from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const errorFormat = (e) => {
    return !e || e.length > 30 ? 'Something wrong' : e.toString()
}

export default class extends BaseComponent {

    ord_render () {
        const columns = [{
            title: I18N.get('1201'),
            dataIndex: 'username',
            render: (username, record) => {
                return <a onClick={this.linkProfileInfo.bind(this, record.username)} className="tableLink">{username}</a>
            },
            sorter: (a, b) => {
                return a.username.localeCompare(b.username)
            }
        }, {
            title: 'limit', //I18N.get('1208'),
            dataIndex: 'clientLimit',
            render: (clientLimit, item) => {
                // return item.profile && item.profile.firstName + ' ' + item.profile && item.profile.lastName
                return item.clientLimit
            },
            sorter: (a, b) => {
                return a.clientLimit - b.clientLimit
            },
        }, {
            title: 'Points/Total',
            dataIndex: 'invitedPoint',
            render: (invitedPoint, record) => {
                return( 
                <Col span={24}>
                    {Number(record.receivedPoint)/30}/{Number(invitedPoint)/30}
                    <Button onClick={() => this.update_point(record.username, 1)}>+</Button>
                    <Button onClick={() => this.update_point(record.username, -1)}>-</Button>
                </Col>
                )
            },
            sorter: (a, b) => {
                return a.invitedPoint - b.invitedPoint
            },
        }, {
            title: 'Date',
            dataIndex: 'expiredTime',
            render: (expiredTime, record) => {
                return moment(record.expiredTime).format('DD/MM/YYYY')
            },
            sorter: (a, b) => {
                return moment(a.expiredTime) - moment(b.expiredTime)
            },
        },
        {
            title: 'License',
            dataIndex: 'license',
            key: 'license',
            render: (username, record) => {
                return (
                    <Col span={24}>
                        <Col span={12}>
                            <Button className="maxWidth" onClick={() => this.update_license(record.username, 30)}>add</Button>
                        </Col>
                        <Col span={12}>
                            <Button className="maxWidth" onClick={() => this.update_license(record.username, -30)}>sub</Button>
                        </Col>
                        <Col span={24}>
                        <CopyToClipboard text={record.privateKey}
                            onCopy={() => this.setState({copied: true})}>
                            <Button className="maxWidth" >Copy Key</Button>
                        </CopyToClipboard>
                        </Col>
                    </Col>
                )
            }
        },
    ]

        const data = this.props.users

        return (
            <Table
                columns={columns}
                dataSource={data}
                rowKey={record => record.username}
                loading={this.props.loading}
            />
        )
    }

    linkProfileInfo(username) {
        console.log(username)
        this.props.setUsername(username)
        // this.props.history.push(`/admin/profile/${userId}`)
    }

    async update_license(username, toAdd) {
        try {
            await this.props.props.update_license(username, toAdd)
            await this.props.props.listUsers()
            if (toAdd > 0) {
                Notification.success({
                    message: username + 's License added success',
                })
            } else {
                Notification.success({
                    message: username + 's License removed success',
                })
            }
        } catch(e) {
            Notification.error({
                message: errorFormat(e),
            })
        }
    }

    async update_point(username, toAdd) {
        try {
            await this.props.props.update_point(username, toAdd)
            await this.props.props.listUsers()
            if (toAdd > 0) {
                Notification.success({
                    message: username + 's point added success',
                })
            } else {
                Notification.success({
                    message: username + 's point reduced success',
                })
            }
        } catch(e) {
            Notification.error({
                message: errorFormat(e),
            })
        }
    }

}
