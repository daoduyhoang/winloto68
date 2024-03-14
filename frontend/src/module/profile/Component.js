import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import UserEditForm from '@/module/form/UserEditForm/Container'
import I18N from '@/I18N'
import { Col, Row, Icon, Popover, Button, Spin, Tabs, Tag, Modal, Upload, Message, List, Input } from 'antd'
import moment from 'moment-timezone'
import {upload_file} from '@/util'
import {USER_AVATAR_DEFAULT, LINKIFY_OPTION} from '@/constant'
import config from '@/config'
import MediaQuery from 'react-responsive'
import linkifyStr from 'linkifyjs/string';
import './style.scss'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const TabPane = Tabs.TabPane
const Search = Input.Search;
const Confirm = Modal.confirm;

const STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
}

export default class extends BaseComponent {

    constructor(props) {
        super(props)
        this.state = {
            editing: false,
            wallet: '',
            error: false,
            success: false
        }
    }

    async componentDidMount() {
        await super.componentDidMount()
    }

    // TODO: add twitter, telegram, linkedIn, FB
    ord_render () {
        if (_.isEmpty(this.props.user) || this.props.user.loading) {
            return <div class="center"><Spin size="large" /></div>;
        }

        return (
            <div className="c_Member public">
                <div>
                    <div className="member-content member-content-mobile">
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }

    renderContent() {
        return (
            <div>
                <div className="profile-info-container profile-info-container-mobile clearfix">
                    {this.renderAvatar(true)}
                    {this.renderFullName(true)}
                    {this.renderRef(true)}
                </div>
                {this.renderEditForm()}
            </div>
        )
    }

    renderEditForm() {
        return (
            <Modal
                className="project-detail-nobar"
                visible={this.state.editing}
                onOk={this.switchEditMode.bind(this, false)}
                onCancel={this.switchEditMode.bind(this, false)}
                footer={null}
                width="70%"
            >
                { this.state.editing &&
                    <UserEditForm user={this.props.user}
                        switchEditMode={this.switchEditMode.bind(this, false)} completing={false}/>
                }
            </Modal>
        )
    }

    renderAvatar(isMobile) {
        const p_avatar = {
            showUploadList: false,
            customRequest: (info) => {

                upload_file(info.file).then(async (d) => {
                    await this.props.updateUser(this.props.currentUserId, {
                        profile: {
                            avatar: d.url,
                            avatarFilename: d.filename,
                            avatarFileType: d.type
                        }
                    })

                    await this.props.getCurrentUser()

                })
            }
        }

        return (
            <div className={`profile-avatar-container ${isMobile ? 'profile-avatar-container-mobile' : ''}`}>
                <div className="profile-avatar">
                    <Upload name="avatar" listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        {...p_avatar}
                    >
                        {this.props.avatar_loading
                            ? (
                                <div>
                                    <Icon type="loading"/>
                                </div>
                            )
                            : (
                                <img src={this.getAvatarWithFallback(
                                    this.props.user.profile && this.props.user.profile.avatar)} />
                            )
                        }
                    </Upload>
                </div>
            </div>
        )
    }

    showConfirm() {
        const self = this;
        Confirm({
            title: 'Do you want to reset Public Key?',
            content: 'When clicked the OK button, your Public Key will be change',
            onOk() {
              self.resetPublicKey()
            },
            onCancel() {},
        });
    }

    // status = current status
    setStatus(address, status) {
        const publicKey = this.props.user.publicKey || this.props.publicKey
        this.props.setStatus(publicKey, address).then((res) => {
            console.log('res', res)
            this.props.getListWallet(this.props.publicKey)
            this.setState({
                success: status === STATUS.ACTIVE ? address + ' disabled' : address + ' enabled'
            })
            this.autoRemoveNoti()
        }).catch((err) => {
            console.log('err', err.toString())
            this.setState({
                error: err.toString()
            })
            this.autoRemoveNoti()
        })
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? USER_AVATAR_DEFAULT
            : avatar
    }

    changePassword() {
        console.log('xxx')
        this.props.changePassword()
    }

    renderFullName(isMobile) {
        return (
            <div>
                <p className="full-name">
                    Full Name: <span className={`profile-general-title ${isMobile ? 'profile-general-title-mobile' : ''}`}>
                        {/* {this.props.user.profile && this.props.user.profile.firstName}&nbsp; */}
                        {/* {this.props.user.profile && this.props.user.profile.lastName} */}
                        {this.props.username}

                    </span> {this.renderEditButton(true)}
                </p>
                <Button onClick={()=> this.changePassword()}>Change Password</Button>
            </div>
        )
    }

    copyReferLink() {
        Message.success('Copied')
    }

    resetPublicKey() {
        this.props.resetPublicKey().then(() => {
            this.props.getCurrentUser()
        })
    }

    renderRef(isMobile) {
        const userId = this.props.currentUserId
        const url = window.location.hostname + '?ref=' + userId
        const expired = new Date() > new Date(this.props.expiredTime)
        const limited = this.props.clientLimit <=this.props.clientCount
        
        return (
            <Col span={24}>
            <Col className={expired ? "redText" : "normalText"} xs={24} md={24}>Hạn sử dụng: {new Date(this.props.expiredTime).toDateString()}</Col>
            {expired &&
                <Col className="normalText" xs={24} md={24}>Bạn vui lòng liên hệ admin để đăng ký sử dụng dịch vụ.</Col>}
                <Col className={limited ? "redText" : "normalText"} xs={24} md={24}>Số khách/ tối đa: {this.props.clientCount} / {this.props.clientLimit}</Col>
            </Col>
        )
    }

    renderEditButton(isMobile) {
        return
        return (
            <Icon className="icon-edit" onClick={this.switchEditMode.bind(this)} type="edit" />
        )
    }

    switchEditMode() {
        this.setState({
            editing: !this.state.editing
        })
    }
}
