import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {
    Form,
    Icon,
    Input,
    InputNumber,
    Button,
    Checkbox,
    Radio,
    Select,
    message,
    Row,
    Col,
    Upload,
    Cascader,
    Divider,
    TreeSelect,
    Modal
} from 'antd'
import config from '@/config'
import { MIN_LENGTH_PASSWORD } from '@/config/constant'
import TimezonePicker from 'react-timezone'
import I18N from '@/I18N'
import {upload_file} from '@/util'
import './style.scss'
import InputPlaces from '@/module/page/shared/InputPlaces/Container'
import {TASK_CATEGORY, TASK_TYPE, TASK_STATUS, USER_GENDER, USER_SKILLSET, USER_PROFESSION} from '@/constant'

const FormItem = Form.Item
const TextArea = Input.TextArea
const RadioGroup = Radio.Group

class C extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            communityTrees: [],
            section: 1,
            fileListPassport: [],
            previewVisiblePassport: false,
            previewImagePassport: '',
            fileListLicense: props.user.car && props.user.car.driverLicenseImages || [],
            previewVisibleLicense: false,
            previewImageLicense: '',
            carAreaPlaceId: null,
            fileList: props.user.car && props.user.car.carImages || [],
        }

        this.pictureUrlLookupsPassport = []
        _.each(this.state.fileListPassport, (file) => {
            this.pictureUrlLookupsPassport[file.uid] = file.url
        })

        this.pictureUrlLookupsLicense = []
        _.each(this.state.fileListLicense, (file) => {
            this.pictureUrlLookupsLicense[file.uid] = file.url
        })

        this.pictureUrlLookups = []
        _.each(this.state.fileList, (file) => {
            this.pictureUrlLookups[file.uid] = file.url
        })
    }

    onSelectCarArea(startAddress, carAreaPlaceId) {
        this.setState({startAddress, carAreaPlaceId});
    }

    handleSubmit (e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let carImages = this.state.fileList || []

                _.each(carImages, (pictureFile) => {
                    if (this.pictureUrlLookups[pictureFile.uid]) {
                        pictureFile.url = this.pictureUrlLookups[pictureFile.uid]
                        delete pictureFile.thumbUrl
                    }
                })

                values.carAreaPlaceId = this.state.carAreaPlaceId

                this.props.updateUser(values, carImages, this.state).then(() => {
                    this.props.getCurrentUser()
                    this.props.switchEditMode()
                    message.success(I18N.get('profile.thanksForCompleting'))
                });
            }
        })
    }

    checkEmail(rule, value, callback, source, options) {
        const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if (this.props.is_admin && value && emailRegex.test(value) && this.props.user.email !== value) {
            this.props.checkEmail(value).then((isExist) => {
                if (isExist) {
                    callback(I18N.get('register.error.duplicate_email'))
                } else {
                    callback()
                }
            })
        } else {
            callback()
        }
    }

    compareToFirstPassword(rule, value, callback) {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback(I18N.get('register.error.passwords')) // Two passwords you entered do not match'
        } else {
            callback()
        }
    }

    validateToNextPassword(rule, value, callback) {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirmPassword'], { force: true })
        }
        if (value && value.length < MIN_LENGTH_PASSWORD) {
            callback(`${I18N.get('register.error.password_length_1')} ${MIN_LENGTH_PASSWORD} ${I18N.get('register.error.password_length_2')}`)
        }
        callback()
    }

    getSkillsets() {
        return _.map(USER_SKILLSET, (skillsets, category) => {
            return {
                title: I18N.get(`user.skillset.group.${category}`),
                value: category,
                key: category,
                children: _.map(_.keys(skillsets).sort(), (skillset) => {
                    return {
                        title: I18N.get(`user.skillset.${skillset}`),
                        value: skillset,
                        key: skillset
                    }
                })
            }
        })
    }

    getProfessions() {
        // Make sure Other is the last entry
        return _.union(_.without(_.keys(USER_PROFESSION).sort(), USER_PROFESSION.OTHER),
            [USER_PROFESSION.OTHER])
    }

    getFormItemLayout() {
        return {
            colon: false,
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        }
    }

    getInputProps () {

        const {getFieldDecorator} = this.props.form
        const user = this.props.user || {}
        user.profile = user.profile || {}

        /*
        ****************************************************************************************
        * General
        ****************************************************************************************
         */
        const username_fn = getFieldDecorator('username', {
            rules: [{required: true, message: I18N.get('from.UserEditForm.username.required')}],
            initialValue: user.username
        })
        const username_el = (
            <Input disabled/>
        )

        const role_fn = getFieldDecorator('role', {
            rules: [{required: true, message: I18N.get('user.edit.form.label_role')}],
            initialValue: user.role
        })
        const role_el = (
            <Select showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder="Role"
                // Fix select dropdowns in modals
                // https://github.com/vazco/uniforms/issues/228
                getPopupContainer={x => {
                    while (x && x.tagName.toLowerCase() !== 'form') {
                        x = x.parentElement;
                    }

                    return x;
                }}>
                {_.entries(config.data.mappingRoleToName).map(([key, val]) => {
                    return <Select.Option key={key} value={key}>
                        {I18N.get(val)}
                    </Select.Option>
                })}
            </Select>
        )

        const rulesEmail = [
            {
                type: 'email', message: I18N.get('register.error.email'),
            }, {
                validator: this.checkEmail.bind(this)
            }
        ]

        if (user.email) {
            rulesEmail.push({
                required: true, message: I18N.get('user.edit.form.label_email')
            })
        }

        const email_fn = getFieldDecorator('email', {
            rules: [rulesEmail],
            initialValue: user.email
        })
        const email_el = (
            <Input />
        )

        const password_fn = getFieldDecorator('password', {
            rules: [{
                required: false, message: I18N.get('register.form.label_password')
            }, {
                validator: this.validateToNextPassword.bind(this)
            }]
        })

        const password_el = (
            <Input type="password" />
        )

        const passwordConfirm_fn = getFieldDecorator('passwordConfirm', {
            rules: [{
                required: false, message: I18N.get('register.form.label_password_confirm')
            }, {
                validator: this.compareToFirstPassword.bind(this)
            }]
        })

        const passwordConfirm_el = (
            <Input type="password" />
        )

        const firstName_fn = getFieldDecorator('firstName', {
            rules: [],
            initialValue: user.profile.firstName
        })
        const firstName_el = (
            <Input />
        )

        const lastName_fn = getFieldDecorator('lastName', {
            rules: [],
            initialValue: user.profile.lastName
        })
        const lastName_el = (
            <Input />
        )

        const gender_fn = getFieldDecorator('gender', {
            rules: [],
            initialValue: user.profile.gender
        });
        const gender_el = (
            <RadioGroup>
                <Radio key={USER_GENDER.MALE} value={USER_GENDER.MALE}>
                    {I18N.get('from.UserEditForm.label.male')}
                </Radio>
                <Radio key={USER_GENDER.FEMALE} value={USER_GENDER.FEMALE}>
                    {I18N.get('from.UserEditForm.label.female')}
                </Radio>
            </RadioGroup>
        )

        const timezone_fn = getFieldDecorator('timezone', {
            rules: [],
            initialValue: user.profile.timezone
        })

        const timezone_el = (
           <TimezonePicker
                className="timezone-picker"
                inputProps={{
                   placeholder: I18N.get('from.UserEditForm.timezone.placeholder')
                }}
            />
        )

        const portfolio_fn = getFieldDecorator('portfolio', {
            rules: [],
            initialValue: user.profile.portfolio
        })

        const portfolio_el = (
            <Input placeholder={I18N.get('profile.portfolio.placeholder')} />
        )

        const bio_fn = getFieldDecorator('bio', {
            rules: [],
            initialValue: user.profile.bio
        })

        const bio_el = (
            <Input.TextArea rows={4} placeholder={I18N.get('profile.skillsDetails.placeholder')} />
        )

        const motto_fn = getFieldDecorator('motto', {
            rules: [],
            initialValue: user.profile.motto
        })

        const motto_el = (
            <Input placeholder={I18N.get('profile.motto.placeholder')}/>
        )

        return {
            // General
            username: username_fn(username_el),
            role: role_fn(role_el),
            email: email_fn(email_el),
            password: password_fn(password_el),
            passwordConfirm: passwordConfirm_fn(passwordConfirm_el),
            firstName: firstName_fn(firstName_el),
            lastName: lastName_fn(lastName_el),
            gender: gender_fn(gender_el),
            timezone: timezone_fn(timezone_el),
        }
    }

    handleCancel() {
        this.setState({ previewVisible: false })
    }

    handlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleFileListChange = ({ fileList }) => this.setState({ fileList })

    handleCancelLicense() {
        this.setState({ previewVisibleLicense: false })
    }

    handlePreviewLicense(file) {
        this.setState({
            previewImageLicense: file.url || file.thumbUrl,
            previewVisibleLicense: true
        })
    }

    handleFileListChangeLicense = ({ fileListLicense }) => this.setState({ fileListLicense })

    handleCancelPassport() {
        this.setState({ previewVisiblePassport: false })
    }

    handlePreviewPassport(file) {
        this.setState({
            previewImagePassport: file.url || file.thumbUrl,
            previewVisiblePassport: true
        })
    }

    handleFileListChangePassport = ({ fileListPassport }) => this.setState({ fileListPassport })

    isCompleteProfileMode() {
        return this.props.completing
    }

    renderHeader() {
        return (
            <div className="uef-header">
                <h3>
                    {this.isCompleteProfileMode()
                        ? I18N.get('profile.completeProfile')
                        : I18N.get('profile.editProfile')
                    }
                </h3>
                {/*<h4>
                    {I18N.get('profile.completeProfile.explanation')}
                </h4>*/}
            </div>
        )
    }

    renderSectionSwitcher() {
        const section = this.state.section

        const sectionGenerator = (index, description) => {
            const activeClass = index === section
                ? 'active'
                : ''

            const doneClass = index < section
                ? 'done'
                : ''

            const fullClass = `uef-section ${activeClass} ${doneClass}`

            return (
                <div className={fullClass} onClick={() => this.setState({ section: index })}>
                    <div className="uef-section-done-marker">
                        <img src="/assets/images/step-done.svg"/>
                    </div>
                    <div className="uef-section-index">
                        {index}
                    </div>
                    <div className="uef-section-description">
                        {description}
                    </div>
                </div>
            )
        }

        return (
            <Row className="uef-switcher">
                <Col md={12} xs={24}>
                    {sectionGenerator(1, 'General')}
                </Col>
                <Col md={12} xs={24}>
                    {sectionGenerator(2, 'Password')}
                </Col>
            </Row>
        )
    }

    renderBasicSection() {
        const p = this.getInputProps()
        const formItemLayout = this.getFormItemLayout()
        const hideClass = this.state.section === 1 ? '' : 'hide'
        const contentClass = `uef-section-content ${hideClass}`

        return (
            <div className={contentClass}>
                <FormItem label={I18N.get('from.UserEditForm.label.firstName')} {...formItemLayout}>
                    {p.firstName}
                </FormItem>
                <FormItem label={I18N.get('from.UserEditForm.label.lastName')} {...formItemLayout}>
                    {p.lastName}
                </FormItem>
                <FormItem label={I18N.get('1202')} {...formItemLayout}>
                    {p.email}
                </FormItem>
                {this.props.is_admin &&
                    <FormItem label={I18N.get('user.edit.form.role')} {...formItemLayout}>
                        {p.role}
                    </FormItem>
                }
                <FormItem label={I18N.get('from.UserEditForm.label.gender')} {...formItemLayout}>
                    {p.gender}
                </FormItem>
            </div>
        )
    }

    renderSkillsetSection() {
        const p = this.getInputProps()
        const formItemLayout = this.getFormItemLayout()
        const hideClass = this.state.section === 2 ? '' : 'hide'
        const contentClass = `uef-section-content ${hideClass}`

        return (
            <div className={contentClass}>
                <FormItem label={I18N.get('from.UserEditForm.label.password')} {...formItemLayout}>
                    {p.password}
                </FormItem>
                <FormItem label={I18N.get('from.UserEditForm.label.confirm')} {...formItemLayout}>
                    {p.passwordConfirm}
                </FormItem>
            </div>
        )
    }

    prevSection() {
        this.setState({
            section: this.state.section - 1
        })
    }

    nextSection() {
        this.setState({
            section: this.state.section + 1
        })
    }

    renderPrevNext() {
        return (
            <div>
                {this.state.section > 1 &&
                    <Button onClick={this.prevSection.bind(this)} loading={this.props.loading}>
                        {I18N.get('profile.previous')}
                    </Button>
                }
                {this.state.section > 3
                    ? this.renderSave()
                    :
                        <Button onClick={this.nextSection.bind(this)} loading={this.props.loading}>
                            {I18N.get(this.state.section === 3
                                ? 'profile.save'
                                : 'profile.next')
                            }
                        </Button>
                }
            </div>
        )
    }

    renderSave() {
        return (
            <Button type="primary" htmlType="submit" loading={this.props.loading}>
                {I18N.get('profile.save')}
            </Button>
        )
    }

    ord_render () {
        const completingClass = this.isCompleteProfileMode()
            ? 'completing'
            : ''
        const className = ['c_userEditFormContainer', completingClass].join(' ')

        return (
            <div className={className}>
                {this.renderHeader()}
                {this.renderSectionSwitcher()}
                <Form onSubmit={this.handleSubmit.bind(this)} className="d_taskCreateForm">
                    {this.renderBasicSection()}
                    {this.renderSkillsetSection()}

                    <FormItem className="uef-button-row">
                        {
                            this.isCompleteProfileMode()
                                ? this.renderPrevNext()
                                : this.renderSave()
                        }
                    </FormItem>
                </Form>
            </div>
        )
    }

}
export default Form.create()(C)
