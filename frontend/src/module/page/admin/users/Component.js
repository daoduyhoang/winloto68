import React from 'react'
import ProfilePage from '../../ProfilePage'

import '../admin.scss'
import './style.scss'

import { Col, Row, Breadcrumb, Icon, Input, Button, Notification, InputNumber } from 'antd'
import ListUsers from './ListUsers/Component'
import Navigator from '../../shared/HomeNavigator/Container'
import Footer from '@/module/layout/Footer/Container'
import MediaQuery from 'react-responsive'

const errorFormat = (e) => {
    return !e || e.length > 30 ? 'Something wrong' : e.toString()
}

export default class extends ProfilePage {
    state = {
        usernameFilter: '',
        newUsername: '',
        invitedBy: '',
        clientLimit: '',
        privateKey: null,
    }

    async componentDidMount() {
        await super.componentDidMount()
        this.props.listUsers()
    }

    handleSearchUser(value) {
        this.setState({usernameFilter: value})
    }

    ord_renderContent () {

        let users = this.props.users

        if (this.state.usernameFilter) {
            users = users.filter((user) => {
                let regExp = new RegExp(this.state.usernameFilter, 'i')
                return (
                    regExp.test(user.username)
                )
            })
        }

        return (
            <div>
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_Profile p_admin_content">
                            <MediaQuery maxWidth={720}>
                                <Row>
                                    <Col className="wrap-box-navigator">
                                        <Navigator selectedItem={'users'} />
                                    </Col>
                                </Row>
                            </MediaQuery>
                            <Row>
                                <MediaQuery minWidth={720}>
                                    <Col span={4} className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'users'} />
                                    </Col>
                                </MediaQuery>
                                <Col xs={{span: 24}} md={{span: 20}} className="c_Balance admin-right-column wrap-box-user">
                                    {this.state.privateKey && <p style={{'color':'white'}}>{this.state.privateKey}</p>}
                                    <Col sm={24} md={18}>
                                        <Col sm={24} md={9}>
                                            <Input value={this.state.newUsername} onChange={this.onUsernameChange.bind(this)} placeholder="username"/>
                                        </Col>
                                        <Col sm={24} md={15}>
                                            <Col sm={12} md={14}>
                                                <Input value={this.state.invitedBy} onChange={this.onInvitedByChange.bind(this)} placeholder="invited By(username)"/>
                                            </Col>
                                            <Col sm={12} md={8}>
                                                <Button className="maxWidth" onClick={() => this.createUser()}>Create</Button>
                                            </Col>

                                            <Col sm={12} md={14}>
                                                <InputNumber className="maxWidth" value={this.state.clientLimit} onChange={this.onClientLimitChange.bind(this)} placeholder="new clients limit"/>
                                            </Col>
                                            <Col sm={12} md={8}>
                                                <Button className="maxWidth" onClick={() => this.updateClientLimit()}>Set Limit</Button>
                                            </Col>
                                            <Col sm={22}md={22}>
                                                <Button className="maxWidth" onClick={() => this.resetHashKey()}>Reset Key</Button>
                                            </Col>
                                        </Col>
                                    </Col>
                                    <Col sm={24} md={6}>
                                        <Input.Search onSearch={this.handleSearchUser.bind(this)}
                                                      prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                      placeholder="search user"/>
                                    </Col>
                                    <div class="vert-gap-md clearfix"/>
                                    <ListUsers props={this.props} setUsername={this.setUsername} users={users} history={this.props.history} loading={this.props.loading}/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
    onUsernameChange(e) {
        const username = e.target.value
        this.setState({
            newUsername: username
        })
    }

    onInvitedByChange(e) {
        const invitedBy = e.target.value
        this.setState({
            invitedBy: invitedBy
        })
    }

    onClientLimitChange(value) {
        const clientLimit = value
        this.setState({
            clientLimit: clientLimit
        })
    }

    async createUser() {
        this.setState({
            privateKey: null
        })
        let data
        if (this.state.invitedBy) {
            data = {
                username:this.state.newUsername,
                invitedBy: this.state.invitedBy
            }
        } else {
            data = {username:this.state.newUsername}
        }
        try {
            const rs = await this.props.createUser(data)
            Notification.success({
                message: 'Created success',
            })
            this.setState({
                privateKey: rs.user.privateKey
            })
            await this.props.listUsers()
        } catch(e) {
            console.log('xxx', e)
            Notification.error({
                message: errorFormat(e),
            })
        }
    }

    async updateClientLimit() {
        console.log('xxx', this.state.clientLimit)
        console.log('xxx', this.state.newUsername)
        try {
            const data = {username:this.state.newUsername, clientLimit: this.state.clientLimit}
            const rs = await this.props.updateClientLimit(data)
            Notification.success({
                message: 'Updated limit success',
            })
            await this.props.listUsers()
        } catch(e) {
            console.log('xxx', e)
            Notification.error({
                message: errorFormat(e),
            })
            
        }
    }

    async resetHashKey() {
        console.log('xxx', this.state.newUsername)
        try {
            const data = {username:this.state.newUsername}
            const rs = await this.props.resetHashKey(data)
            console.log(rs)
            this.setState({
                privateKey: rs.newPrivateKey
            })
            Notification.success({
                message: 'Reseted success, send new key to user',
            })
        } catch(e) {
            console.log('xxx', e)
            Notification.error({
                message: errorFormat(e),
            })
        }
    }

    setUsername = (username) =>{
        this.setState({newUsername: username})
    }
}
