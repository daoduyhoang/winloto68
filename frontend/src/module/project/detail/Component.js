import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import moment from 'moment'
import {
    message,
    Col,
    Row,
    Tag,
    Icon,
    Carousel,
    Avatar,
    Button,
    Spin,
    Select,
    Table,
    Input,
    Form,
    Divider,
    Modal,
    InputNumber,
    Popover,
    Radio,
    Popconfirm,
    Tooltip
} from 'antd'
import I18N from '@/I18N'
import { TASK_CANDIDATE_STATUS, TASK_CANDIDATE_TYPE, TEAM_USER_STATUS, TEAM_ROLE,
    TASK_STATUS, USER_AVATAR_DEFAULT, TEAM_AVATAR_DEFAULT, TASK_TYPE } from '@/constant'
import Comments from '@/module/common/comments/Container'
import ProjectApplication from '@/module/project/application/Container'
import ProjectApplicationStart from '@/module/page/project_detail/application/start/Container'
import ProfilePopup from '@/module/profile/OverviewPopup/Container'
import _ from 'lodash'
import './style.scss'
import config from '@/config'
import InputPlaces from '@/module/page/shared/InputPlaces/Container'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const RadioGroup = Radio.Group
/*
 * Project Pop-up UI
 *
 */
class C extends BaseComponent {

    ord_states() {
        return {
            showAppModal: false,
            showApplicationStartModal: false,
            projectCandidateId: null,
            showUserInfo: null,
            showLoginRegisterModal: false,
            showApplyingFormModal: false,
            passenger: null,
            startAddressPlaceId: null,
            endAddressPlaceId: null
        }
    }

    componentDidMount() {
        const taskId = this.props.taskId
        this.props.getTaskDetail(taskId)
    }

    componentWillUnmount() {
        this.props.resetTaskDetail()
    }

    /**
     * Not used, for bidding projects we hide comments anyways, and otherwise it should just be a public comments thread
     */
    canComment() {

        const isTaskCandidate = _.find(this.props.task.candidates, (candidate) => {
            return candidate.user && candidate.user._id === this.props.currentUserId &&
                candidate.status === TASK_CANDIDATE_STATUS.APPROVED
        })

        const allCandidateTeamIds = _.compact(_.map(this.props.task.candidates, (candidate) => {
            return candidate.team && candidate.team._id
        }))

        const currentUserTeamIds = _.map(this.props.ownedTeams, '_id')
        const belongsToMemberTeam = !_.isEmpty(
            _.intersection(allCandidateTeamIds, currentUserTeamIds))
        const isTaskOwner = this.props.task.createdBy &&
            (this.props.task.createdBy._id === this.props.currentUserId)

        return isTaskCandidate || belongsToMemberTeam || isTaskOwner
    }

    copyReferLink() {
        message.success('Sao chép thành công')
    }

    renderHeader() {
        return (
            <div className="header">
                <h3 className="with-gizmo">
                    Hành trình <Tooltip title="Chia sẻ đường dẫn giới thiệu"><span style={{cursor: 'pointer'}}>
                    <CopyToClipboard text={`https://bonbon.run/journey-passenger/${this.props.task._id}?ref=${this.props.currentUserId}`}
                      onCopy={this.copyReferLink.bind(this)}>
                        <Icon type="share-alt" />
                    </CopyToClipboard>
                </span></Tooltip>
                </h3>
            </div>
        )
    }

