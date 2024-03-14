import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import moment from 'moment'
import _ from 'lodash'
import { Col, Row, message, Input, Avatar, InputNumber, Select } from 'antd'
import {TASK_CATEGORY, TASK_TYPE, TASK_STATUS, TASK_CANDIDATE_TYPE, TASK_CANDIDATE_STATUS, USER_AVATAR_DEFAULT} from '@/constant'
import Comments from '@/module/common/comments/Container'
import './style.scss'
import I18N from '@/I18N'

const { TextArea } = Input;
const Option = Select.Option;
const dateTimeFormat = 'MMM D, YYYY - h:mma (Z [GMT])'

export default class extends BaseComponent {
    ord_states() {
        return {
        }
    }

    async componentDidMount() {
        if (this.props.currentUserId) {
            await this.props.getTeams({
                owner: this.props.currentUserId
            })
        }
    }

    componentWillUnmount() {
        this.props.resetTeams();
    }

    ord_render () {
        return this.renderMain()
    }

    isTaskOwner() {
        return this.props.detail.createdBy._id === this.props.userId
    }

    getApplicant () {
        return _.find(this.props.detail.candidates, { _id: this.props.applicantId })
    }

    handleApplyWithChange(teamId) {
        const solo = teamId === '$me'

        this.props.updateApplication(this.props.match.params.taskId, {
            taskCandidateId: this.props.applicantId,
            user: solo ? this.props.currentUserId : null,
            team: !solo ? teamId : null
        })
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? USER_AVATAR_DEFAULT
            : avatar
    }

    getSelectDropdown() {
        const applicant = this.getApplicant()
        const userTeams = this.props.ownedTeams
        const defaultValue = applicant && applicant.type === TASK_CANDIDATE_TYPE.USER
            ? '$me'
            : applicant && applicant.team && applicant.team._id

        const elem = [];
        elem.push(
            <Option value="$me" key="$me">
                {I18N.get('task.soloApply')} (Solo)
                <Avatar size="small" src={this.getAvatarWithFallback(this.props.currentUserAvatar)}
                    className="pull-right"/>
            </Option>)

        if (userTeams) {
            _.forEach(userTeams, (team) => {
                elem.push(
                    <Option key={team._id} value={team._id}>
                        {I18N.get('task.teamApply')} ({team.name})
                        {!_.isEmpty(team.pictures)
                            ? <Avatar size="small" src={this.getAvatarWithFallback(team.pictures[0].thumbUrl)}
                                className="pull-right"/>
                            : <Avatar size="small" src={this.getAvatarWithFallback()} className="pull-right"/>
                        }
                    </Option>)
            })
        }
        return (
            <Select
                onChange={(value) => this.handleApplyWithChange(value)}
                className="apply-type-select cr-input"
                defaultValue={defaultValue}>
                {elem}
            </Select>
        )
    }

    renderMain () {
        const applicant = this.getApplicant()
        if (!applicant || !this.props.ownedTeams) {
            return ''
        }
        const appliedDate = moment(applicant.createdAt).format('DD-MM-YYYY')
        return (
            <div className="public">
                <div className="gridCol main-area">
                    <div className="application-col">
                        <h3 className="header-text with-gizmo">Đặt Giá Cước</h3>
                        <div className="application-container">Gửi yêu cầu ngày
                            <span className="application-date"> {appliedDate}</span>
                        </div>
                        { this.props.detail.bidding &&
                            <div className="bid-container">
                                { !this.isTaskOwner() && _.indexOf(['PENDING', 'CREATED'], this.props.detail.status) >= 0 && (applicant.type !== TASK_CANDIDATE_TYPE.TEAM || applicant.team.owner._id === this.props.userId)
                                    ? <div>
                                        <span>Điều chỉnh giá cước đã đặt (VND) </span>
                                        <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={_.debounce((value) => this.changeBid(value), 2000)}
                                            defaultValue={applicant.bid}/>
                                    </div>
                                    : <div>
                                        <span>
                                            Giá đặt: <b>{applicant.bid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b> VND
                                        </span>
                                    </div>
                                }
                            </div>
                        }
                        <div>
                            <div className="task-reason">Lời nhắn</div>
                            <div className="task-reason-text-area">
                                <p>{applicant.applyMsg}</p>
                            </div>
                        </div>
                    </div>
                    <div className="comments-col">
                        <Comments
                            headlines={false}
                            type="taskCandidate"
                            reduxType="task"
                            canPost={true}
                            model={applicant}
                            detailReducer={(detail) => _.find(detail.candidates,
                                { _id: this.props.applicantId })}
                            returnUrl={`/journey-passenger/${this.props.detail._id}`}
                        />
                    </div>
                </div>
            </div>
        )
    }

    async changeBid(bid) {
        await this.props.updateApplication(this.props.detail._id, {
            taskCandidateId: this.props.applicantId,
            bid
        })

        message.success('Cập nhật đặt giá thành công')
    }

    showAttachment() {
        const applicant = this.getApplicant()
        const {attachment, attachmentFilename} = applicant

        return attachment
            ? <h5><a href={attachment} target="_blank">{attachmentFilename}</a></h5>
            : <h5>{I18N.get('project.detail.no_attachments')}</h5>
    }

    linkUserDetail(user) {
        this.props.history.push(`/member/${user._id}`)
    }

    async withdrawApplication() {
        // const taskId = this.props.task._id
        // this.props.pullCandidate(taskId, tcId).then(() => {
        //     const prefix = this.props.page === 'LEADER'
        //         ? '/profile' : ''
        //     this.props.history.push(`${prefix}/journey-passenger/${this.props.task._id}`)
        // })
    }

    async rejectApplication() {

    }
}
