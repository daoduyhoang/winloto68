import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Affix, Layout, Menu, Icon, Badge, Avatar, Modal, Dropdown, Popover, Select, Button, List, Spin} from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'
import MediaQuery from 'react-responsive'
import Flyout from './Flyout';
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from '@/config/constant'
import {USER_ROLE, USER_LANGUAGE, USER_AVATAR_DEFAULT} from '@/constant'
import Flag from 'react-flags'
import Data from '@/config/data'
import UserEditForm from '@/module/form/UserEditForm/Container'
import LoginOrRegisterForm from '@/module/form/LoginOrRegisterForm/Container'
import InfiniteScroll from 'react-infinite-scroller'
import { miniAddressSummary } from '@/util'

const {Header} = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

export default class extends BaseComponent {
    constructor() {
        super()

        this.state = {
            affixed: false,
            visible: false,
            completing: false,
            showNoti: 0,
            page: 1,
            results: 50,
        }
        this.debouncedLoadMore = _.debounce(this.loadMore.bind(this), 300)
    }

    componentWillUnmount() {
        // clearInterval(this.interval)
    }

    async componentDidMount() {
        if (!this.props.isLogin) {
            return
        }
    }

    async loadMore() {
        const page = this.state.page + 1

        const query = {
            page,
            results: this.state.results
        }

        if (!this.hasMore()) {
            return
        }

        this.setState({ loadingMore: true })
        await this.props.getNotifications(query)
        this.setState({ loadingMore: false })
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? USER_AVATAR_DEFAULT
            : avatar
    }

    hasMore() {
        if (this.state.loadingMore) {
            return false
        }

        return _.size(this.props.notifications) < this.props.notifications_total
    }

    renderCompleteProfileModal() {
        return (
            <Modal
                className="project-detail-nobar"
                visible={this.state.completing}
                onOk={this.onCompleteProfileModalOk.bind(this)}
                onCancel={this.onCompleteProfileModalCancel.bind(this)}
                footer={null}
                width="70%"
            >
                { this.state.completing &&
                    <UserEditForm user={this.props.user}
                        switchEditMode={this.onCompleteProfileModalCancel.bind(this)} completing={true}/>
                }
            </Modal>
        )
    }

    renderRegisterLoginModal() {
        return (
            <Modal
                className="register-login"
                maskClosable={false}
                visible={this.props.user.showRegisterLoginModal}
                onOk={() => {this.props.toggleRegisterLoginModal(false)}}
                onCancel={() => {this.props.toggleRegisterLoginModal(false)}}
                footer={null}
                width="60%"
            >
                {this.props.user.showRegisterLoginModal &&
                    <LoginOrRegisterForm />
                }
            </Modal>
        )
    }

    onCompleteProfileModalOk() {
        this.setState({
            completing: false
        })
    }

    onCompleteProfileModalCancel() {
        this.setState({
            completing: false
        })
    }