    renderMeta() {
        const generateRow = (key, value, cssRowClass) => (
            <Row className={[cssRowClass, 'meta-row'].join(' ')}>
                <Col md={6} sm={0} xs={0}>
                    {key}
                </Col>
                <Col md={18} sm={24} xs={24}>
                    {value}
                </Col>
            </Row>
        )

        const generateHtmlRow = (key, value, cssRowClass) => (
            <Row className={[cssRowClass, 'meta-row'].join(' ')}>
                <Col md={6} sm={24}>
                    {key}
                </Col>
                <Col md={18} sm={24}>
                    <div className="ql-editor" dangerouslySetInnerHTML={{__html: value}} />
                </Col>
            </Row>
        )

        const detail = this.props.task
        const budget = this.getBudgetFormatted()
        const reward = this.getRewardFormatted()
        const EVENT_DATE_FORMAT = 'MMM D, YYYY - HH:mm'
        const DEADLINE_FORMAT = 'MMM D'

        return (
            <div className="meta">
                {generateRow('Người tạo', (
                    <div>
                    <Avatar
                        src={this.getAvatarWithFallback(detail.createdBy && detail.createdBy.profile.avatar)}/> <a onClick={this.linkProfileInfo.bind(this, detail.createdBy)}>
                        {this.getUserNameWithFallback(detail.createdBy)}
                    </a>
                    </div>
                ))}
                {detail.startTime &&
                    generateRow('Thời gian',(
                        <div>
                            <Icon type="calendar" style={{ color: '#08c' }} /> {moment(detail.startTime).format('DD-MM-YYYY')} Giờ {moment(detail.startHourMinute).format('HH:mm')}
                        </div>))
                }
                {generateRow('Số ghế', (<div><Icon type="usergroup-add" style={{ color: '#08c' }} /> {detail.totalSeat}</div>))}
                {detail.bidding &&
                    generateRow('Giá cước khởi điểm',
                        (<div>{detail.priceReferBid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND</div>))}
                {!detail.bidding &&
                    generateRow('Giá cước',
                        (<div>{detail.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND</div>))}
                {detail.attachment && generateRow(I18N.get('task.attachment'),
                    <a href={detail.attachment} target="_blank">{detail.attachmentFilename}</a>)}
                {generateRow('Điểm xuất phát', (<div><Icon type="environment" style={{ color: '#08c' }} /> {detail.startAddress}</div>))}
                {generateRow('Điểm đến', (<div><Icon type="environment" style={{ color: 'rgb(245, 146, 34)' }} /> {detail.endAddress}</div>))}
                {generateRow('', (<div>{detail.name}</div>))}
            </div>
        )
    }

    /**
     * Assignment Info
     *
     * - based on the assignSelf boolean field
     *
     * This refers to the next action after a task approval
     * - If assignSelf = true, it is a private task which means it will be assigned to the owner after approval
     * - If assignSelf = false, it is public and after it will be open for applications or bidding if (bidding = true)
     */
    renderAssignmentInfo() {
        return <div>
            {this.props.task.assignSelf ?
                <div className="assignment-info">
                    <Tag>Assignment Type: PRIVATE</Tag>
                    <Popover content={`After APPROVAL this ${I18N.get(`taskType.${this.props.task.type}`)} is assigned to the owner`}>
                        < Icon className="help-icon" type="question-circle-o"/>
                    </Popover>
                </div> :
                <div className="assignment-info">
                    <Tag>Assignment Type: PUBLIC</Tag>
                    <Popover content={`After APPROVAL this ${I18N.get(`taskType.${this.props.task.type}`)} becomes publicly available`}>
                        <Icon className="help-icon" type="question-circle-o"/>
                    </Popover>
                </div>
            }
        </div>
    }

    showPhoneNumber(candidate) {
        const detail = this.props.task
        const role = this.props.currentUserRole
        const currentUserId = this.props.currentUserId

        if (!candidate.phoneNumber) {
            return ''
        }

        if (detail.createdBy._id === currentUserId || candidate.user._id === currentUserId || this.props.is_admin) {
            return ` (${candidate.phoneNumber})`
        }
        return ''
    }

    onChangeRole(e) {
        const value = e.target.value

        if (value === TEAM_ROLE.SHIP) {
            this.setState({showInputSeat: false})
        } else {
            this.setState({showInputSeat: true})
        }
    }

    renderCurrentContributors() {
        const detail = this.props.task
        const pendingMembers = _.filter(detail.members, { status: TEAM_USER_STATUS.NORMAL })
        const isTaskOwner = this.isTaskOwner()
        const canWithdraw = (taskCandidateId) => {
            const candidate = _.find(pendingMembers, { _id: taskCandidateId })
            return candidate.user._id === this.props.currentUserId
        }

        const actionRenderer = (candidate) => {
            return (
                <div className="text-right">
                    {(isTaskOwner || canWithdraw(candidate._id)) && candidate.role !== 'LEADER' && (
                        <span>
                            <Button className="btn-approve" size="small" onClick={this.showApplyingFormModal.bind(this, candidate)}>{I18N.get('project.detail.view')}</Button>
                        </span>
                    )}
                    {(this.props.is_admin || isTaskOwner) && candidate.role !== 'LEADER' && (
                        <span>
                            <Popconfirm title={I18N.get('.areYouSure')}
                                onConfirm={this.rejectPassenger.bind(this, candidate._id)}>
                                <Button className="btn-remove" size="small" >
                                    {I18N.get('project.detail.remove')}
                                </Button>
                            </Popconfirm>
                        </span>
                    )}
                </div>
            )
        }

        const columns = [{
            title: 'Name',
            key: 'name',
            render: candidate => {
                return (
                    <div key={candidate._id}>
                        <Avatar className={'gap-right ' + (candidate.role === 'LEADER' ? 'avatar-leader' : 'avatar-member')}
                            src={candidate.user.profile.avatar}/>
                        <a className="row-name-link" onClick={this.linkProfileInfo.bind(this, candidate.user)}>
                            {this.getUserNameWithFallback(candidate.user)}</a>
                        {candidate.role === 'LEADER' && (' - ' + 'Người tạo')}
                    </div>)
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: actionRenderer
        }]

        return (
            <Table
                // loading={this.props.loading}
                className="no-borders headerless"
                dataSource={pendingMembers}
                columns={columns}
                bordered={false}
                rowKey="_id"
                pagination={false}>
            </Table>
        )
    }

    renderCurrentApplicants() {
        const detail = this.props.task
        const pendingMembers = _.filter(detail.members, { status: TEAM_USER_STATUS.PENDING })
        const isTaskOwner = this.isTaskOwner()
        const canWithdraw = (taskCandidateId) => {
            const candidate = _.find(pendingMembers, { _id: taskCandidateId })
            return candidate.user._id === this.props.currentUserId
        }

        const actionRenderer = (candidate) => {
            return (
                <div className="text-right">
                    {(isTaskOwner || canWithdraw(candidate._id)) && (
                        <span>
                            <Button className="btn-approve" size="small" onClick={this.showApplyingFormModal.bind(this, candidate)}>{I18N.get('project.detail.view')}</Button>
                        </span>
                    )}
                    {canWithdraw(candidate._id) && (
                        <span>
                            <Button className="btn-remove" size="small" onClick={this.withdrawPassenger.bind(this, candidate._id)}>{I18N.get('project.detail.withdraw_application')}</Button>
                        </span>
                    )}
                    {isTaskOwner && (
                        <span>
                            <Button className="btn-approve" size="small" onClick={this.approvePassenger.bind(this, candidate._id)}>{I18N.get('project.detail.approve')}</Button>
                            <Button className="btn-remove" size="small" onClick={this.rejectPassenger.bind(this, candidate._id)}>{I18N.get('project.detail.disapprove')}</Button>
                        </span>
                    )}
                </div>
            )
        }

        const columns = [{
            title: 'Name',
            key: 'name',
            render: candidate => {
                return (
                    <div key={candidate._id}>
                        <Avatar className="gap-right" src={candidate.user.profile.avatar} />
                        <a className="row-name-link" onClick={this.linkProfileInfo.bind(this, candidate.user)}>
                            {this.getUserNameWithFallback(candidate.user)}</a>
                    </div>)
            }
        }, {
            title: 'Action',
            key: 'action',
            render: actionRenderer
        }]

        return (
            <Table
                // loading={this.props.loading}
                className="no-borders headerless"
                dataSource={pendingMembers}
                columns={columns}
                bordered={false}
                rowKey="_id"
                pagination={false}>
            </Table>
        )
    }

    isTaskMember() {
        return _.find(this.props.task.members, (member) => {
            if (member.user) {
                return member.user._id === this.props.currentUserId &&
                    member.status === TEAM_USER_STATUS.NORMAL
            }
        })
    }

    hasApplied() {
        return _.find(this.props.task.members, (member) => {
            return member.user._id === this.props.currentUserId &&
                member.status === TEAM_USER_STATUS.PENDING
        })
    }

    approvePassenger(taskCandidateId) {
        this.props.acceptCandidateCt(taskCandidateId)
    }

    rejectPassenger(taskCandidateId) {
        this.props.rejectCandidateCt(taskCandidateId)
    }

    withdrawPassenger(taskCandidateId) {
        this.setState({passenger: null})
        this.props.withdrawCandidateCt(taskCandidateId)
    }

    handleSubmit(e) {
        e.preventDefault()

        if (!this.props.is_login) {
            return this.props.history.push('/login')
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.addCandidatePassenger({
                        taskId: this.props.task._id,
                        userId: this.props.currentUserId,
                        applyMsg: values.applyMsg,
                        role: TEAM_ROLE.CUSTOMER,
                        phoneNumber: values.phoneNumber,
                        seat: this.state.showInputSeat ? values.seat : 0,
                        startAddress: values.startAddress,
                        endAddress: values.endAddress,
                        startAddressPlaceId: this.state.startAddressPlaceId,
                        endAddressPlaceId: this.state.endAddressPlaceId
                    }).then(() => {
                        this.setState({
                            showApplyingFormModal: false,
                            passenger: null
                        })
                        message.success('Yêu cầu của bạn đã được gửi!')
                    })
            }
        })
    }

    getFormItemLayout() {
        return {
            colon: false,
            labelCol: {
                xs: {span: 12},
                sm: {span: 3}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 21}
            }
        }
    }

