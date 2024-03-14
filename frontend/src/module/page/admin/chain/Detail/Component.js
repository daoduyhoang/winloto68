import React from 'react'
import AdminPage from '../../BaseAdmin'

import '../../admin.scss'
import './style.scss'

import { Col, Row, Breadcrumb, Icon, Input, Button } from 'antd'
import ChainCreateForm from '@/module/form/ChainCreateForm/Container'
import Navigator from '../../../shared/HomeNavigator/Container'

export default class extends AdminPage {
    state = {
        usernameFilter: ''
    }

    async componentDidMount() {
        this.props.getDetail(this.props.match.params.chainId)
    }

    ord_renderContent () {
        return (
            <div className="p_admin_index ebp-wrap">
                <div className="ebp-header-divider" />
                <div className="d_box">
                    <div className="p_admin_content">
                        <Row>
                            <Col sm={24} md={4} className="wrap-box-navigator">
                                <Navigator selectedItem={'chains'}/>
                            </Col>
                            <Col sm={24} md={20} className="admin-right-column wrap-box-chain">
                                <ChainCreateForm chain={this.props.chain} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