    buildAcctDropdown() {

        const isLogin = this.props.isLogin
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

        return (
            <Menu onClick={this.clickItem.bind(this)}>
                {isLogin ?
                    <Menu.Item key="profile/info">
                        {I18N.get('0200')}
                    </Menu.Item> :
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
        )
    }

    buildLanguageDropdown() {
        const menu = (
            <Menu onClick={this.clickItem.bind(this)} className="language-menu">
                <Menu.Item key="vn">
                    <div>
                        <Flag name="VN" format="png"
                            basePath="/assets/images/flags"
                            pngSize={24} shiny={true} alt="Tiếng Việt" />
                        <span className="language-us">Tiếng Việt</span>
                    </div>
                </Menu.Item>
                <Menu.Item key="en">
                    <div>
                        <Flag name="US" format="png"
                            basePath="/assets/images/flags"
                            pngSize={24} shiny={true} alt="English" />
                        <span className="language-us">English</span>
                    </div>
                </Menu.Item>
            </Menu>
        )

        return (
            <Dropdown overlay={menu} placement="bottomCenter">
                <a className="ant-dropdown-link">
                    <Flag name={Data.mappingLanguageKeyToName[this.props.lang]} format="png"
                        basePath="/assets/images/flags"
                        pngSize={24} shiny={true} alt="English" />
                </a>
            </Dropdown>
        )
    }

    buildHelpDropdown() {
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

        return (
            <Menu onClick={this.clickItem.bind(this)} className="help-menu">
                {this.props.isLogin &&
                <Menu.Item key="logout">
                    {I18N.get('0204')}
                </Menu.Item>
                }
            </Menu>
        )
    }

    getSelectedKeys() {
        let keys = _.map(['landing', 'profile', 'admin', 'test', 'home', 'dice'], (key) => {
            return ((this.props.pathname || '').indexOf(`/${key}`) === 0) ? key : ''
        })

        if (_.includes(keys, 'admin')) {
            keys = _.union(_.without(keys, ['admin']), ['profile'])
        }

        return keys
    }

    hide = () => {
        this.setState({
          visible: false,
        })
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    async readNotification(notificationId) {
        const res = await this.props.readNotification(notificationId)

        if (res) {
            const data = await this.props.getNotifications({
                page: this.state.page,
                results: this.state.results
            })

            let count = 0
            _.forEach(data, (notification) => {
                if (notification.unRead) {
                    count++
                }
            })

            this.setState({showNoti: count})
        }
    }

    goCreatepage() {
        if (!this.props.isLogin) {
            return this.props.toggleRegisterLoginModal(true)
        }
        this.props.history.push('/journey-passenger-create');
    }

    ord_render() {
        const isLogin = this.props.isLogin
        const acctDropdown = this.buildAcctDropdown()
        const helpDropdown = this.buildHelpDropdown()
        const profile = this.props.user.profile
        const username = this.props.user.username

        return (
            <Header className="c_Header">
                <div className="header_wrap">
                <Menu onClick={this.clickItem.bind(this)} className="c_Header_Menu pull-left"
                    selectedKeys={this.getSelectedKeys()} mode="horizontal">
                    <Menu.Item className="c_MenuItem logo" key="landing">
                        <img src="/assets/images/logo.svg" />
                    </Menu.Item>
                </Menu>

                <Menu className="c_Header_Menu c_Side_Menu pull-right">
                    <Menu.Item className="c_MenuItem help no-margin" key="help">
                        <MediaQuery minWidth={MIN_WIDTH_PC}>
                            { this.props.isLogin && <Dropdown overlay={helpDropdown} style="margin-top: 24px;">
                                <a className="ant-dropdown-link">
                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H14V1H0V0ZM0 5H14V6H0V5ZM14 10H0V11H14V10Z" fill="white"/>
                                    </svg>
                                </a>
                            </Dropdown>}
                        </MediaQuery>
                    </Menu.Item>
                    <Menu.Item className="c_MenuItem mobile" key="mobileMenu" onClick={this.props.toggleMobileMenu}>
                        <Icon type="menu-fold"/>
                    </Menu.Item>
                    <Menu.Item className="mobile-language-dropdown" style={{marginTop: 13}}>
                    </Menu.Item>
                </Menu>

                <Menu onClick={this.clickItem.bind(this)} className="c_Header_Menu pull-right"
                    selectedKeys={this.getSelectedKeys()} mode="horizontal">
                    { this.props.isLogin && this.props.user.username !=='admin' &&
                    <Menu.Item className="c_MenuItem link" key="home">
                        Trang chủ
                    </Menu.Item>
                    }
                    { this.props.isLogin && this.props.user.username !=='admin' &&
                    <Menu.Item className="c_MenuItem link" key="add_client">
                        Thêm khách
                    </Menu.Item>
                    }
                    { this.props.isLogin && this.props.user.username !=='admin' &&
                    <Menu.Item className="c_MenuItem link" key="update_client">
                        Sửa khách
                    </Menu.Item>
                    }
                    {/* <Menu.Item className="c_MenuItem link" key="test">
                        TEST BTC
                    </Menu.Item> */}
                    { this.props.isLogin ?
                        <Menu.Item className="c_MenuItem link" key="profile">
                            <b>{miniAddressSummary(username)}</b>
                        </Menu.Item>
                        : <Menu.Item className="c_MenuItem link" key="login">
                            Đăng nhập
                        </Menu.Item>
                    }
                </Menu>
                <div className="clearfix"/>
                {this.renderRegisterLoginModal()}
                </div>
            </Header>
        )
    }

    completeProfile() {
        this.setState({
            completing: true
        })
    }

    dismissToast() {
        this.setState({
            dismissed: true
        })

        localStorage.setItem('complete-profile-dismissed', true)
    }

    isPermanentlyDismissed() {
        return localStorage.getItem('complete-profile-dismissed')
    }

    renderToast() {
        return (
            <div className="fill-profile-toast">
                <a onClick={this.completeProfile.bind(this)}>
                    {I18N.get('profile.complete')}
                    <Icon type="right" style={{marginLeft: 8}}/>
                </a>
                <a className="pull-right toast-close-container" onClick={this.dismissToast.bind(this)}>
                    <Icon type="close"/>
                </a>
            </div>
        )
    }

    hasIncompleteProfile() {
        const requiredProps = [
            'profile.firstName',
            'profile.lastName',
            'profile.timezone',
            'profile.country',
            'profile.bio',
            'profile.skillset',
            'profile.profession'
        ]

        return !_.every(requiredProps, (prop) => {
            return _.has(this.props.user, prop) &&
                !_.isEmpty(_.get(this.props.user, prop))
        })
    }

    clickItem(e) {
        const key = e.key
        const { isLogin } = this.props

        if (_.includes([
            'landing',
            'home',
            'register',
            'signup',
            'test',
            'profile/info',
            'add_client',
            'update_client'
        ], key)) {

            if (key === 'landing') {
                this.props.history.push('/')
            } else {
                this.props.history.push('/' + e.key)
            }
        } else if (key === 'notice') {

            // hack for now
            localStorage.setItem('popup-update', 'force')
            window.location.reload()

        } else if (key === 'logout') {
            this.props.logout()
        } else if (key === 'profile') {
            this.props.history.push('/profile/info')
        } else if (key === 'login') {
            this.props.toggleRegisterLoginModal(true)
        } else if (_.includes([
            'en',
            'zh',
            'vn'
        ], key)) {

            analytics.track('LANGUAGE_CHANGED', {
                language: e.key,
                url: location.href
            })

            this.props.changeLanguage(e.key);
        }
    }
}