    showApplyingFormModal(passenger) {
        this.setState({
            passenger: passenger,
            showApplyingFormModal: true,
        })
    }

    hiddenApplyingFormModal() {
        this.setState({
            showApplyingFormModal: false,
            passenger: null
        })
    }

    rederFormApplication() {
        return (
            <Modal
                className="form-application-modal"
                visible={!!this.state.showApplyingFormModal}
                onCancel={this.hiddenApplyingFormModal.bind(this)}
                footer={null}>
                {this.getApplicationForm()}
            </Modal>
        )
    }

    onSelectStartAddress(startAddress, startAddressPlaceId) {
        this.setState({startAddress, startAddressPlaceId});
    }

    onSelectEndAddress(endAddress, endAddressPlaceId) {
        this.setState({endAddress, endAddressPlaceId});
    }

    getApplicationForm() {
        const detail = this.state.passenger ? this.state.passenger : this.props.task

        const {getFieldDecorator} = this.props.form
        const applyMsg_fn = getFieldDecorator('applyMsg', {
            rules: [],
            initialValue: detail.applyMsg || ''
        })
        const applyMsg_el = (
            <Input.TextArea rows={3} className="team-application" disabled={this.props.loading || this.state.passenger}
                placeholder={I18N.get('project.detail.tell_us_why_join')}
                onPressEnter={this.handleSubmit.bind(this)}
            />
        )

        const phoneNumber_fn = getFieldDecorator('phoneNumber', {
            rules: [{required: true, message: 'Vui lòng nhập số điện thoại'}],
            initialValue: detail.phoneNumber || this.props.phoneNumber
        })
        const phoneNumber_el = (
            <Input disabled={this.props.loading || this.state.passenger}
                placeholder="Số điện thoại liên hệ"
                prefix={<Icon type="phone" style={{ fontSize: '14px', color: '#08c' }} />}
                // onPressEnter={this.handleSubmit.bind(this)}
            />
        )

        const startAddress_fn = getFieldDecorator('startAddress', {
            rules: [{required: true, message: 'Vui lòng nhập điểm bắt xe'}],
            initialValue: detail.startAddress
        })
        const startAddress_el = (
            <InputPlaces onChange={this.onSelectStartAddress.bind(this)} disabled={this.props.loading || this.state.passenger}
                placeholder="Điểm bắt xe"
                prefix={<Icon type="environment" style={{ fontSize: '16px', color: '#08c' }} />}
                // onPressEnter={this.handleSubmit.bind(this)}
            />
        )

        const endAddress_fn = getFieldDecorator('endAddress', {
            rules: [
                {required: true, message: 'Vui lòng nhập điểm đến'}
            ],
            initialValue: detail.endAddress
        })

        const endAddress_el = (
            <InputPlaces onChange={this.onSelectEndAddress.bind(this)} disabled={this.props.loading || this.state.passenger}
                placeholder="Điểm đến"
                prefix={<Icon type="environment" style={{ fontSize: '16px', color: '#f59425' }} />}
            />
        )

        const seat_fn = getFieldDecorator('seat', {
            rules: [{required: true, message: 'Vui lòng nhập số ghế'}],
            initialValue: detail.seat || 1
        })
        const seat_el = (
            <InputNumber min={1} disabled={this.props.loading || this.state.passenger} />
        )

        const role_fn = getFieldDecorator('role', {
            rules: [],
            initialValue: TEAM_ROLE.CUSTOMER
        });
        const role_el = (
            <RadioGroup onChange={this.onChangeRole.bind(this)}>
                <Radio key={TEAM_ROLE.CUSTOMER} value={TEAM_ROLE.CUSTOMER}>
                    Đi Cùng
                </Radio>
                {this.props.task.allowShip && <Radio key={TEAM_ROLE.SHIP} value={TEAM_ROLE.SHIP}>
                    Ship Đồ
                </Radio>}
            </RadioGroup>
        )

        const applyMsgPanel = applyMsg_fn(applyMsg_el)
        const phoneNumber = phoneNumber_fn(phoneNumber_el)
        const role = role_fn(role_el)
        const seat = seat_fn(seat_el)
        const startAddress = startAddress_fn(startAddress_el)
        const endAddress = endAddress_fn(endAddress_el)
        const formItemLayout = this.getFormItemLayout()
        let username

        if (this.state.passenger) {
            username = detail.user.profile.firstName ? `${detail.user.profile.firstName} ${detail.user.profile.lastName}` : detail.user.username
        }

        return (
            <Form className="form-application" onSubmit={this.handleSubmit.bind(this)}>
                <Form.Item className="item-request-margin">
                    <h3 className="no-margin title with-gizmo">{username} Tham gia hành trình</h3>
                </Form.Item>
                <Form.Item className="item-request-margin">
                    {startAddress}
                </Form.Item>
                <Form.Item className="item-request-margin">
                    {endAddress}
                </Form.Item>
                <Form.Item className="item-request-margin">
                    {seat} Chỗ
                </Form.Item>
                <Form.Item className="item-request-margin">
                    {phoneNumber}
                </Form.Item>
                {/*<Form.Item className="item-request-margin">
                    {applyMsgPanel}
                </Form.Item>*/}
                <Button loading={this.props.loading} className="d_btn pull-left" onClick={() => this.setState({ showApplyingFormModal: false, passenger: null })}>
                    {I18N.get('.cancel')}
                </Button>
                {!this.state.passenger && <Button loading={this.props.loading} disabled={this.state.passenger} className="d_btn pull-right" type="primary" htmlType="submit">
                    Gửi yêu cầu
                </Button>}
                <div class="clearfix"/>
            </Form>
        )
    }

