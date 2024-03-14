import React from 'react'
import BaseComponent from '@/model/BaseComponent'

import {Row, Col, Icon, Menu, Avatar} from 'antd';

import './style'
import { Modal } from 'antd/lib/index'
import _ from 'lodash'
import I18N from '@/I18N'
import { miniAddressSummary } from '@/util'

import {USER_ROLE, USER_LANGUAGE, USER_AVATAR_DEFAULT} from '@/constant'

export default class extends BaseComponent {

    handleMenuClick(ev,) {
        const key = ev.key
        const { isLogin } = this.props

        if (_.includes([
            'signup',
            'add_client',
            'update_client',
            'about',
            'faq',
            'home',
            'document',
            'profile/info'
        ], key)) {
            this.props.history.push('/' + ev.key)
        } else if (key === 'login' || key === 'register') {
            this.props.toggleMobileMenu()
            this.props.toggleRegisterLoginModal(true)
        } else if (key === 'logout') {
            this.props.toggleMobileMenu()
            this.props.logout()
        }
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? USER_AVATAR_DEFAULT
            : avatar
    }

    ord_render () {

        const isLogin = this.props.user.is_login
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.user.role)
        const profile = this.props.user.profile
        const username = this.props.user.username

        // animateStyle is passed in and handled by react-motion
        return <div className="c_mobileMenu" style={this.props.animateStyle}>
            <Row>
                <Col className="right-align">
                    <Icon className="closeMobileMenu" type="menu-unfold" onClick={this.props.toggleMobileMenu}/>
                </Col>
            </Row>
            <Row>
                <Col className="menuContainer">
                    <Menu
                        onClick={this.handleMenuClick.bind(this)}
                        mode="inline"
                    >
                        { this.props.isLogin && this.props.user.username !=='admin' &&
                        <Menu.Item key="home">
                            Home
                        </Menu.Item>
                        }
                        { this.props.isLogin && this.props.user.username !=='admin' &&
                        <Menu.Item key="add_client">
                            Thêm khách
                        </Menu.Item>
                        }
                        { this.props.isLogin && this.props.user.username !=='admin' &&
                        <Menu.Item key="update_client">
                            Sửa khách
                        </Menu.Item>
                        }
                        { isLogin &&
                            <Menu.Item key="profile/info">
                                <b>{miniAddressSummary(username)}</b>
                            </Menu.Item>
                        }
                    </Menu>
                </Col>
            </Row>
            <Row>
                <Col className="menuContainer">
                    <Menu
                        onClick={this.handleMenuClick.bind(this)}
                        mode="inline"
                    >
                        {!isLogin &&
                            <Menu.Item key="login">
                                {I18N.get('0201')}
                            </Menu.Item>
                        }
                        {!isLogin &&
                        <Menu.Item key="register">
                            {I18N.get('0202')}
                        </Menu.Item>
                        }
                        {isLogin &&
                        <Menu.Item key="logout">
                            {I18N.get('0204')}
                        </Menu.Item>
                        }
                    </Menu>
                </Col>
            </Row>
            <Row>
                <Col className="menuContainer">
                    <Menu
                        onClick={this.handleMenuClick.bind(this)}
                        mode="inline"
                    >
                    </Menu>
                </Col>
            </Row>
        </div>
    }

}
