import React from 'react'
import ProfilePage from '../../ProfilePage'
import Navigator from '@/module/page/shared/HomeNavigator/Container'
import I18N from '@/I18N'
import Footer from '@/module/layout/Footer/Container'

import './style.scss'
import '../../admin/admin.scss'

import { Col, Row, Icon, Form, Breadcrumb, Button, Dropdown, List, Avatar, Modal } from 'antd'
const FormItem = Form.Item
import WithdrawForm from '@/module/form/WithdrawForm/Container'
import MediaQuery from 'react-responsive'
import _ from 'lodash'

export default class extends ProfilePage {

    constructor() {
        super()

        this.state = {
            showWithdraw: false,
            balance: {}
        }
    }

    componentDidMount() {
        this.props.getListChain()
        this.props.getBalance()
    }

    componentWillUnmount() {
    }

    updateBalance() {
        this.props.updateBalance()
    }

    closeWithdrawModal() {
        this.props.getListChain()
        this.props.getBalance()
        this.setState({showWithdraw: false})
    }

    openWithdrawModal(item) {
        this.setState({
            showWithdraw: true,
            balance: item
        })
    }

    renderRegisterLoginModal() {
        return (
            <Modal
                className="register-login"
                maskClosable={false}
                visible={this.state.showWithdraw}
                onOk={() => {this.closeWithdrawModal()}}
                onCancel={() => {this.closeWithdrawModal()}}
                footer={null}
                width="60%"
            >
                {this.state.showWithdraw &&
                    <WithdrawForm balance={this.state.balance} onHideModal={this.closeWithdrawModal.bind(this)} />
                }
            </Modal>
        )
    }

    ord_renderContent() {
        return (
            <div>
                <div className="ebp-header-divider">

                </div>
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_Profile p_admin_content">
                            <MediaQuery maxWidth={720}>
                                <Row>
                                    <Col className="wrap-box-navigator">
                                        <Navigator selectedItem={'balance'} />
                                    </Col>
                                </Row>
                            </MediaQuery>
                            <Row>
                                <MediaQuery minWidth={720}>
                                    <Col span={4} className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'balance'} />
                                    </Col>
                                </MediaQuery>
                                <Col xs={{span: 24}} md={{span: 20}} className="c_Balance admin-right-column wrap-box-user">
                                    <Button onClick={this.updateBalance.bind(this)}>Refresh Balance</Button>
                                    {this.renderList()}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <br/>
                                </Col>
                            </Row>
                            {this.renderRegisterLoginModal()}
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }

    renderList() {
        const data = this.props.listChain
        const balances = this.props.user.balances

        if (!_.isEmpty(data)) {
            data.forEach(chain => {
                let balance = _.find(balances, {'chain': chain._id})

                if (balance && balance.value > 0) {
                    chain.value = balance.value
                } else {
                    chain.value = 0
                }
            })
        }

        return (
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo} />}
                      title={<a>{item.name} {Number(item.value) / `1e${item.decimal}`} {item.symbol}</a>}
                      description={item.wallet}
                    />
                    <Button onClick={this.openWithdrawModal.bind(this, item)}>Withdraw</Button>
                  </List.Item>
                )}
              />
        )
    }
}