    setApplying() {
        if (!this.props.is_login) {
            return this.props.toggleRegisterLoginModal(true)
        }

        this.setState({
            showApplyingFormModal: true
        })
    }

    async leaveTeam() {
        const member = _.find(this.props.task.members, (member) => {
            return member.user._id === this.props.currentUserId &&
                member.status === TEAM_USER_STATUS.NORMAL
        })

        if (member) {
            await this.props.withdrawCandidateCt(member._id)
            this.props.history.push('/profile/journeys-passenger')
        }
    }

    getMainActions() {
        const isTaskMember = this.isTaskMember()
        const hasApplied = this.hasApplied()
        const mainActionButton = isTaskMember
            ? (
                <Popconfirm title={I18N.get('project.detail.popup.leave_question')} okText="Yes" cancelText="No"
                    onConfirm={this.leaveTeam.bind(this)}>
                    <Button type="primary" className="join-passenger" loading={this.props.loading}>
                        {I18N.get('project.detail.popup.leave_team')}
                    </Button>
                </Popconfirm>
            )
            : (
                <Button className="join-passenger" type="primary" disabled={hasApplied} onClick={this.setApplying.bind(this)}>
                    {hasApplied
                        ? I18N.get('project.detail.popup.applied')
                        : I18N.get('project.detail.popup.join_team')
                    }
                </Button>
            )

        return mainActionButton
    }

