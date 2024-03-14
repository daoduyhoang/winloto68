import React from 'react'
import ProfilePage from '../../ProfilePage'
import Navigator from '@/module/page/shared/HomeNavigator/Container'
import I18N from '@/I18N'
import Footer from '@/module/layout/Footer/Container'

import './style.scss'
import '../../admin/admin.scss'

import { Col, Row, Icon, Form, Breadcrumb, Button, Dropdown, } from 'antd'
const FormItem = Form.Item
import WithdrawForm from '@/module/form/WithdrawForm/Container'
import MediaQuery from 'react-responsive'
import _ from 'lodash'
import List from './List/Container'

export default class extends ProfilePage {

    constructor() {
        super()

        this.state = {
        }
    }

    componentDidMount() {
        this.props.getCashOut()
    }

    componentWillUnmount() {
    }

    ord_renderContent() {
        return (
            <div>
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_Profile p_admin_content">
                            <MediaQuery maxWidth={720}>
                                <Row>
                                    <Col className="wrap-box-navigator">
                                        <Navigator selectedItem={'withdraw'} />
                                    </Col>
                                </Row>
                            </MediaQuery>
                            <Row>
                                <MediaQuery minWidth={720}>
                                    <Col span={4} className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'withdraw'} />
                                    </Col>
                                </MediaQuery>
                                <Col xs={{span: 24}} md={{span: 20}} className="c_Balance admin-right-column wrap-box-user">
                                    <List list={this.props.list} />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}
