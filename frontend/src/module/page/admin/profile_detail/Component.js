import React from 'react'
import AdminPage from '../BaseAdmin'
import Profile from '@/module/profile/Container'

import '../admin.scss'
import './style.scss'

import Navigator from '../../shared/HomeNavigator/Container'

import { Breadcrumb, Col, Icon, Row, Spin } from 'antd'

import {TASK_STATUS} from '@/constant'

export default class extends AdminPage {

    async componentDidMount() {
        await super.componentDidMount()
        const userId = this.props.match.params.userId
        this.props.getMember(userId)
    }

    componentWillUnmount() {
        this.props.resetMemberDetail()
    }

    ord_renderContent () {
        if (this.props.loading || !this.props.member) {
            return this.renderLoading()
        }
        console.log('xxx', this.props.member)
        return (
            <div>
                <div className="ebp-header-divider" />
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_admin_content">
                            <Row className="clearfix">
                                <Col sm={24} md={4} className="admin-left-column wrap-box-navigator">
                                    <Navigator selectedItem={'users'}/>
                                </Col>
                                <Col sm={24} md={20} className="admin-left-column wrap-box-user">
                                    <Profile user={this.props.member}/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderLoading(){
        return (
            <div className="flex-center">
                <Spin size="large" />
            </div>

        )
    }
}