    ord_render() {
        const detail = this.props.task
        const loading = _.isEmpty(detail)
        const isTaskOwner = this.props.task.createdBy &&
            (this.props.task.createdBy._id === this.props.currentUserId)

        return (
            <div className="c_Project c_Detail">
                { loading
                    ? (
                        <div className="full-width full-height valign-wrapper halign-wrapper">
                            <Spin className="loading-spinner" />
                        </div>
                    )
                    : (
                        <div className="detail-container">
                            {this.getImageCarousel()}
                            {this.renderHeader()}
                            {this.props.task.status === TASK_STATUS.PENDING && this.renderAssignmentInfo()}
                            {this.renderMeta()}

                            {/*
                            * Apply Button
                            * - this may be unintuitive but we should always show the button,
                            *   you can always apply as a team or user
                            * unless you've exhausted all the teams, but even then we can inform
                            *   the user of this in a better way than hiding
                            */}
                            {this.props.page !== 'LEADER' && !this.props.is_admin && detail.status !== TASK_CANDIDATE_STATUS.APPROVED &&
                                !isTaskOwner && this.renderApplyButton(isTaskOwner)}

                            {(this.getCurrentContributorsData().length && !this.state.applying)
                                ? this.renderContributors()
                                : ''}

                            {/*
                            * Pending Bids / Applications - only show if CREATED/PENDING
                            */}
                            {detail.status !== TASK_CANDIDATE_STATUS.APPROVED && !this.state.applying && this.renderPendingCandidates()}

                            {this.state.applying && detail.allowShare && this.getApplicationForm()}

                            {!this.state.applying && detail.allowShare &&
                                <Row className="contributors">
                                    <h3 className="no-margin align-left with-gizmo">{I18N.get('project.detail.current_members')}</h3>
                                    {this.renderCurrentContributors()}
                                </Row>
                            }

                            {!this.state.applying && detail.allowShare &&
                                <Row className="applications">
                                    <h3 className="no-margin with-gizmo">{I18N.get('project.detail.pending_applications')}</h3>
                                    {this.renderCurrentApplicants()}
                                </Row>
                            }

                            {!this.state.applying &&
                                <Row>
                                    <br/>
                                    <Comments type="task" canPost={true}
                                        canSubscribe={!isTaskOwner} model={this.props.taskId}
                                        returnUrl={`/journey-passenger/${this.props.taskId}`}
                                    />
                                </Row>
                            }
                        </div>
                    )
                }
                {this.renderApplicationStartModal()}
                {this.renderViewApplicationModal()}
                {this.rederFormApplication()}
                <Modal
                    className="profile-overview-popup-modal"
                    visible={!!this.state.showUserInfo}
                    onCancel={this.handleCancelProfilePopup.bind(this)}
                    footer={null}>
                    { this.state.showUserInfo &&
                        <ProfilePopup showUserInfo={this.state.showUserInfo}/>
                    }
                </Modal>
            </div>
        )
    }

    handleCancelProfilePopup() {
        this.setState({
            showUserInfo: null
        })
    }


    renderViewApplicationModal() {
        return (
            <Modal
                className="project-detail-nobar no-modal-padding"
                visible={this.state.showAppModal}
                onOk={this.handleAppModalOk}
                onCancel={this.handleAppModalCancel}
                footer={null}
                width="70%"
            >
                <ProjectApplication applicantId={this.state.projectCandidateId}/>
            </Modal>
        )
    }

    renderApplyButton(isTaskOwner) {
        const detail = this.props.task

        // if not bidding check if there is already an approved
        if (!detail.bidding && _.find(detail.candidates,
            (candidate) => candidate.status === TASK_CANDIDATE_STATUS.APPROVED)) {
            return
        }

        // for bidding we must be in PENDING
        if (detail.bidding && _.indexOf([TASK_STATUS.CREATED, TASK_STATUS.PENDING], detail.status) < 0) {
            return
        }

        return <Row className="actions">
            <Button className="join-driver" onClick={() => this.showApplicationStartModal()}
                disabled={!this.canApply()}>
                {detail.bidding
                    ? 'Tài xế đấu giá cước'
                    : 'Tài xế nhận hành trình'
                }
            </Button>&nbsp;
            {!isTaskOwner && detail.allowShare && this.getMainActions()}
        </Row>
    }

    renderApplicationStartModal() {
        return (
            <Modal
                className="project-detail-nobar"
                visible={this.state.showApplicationStartModal}
                onOk={this.handleApplicationStartModalOk.bind(this)}
                onCancel={this.handleApplicationStartModalCancel.bind(this)}
                footer={null}
                width="70%"
            >
                {this.state.showApplicationStartModal &&
                    <ProjectApplicationStart task={this.props.task}
                        finisher={this.handleApplicationStartModalOk.bind(this)} />
                }
            </Modal>
        )
    }

