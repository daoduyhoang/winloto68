import React from 'react'
import ProfilePage from '../../ProfilePage'

import '../admin.scss'
import './style.scss'

import { Col, Row, Breadcrumb, Icon, Input, Button } from 'antd'
import ListChain from './ListChain/Component'
import Navigator from '../../shared/HomeNavigator/Container'
import MediaQuery from 'react-responsive'
import Footer from '@/module/layout/Footer/Container'

export default class extends ProfilePage {
    state = {
        usernameFilter: ''
    }

    async componentDidMount() {
        await super.componentDidMount()
        this.props.listChain()
    }

    gotoCreateChain() {
        this.props.history.push('/admin/chain_create')
    }

    ord_renderContent () {
        return (
            <div>
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_Profile p_admin_content">
                            <MediaQuery maxWidth={720}>
                                <Row>
                                    <Col className="wrap-box-navigator">
                                        <Navigator selectedItem={'chains'} />
                                    </Col>
                                </Row>
                            </MediaQuery>
                            <Row>
                                <MediaQuery minWidth={720}>
                                    <Col span={4} className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'chains'} />
                                    </Col>
                                </MediaQuery>
                                <Col xs={{span: 24}} md={{span: 20}} className="c_Balance admin-right-column wrap-box-user">
                                    <Button onClick={this.gotoCreateChain.bind(this)}>Create Chain</Button>
                                    <div class="vert-gap-sm clearfix"/>
                                    <ListChain deleteChain={this.props.deleteChain} data={this.props.chains} history={this.props.history} loading={this.props.loading} />
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