    /**
     * Render pending bids or applications
     *
     * BIDDING - we show for CREATED/PENDING status only
     *
     * For Admins - only admins can create tasks/projects for bidding
     * - they can see all applications (user/team), we assume they are never a bidder
     *
     * For everyone else they can only see their own bids and the total number of bids
     *
     *
     * PROJECT - we show if APPROVED, but no one is selected yet
     *
     * We can see other people who applied
     */
    renderPendingCandidates() {
        const currentUserId = this.props.currentUserId
        const detail = this.props.task

        // status checks
        if (detail.bidding && _.indexOf([TASK_STATUS.CREATED,
                TASK_STATUS.PENDING, TASK_STATUS.APPROVED], detail.status) < 0) {
            return ''
        }

        if (!detail.bidding && _.find(detail.candidates,
            (candidate) => candidate.status === TASK_CANDIDATE_STATUS.APPROVED)) {
            return ''
        }


        let pendingCandidates = this.getPendingCandidates()
        let pendingCandidatesCnt = pendingCandidates.length

        // only show current user's bids if it's bidding - for projects with a set reward we can show them
        if (!this.props.is_admin && detail.bidding && detail.createdBy._id !== currentUserId) {
            pendingCandidates = _.filter(pendingCandidates, (candidate) => {
                if (candidate.user && candidate.type === TASK_CANDIDATE_TYPE.USER &&
                    candidate.user._id === currentUserId) {

                    return true

                }

                if (candidate.type === TASK_CANDIDATE_TYPE.TEAM &&
                    this.loggedInUserBelongsToCandidate(candidate)) {
                    // here we make the assumption that any member of a team can view the team's bid
                    return true
                }
            })
        }

        const title = detail.bidding
            ? this.props.is_admin
                ? 'Tài xế'
                : 'Tài xế'
            : 'Tài xế'
        const bidsLeft = [
            'Hiện tại đang có',
            pendingCandidatesCnt,
            'tài xế đấu giá'
        ].join(' ')

        return <Row className="applications">
            <h3 className="no-margin title with-gizmo">
                {title}
            </h3>

            {pendingCandidates.length && this.renderCandidates(pendingCandidates)}

            {/* this works because we filtered pendingCandidates after we saved the count */}
            {(this.props.page !== 'ADMIN' || !this.props.is_admin) && this.props.task.createdBy !== this.props.currentUserId &&
                detail.bidding && bidsLeft}

            {!detail.bidding && pendingCandidates.length === 0 &&
                <div className="no-data no-info">
                    Chưa có tài xế nào nhận đi
                </div>
            }
        </Row>
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? USER_AVATAR_DEFAULT
            : avatar
    }

    getTeamAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? TEAM_AVATAR_DEFAULT
            : avatar
    }

    getUserNameWithFallback(user) {
        if (_.isEmpty(user.profile.firstName) && _.isEmpty(user.profile.lastName)) {
            return user.username
        }

        return _.trim([user.profile.firstName, user.profile.lastName].join(' '))
    }

    renderCandidates(candidates) {
        let currentContributors = this.getCurrentContributorsData()

        const columns = [{
            title: I18N.get('project.detail.columns.name'),
            key: 'name',
            render: (candidate) => {
                return (
                    <div>
                        {(candidate.type === TASK_CANDIDATE_TYPE.USER) &&
                        <div>
                            <a onClick={this.linkProfileInfo.bind(this, candidate.user)}>
                                <Avatar className={'gap-right ' +
                                    (candidate._id === 'such_fake_id' ? 'avatar-leader' : 'avatar-member')}
                                    src={this.getAvatarWithFallback(candidate.user.profile.avatar)}/>
                                {this.getUserNameWithFallback(candidate.user)}
                            </a>
                            {/*{this.props.task.bidding &&
                                <span> {candidate.bid && candidate.bid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND
                                </span>
                            }*/}
                        </div>
                        }
                        {(candidate.type === TASK_CANDIDATE_TYPE.TEAM) &&
                        <div>
                            <a onClick={this.linkTeamInfo.bind(this, candidate.team._id)}>
                                <Avatar className="gap-right"
                                    src={this.getTeamAvatarWithFallback(!_.isEmpty(candidate.team.pictures) &&
                                        candidate.team.pictures[0].url)} />
                                {candidate.team.name}
                                {this.loggedInUserOwnerOfCandidate(candidate) ?
                                    <span className="no-info"> ({I18N.get('task.owner')})</span> :
                                    <span className="no-info"> ({I18N.get('role.member')})</span>
                                }
                            </a>
                        </div>
                        }
                    </div>)
            }
        }, {
            title: I18N.get('project.detail.columns.action'),
            key: 'action',
            render: (candidate) => {
                if (!_.isEmpty(currentContributors)) {
                    return null
                }

                return (
                    <div className="text-right">
                        {this.props.loading
                            ? <Spin/>
                            : <div>
                                {(this.props.page === 'ADMIN' || this.isTaskOwner() || this.props.is_admin ||
                                    this.loggedInUserBelongsToCandidate(candidate)) && (
                                    <span>
                                        <Button className="btn-approve" size="small" onClick={this.showAppModal.bind(this, candidate._id)}>{this.isTaskOwner() ? 'Xem' : this.props.task.bidding ? 'Đặt giá' : 'Xem'}
                                        </Button>
                                    </span>
                                )}
                                {this.loggedInUserOwnerOfCandidate(candidate) && (
                                    <span>
                                        <Button className="btn-remove" size="small" onClick={this.withdrawApplication.bind(this, candidate._id)}>
                                            {I18N.get('project.detail.withdraw_application')}
                                        </Button>
                                    </span>)
                                }
                                {((this.isTaskOwner() || this.props.is_admin) && _.isEmpty(currentContributors)) &&
                                    <span className="inline-block">
                                        {candidate.status !== TASK_STATUS.APPROVED &&
                                            <span>
                                                <Button className="btn-approve" size="small" onClick={this.approveUser.bind(this, candidate._id)}>
                                                    {I18N.get('project.detail.approve')}
                                                </Button>
                                            </span>
                                        }
                                        <Button className="btn-remove" size="small" onClick={this.disapproveUser.bind(this, candidate._id)}>
                                            {I18N.get('project.detail.disapprove')}
                                        </Button>
                                    </span>
                                }
                            </div>
                        }
                    </div>
                )
            }
        }]

        return (
            <Table
                className="no-borders headerless"
                dataSource={candidates}
                columns={columns}
                bordered={false}
                pagination={false}
                rowKey="_id"
            />
        )
    }

    /**
     * For bidding tasks, contributors are the actual assigned user
     */
    renderContributors() {
        let currentContributors = this.getCurrentContributorsData()

        const columns = [{
            title: I18N.get('project.detail.columns.name'),
            key: 'name',
            render: (candidate) => {
                return (
                    <div>
                        {(candidate.type === TASK_CANDIDATE_TYPE.USER) &&
                        <div>
                            <a onClick={this.linkProfileInfo.bind(this, candidate.user)}>
                                <Avatar className={'gap-right ' +
                                    (candidate._id === 'such_fake_id' ? 'avatar-leader' : 'avatar-member')}
                                        src={this.getAvatarWithFallback(candidate.user.profile.avatar)}/>
                                {this.getUserNameWithFallback(candidate.user)}
                            </a>
                            {/*{(this.isTaskOwner() || this.props.is_admin || this.loggedInUserBelongsToCandidate(candidate)) && this.props.task.bidding &&
                                <span> {candidate.bid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND
                                </span>
                            }*/}
                        </div>
                        }
                        {(candidate.type === TASK_CANDIDATE_TYPE.TEAM) &&
                        <div>
                            <a onClick={this.linkTeamInfo.bind(this, candidate.team._id)}>
                                <Avatar className="gap-right"
                                    src={this.getAvatarWithFallback(!_.isEmpty(candidate.team.pictures) &&
                                        candidate.team.pictures[0].url)} />
                                {candidate.team.name}
                            </a>
                        </div>
                        }
                    </div>)
            }
        }, {
            title: I18N.get('project.detail.columns.action'),
            key: 'action',
            render: (candidate) => {
                return (
                    <div className="text-right">
                        {(this.isTaskOwner() || this.props.is_admin ||
                            this.loggedInUserBelongsToCandidate(candidate)) && (
                            <span>
                                <Button size="small" className="btn-approve" onClick={this.showAppModal.bind(this, candidate._id)}>
                                    {I18N.get('project.detail.view')}
                                </Button>
                            </span>
                        )}
                        {this.loggedInUserBelongsToCandidate(candidate) && (<span>
                            <Button size="small" className="btn-remove" onClick={this.withdrawApplication.bind(this, candidate._id)}>
                                {I18N.get('project.detail.withdraw_application')}
                            </Button>
                        </span>)}
                        {(this.isTaskOwner() || this.props.is_admin) &&
                            <span>
                            <Button size="small" className="btn-remove" onClick={this.removeUser.bind(this, candidate._id)}>
                                {I18N.get('project.detail.remove')}
                            </Button>
                            </span>
                        }
                    </div>
                )
            }
        }]

        return <Row className="contributors">
            <h3 className="no-margin align-left with-gizmo">
                Tài xế được chọn
            </h3>

            <Table
                className="no-borders headerless"
                dataSource={currentContributors}
                columns={columns}
                bordered={false}
                pagination={false}
                rowKey="_id"
            />
        </Row>
    }

    /*
    ****************************************************************************************************************
    * Helpers
    ****************************************************************************************************************
     */
    isUnapproved() {
        return (this.props.task.status === TASK_STATUS.CREATED ||
            this.props.task.status === TASK_STATUS.PENDING)
    }

    loggedInUserBelongsToCandidate(candidate) {
        const loggedInUserId = this.props.currentUserId
        if (candidate.user &&  candidate.type === TASK_CANDIDATE_TYPE.USER &&
            candidate.user._id === loggedInUserId) {
            return true
        }

        if (candidate.type === TASK_CANDIDATE_TYPE.TEAM &&
            _.find(candidate.team.members, {user: loggedInUserId})) {
            return true
        }
    }

    /**
     * Is the logged in user the passed in candidate
     * or the owner of the team
     *
     * @param candidate
     * @return Boolean
     */
    loggedInUserOwnerOfCandidate(candidate) {
        const loggedInUserId = this.props.currentUserId
        if (candidate.user && candidate.type === TASK_CANDIDATE_TYPE.USER &&
            candidate.user._id === loggedInUserId) {
            return true
        }

        if (candidate.type === TASK_CANDIDATE_TYPE.TEAM &&
            candidate.team.owner._id === loggedInUserId){
            return true
        }
    }

    // check if logged in user has applied by themselves
    hasAppliedBySelf() {
        const loggedInUserId = this.props.currentUserId
        const pendingCandidates = this.getPendingCandidates()
        return !!_.find(pendingCandidates, (candidate) =>
            candidate.type === TASK_CANDIDATE_TYPE.USER && candidate.user._id === loggedInUserId)
    }

    // check if logged in user has applied by the passed in team
    hasAppliedByTeam(team) {
        const pendingCandidates = this.getPendingCandidates()
        return !!_.find(pendingCandidates, (candidate) => {
            return (candidate.type === TASK_CANDIDATE_TYPE.TEAM &&
                candidate.team._id === team._id)
        })
    }

    /*
    ****************************************************************************************************************
    * Modals
    ****************************************************************************************************************
     */
    showAppModal = (projectCandidateId) => {
        this.setState({
            showAppModal: true,
            projectCandidateId
        })
    }

    handleAppModalOk = (e) => {
        this.setState({
            showAppModal: false
        })
    }

    handleAppModalCancel = (e) => {
        this.setState({
            showAppModal: false
        })
    }

    getCurrency() {
        return 'USD'
    }

    getReward() {
        if (!this.props.task.reward) {
            return null
        }

        return this.props.task.reward
            ? this.props.task.reward.usd / 100
            : null
    }

    getRewardElaPerUsd() {
        return this.props.task.reward && this.props.task.reward.elaPerUsd
    }

    getRewardFormatted() {
        const epu = this.getRewardElaPerUsd()
        const suffix = epu ? ` (@${epu} ELA/USD)` : ''
        return this.getReward() && `${this.getReward()} ${this.getCurrency()}${suffix}`
    }

    getBudgetExplanation() {
        return (
            <Popover content={I18N.get('task.budget.explain')}>
                <Icon className="help-icon" type="question-circle-o"/>
            </Popover>
        )
    }

    getRewardExplanation() {
        return (
            <Popover content={I18N.get('task.reward.explain')}>
                <Icon className="help-icon" type="question-circle-o"/>
            </Popover>
        )
    }

    getBudget() {
        if (!this.props.task.rewardUpfront) {
            return null
        }

        return this.props.task.rewardUpfront
            ? this.props.task.rewardUpfront.usd / 100
            : null
    }

    getBudgetElaPerUsd() {
        return this.props.task.rewardUpfront && this.props.task.rewardUpfront.elaPerUsd
    }

    getBudgetFormatted() {
        const epu = this.getBudgetElaPerUsd()
        const suffix = epu ? ` (@${epu} ELA/USD)` : ''
        return this.getBudget() && `${this.getBudget()} ${this.getCurrency()}${suffix}`
    }

    getCommunityDisp() {
        let str = ''
        if (this.props.task.communityParent) {
            str += this.props.task.communityParent.name + '/'
        }
        if (this.props.task.community) {
            str += this.props.task.community.name
        }

        return str
    }

    isTaskOwner() {
        return this.props.task.createdBy._id === this.props.currentUserId
    }

    linkProfileInfo(user) {
        this.setState({
            showUserInfo: user
        })
    }

    linkTeamInfo(userId) {
        this.props.history.push(`/journey-driver/${userId}`)
    }

    async approveUser(taskCandidateId) {
        await this.props.acceptCandidate(taskCandidateId);
        this.props.getTaskDetail(this.props.taskId)
    }

    disapproveUser(taskCandidateId) {
        this.props.rejectCandidate(taskCandidateId);
    }

    async withdrawApplication(taskCandidateId) {
        await this.props.withdrawCandidate(taskCandidateId);
        this.props.getTaskDetail(this.props.taskId)
    }

    async removeUser(taskCandidateId) {
        await this.props.rejectCandidate(taskCandidateId)
        this.props.getTaskDetail(this.props.taskId)
    }

    removeUserByUserId(userId) {
        const candidate = _.find(this.props.task.candidates, (candidate) =>
            candidate.user._id === userId && candidate.status !== TASK_CANDIDATE_STATUS.REJECTED)
        if (!candidate) {
            return false
        }
        return this.withdrawApplication(candidate._id)
    }

    getImageCarousel() {
        const IMAGE_SIZE = 150

        const details = this.props.task;
        const carouselImages = []

        if (details.thumbnail) {
            carouselImages.push(<img width={IMAGE_SIZE}
                src={details.thumbnail} key="main"/>)
        }

        for (let i of details.pictures) {
            carouselImages.push(<img width={IMAGE_SIZE}
                src={i.url} key={i}/>)
        }

        if (carouselImages.length === 0) {
            carouselImages.push(<img width={IMAGE_SIZE}
                src={'/assets/images/ava-journey.png'} key={0} />);
        }

        return (
            <div className="carousel-container">
                <div className="pictures-container">
                    <Carousel autoplay>
                        {carouselImages}
                    </Carousel>
                </div>
            </div>
        )
    }

    getCurrentContributorsData() {
        const detail = this.props.task
        return _.filter(detail.candidates, { status: TASK_CANDIDATE_STATUS.APPROVED });
    }

    getPendingCandidates() {
        const detail = this.props.task
        return _.filter(detail.candidates, { status: TASK_CANDIDATE_STATUS.PENDING });
    }

    canApply() {
        return !this.hasAppliedBySelf() &&
            !_.some(this.props.ownedTeams, (team) => this.hasAppliedByTeam(team))
    }

    showApplicationStartModal() {
        if (!this.props.is_login) {
            return this.props.toggleRegisterLoginModal(true)
        }

        if (!this.props.isDriver && !this.props.is_admin) {
            return message.error('Bạn cần cập nhật thông tin tài xế trong profile để có thể nhận hành trình')
        }

        this.setState({
            showApplicationStartModal: true
        })
    }

    handleApplicationStartModalOk = (e) => {
        this.setState({
            showApplicationStartModal: false
        })
    }

    handleApplicationStartModalCancel() {
        this.setState({
            showApplicationStartModal: false
        })
    }
}

export default Form.create()(C)
