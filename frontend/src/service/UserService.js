import BaseService from '../model/BaseService'
import SocketService from '@/service/SocketService'
import io from 'socket.io-client'
import _ from 'lodash'
import {USER_ROLE, SIGN_WALLET} from '@/constant'
import {api_request} from '@/util';
import {message} from 'antd'
import I18N from '@/I18N'
import Web3 from 'web3'

message.config({
    top: 100
})

export default class extends BaseService {

    async login(privateKey, persist) {
        // call API /login
        const res = await api_request({
            path: '/api/user/login',
            method: 'post',
            data: {
                privateKey
            }
        });

        return this.setLogged(res, persist)
    }

    async normalLogin(username, password, persist) {
        // call API /login
        const res = await api_request({
            path: '/api/user/login',
            method: 'post',
            data: {
                username,
                password
            }
        });

        return this.setLogged(res, persist)
    }

    // async addWallet(address) {
    //     let web3= new Web3(window.ethereum)
    //     let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(address), address)
    //     let data = {
    //         address: address,
    //         signature: signature
    //     }
    //     return api_request({
    //         path: '/api/user/add_wallet',
    //         method: 'post',
    //         data: data
    //     })
    // }

    async autoCreate(param) {
        const username = param.username
        let web3= new Web3(window.ethereum)
        console.log(SIGN_WALLET)
        let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(username), SIGN_WALLET)
        let data = {
            username: username,
            signature: signature
        }
        // call API /login
        const res = await api_request({
            path: '/api/user/auto-create',
            method: 'post',
            data: data
        });

        return this.setLogged(res, true)
    }

    async getCurrentUser() {
        const res = await api_request({
            path: '/api/user/current_user',
            method: 'get'
        });

        return this.setLogged(res, false)
    }

    async getListWallet(publicKey) {
        const userRedux = this.store.getRedux('user')
        let data = {
            publickey: publicKey
        }
        const res = await api_request({
            path: '/api/user/list_wallet',
            method: 'get',
            data: data
        });

        this.dispatch(userRedux.actions.wallets_update(res))
    }

    async setStatus(publicKey, address) {
        let data = {
            publickey: publicKey,
            address: address,
        }
        return api_request({
            path: '/api/user/set_status',
            method: 'post',
            data: data
        })
    }

    async resetPublicKey() {
        return await api_request({
            path: '/api/user/reset_public_key',
            method: 'put'
        })
    }

    async changePassword(password) {
        const data = {
            password: password
        }
        try{
            await api_request({
                path: '/api/user/change_password',
                method: 'put',
                data: data
            })
            this.logout()
            this.toggleRegisterLoginModal(true)
            return true
        } catch(e) {
            return e
        }
    }

    async addWallet(publicKey, address) {
        let web3= new Web3(window.ethereum)
        let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(address), address)
        let data = {
            publickey: publicKey,
            address: address,
            signature: signature
        }
        return api_request({
            path: '/api/user/add_wallet',
            method: 'post',
            data: data
        })
    }

    async deleteWallet(id) {
        const res = await api_request({
            path: `/api/user/delete_wallet/{id}`,
            method: 'delete'
        });
    }

    async authenByGoogle(data) {
        const ref = localStorage.getItem('ref')
        if (ref) {
            data.ref = ref
        }

        // call API /login
        const res = await api_request({
            path: '/api/user/auth_google',
            method: 'post',
            data: data
        });

        return this.setLogged(res, false)
    }

    async getRefers(data) {
        const userRedux = this.store.getRedux('user')

        const res = await api_request({
            path: '/api/user/list_refer',
            method: 'get',
            data: data
        });

        this.dispatch(userRedux.actions.refers_update(res))
    }

    toggleRegisterLoginModal(toggle) {
        const userRedux = this.store.getRedux('user')
        this.dispatch(userRedux.actions.showRegisterLoginModal_update(toggle))
    }

    responseFacebook(event) {
        if (event.error) {
            return message.error(event.error)
        }

        const data: any = {
            email: event.email,
            facebookId: event.id,
            firstName: event.first_name,
            lastName: event.last_name
        }

        const ref = localStorage.getItem('ref')

        if (ref) {
            data.ref = ref
        }

        this.authenByGoogle(data).then(() => {
            message.success(I18N.get('login.success'))
            this.toggleRegisterLoginModal(false)
        }).catch((error) => {
            message.error(error.message)
        })
    }

    async setLogged(res, persist) {
        const userRedux = this.store.getRedux('user')

        this.dispatch(userRedux.actions.is_login_update(true))

        if ([USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(res.user.role)) {
            this.dispatch(userRedux.actions.is_admin_update(true))
        }else{
            this.dispatch(userRedux.actions.is_admin_update(false))
        }
        if ([USER_ROLE.LEADER].includes(res.user.role)) {
            this.dispatch(userRedux.actions.is_leader_update(true))
        }else {
            this.dispatch(userRedux.actions.is_leader_update(false))
        }

        this.dispatch(userRedux.actions.email_update(res.user.email))
        this.dispatch(userRedux.actions.publicKey_update(res.user.publicKey))
        this.dispatch(userRedux.actions.privateKey_update(res.user.privateKey))
        this.dispatch(userRedux.actions.username_update(res.user.username))
        this.dispatch(userRedux.actions.profile_update(res.user.profile))
        this.dispatch(userRedux.actions.role_update(res.user.role))
        this.dispatch(userRedux.actions.current_user_id_update(res.user._id))
        this.dispatch(userRedux.actions.wallet_update(res.user.wallet))
        this.dispatch(userRedux.actions.trxWallet_update(res.user.trxWallet))
        this.dispatch(userRedux.actions.balances_update(res.balances))
        this.dispatch(userRedux.actions.expiredTime_update(res.user.expiredTime))
        this.dispatch(userRedux.actions.clientLimit_update(res.user.clientLimit))
        this.dispatch(userRedux.actions.clientCount_update(res.user.clientCount))
        this.dispatch(userRedux.actions.popup_update_update(res.user.popupUpdate))
        this.dispatch(userRedux.actions.receivedPoint_update(res.user.receivedPoint))
        this.dispatch(userRedux.actions.invitedPoint_update(res.user.invitedPoint))

        this.dispatch(userRedux.actions.defaultWinningMulti_update(res.user.defaultWinningMulti))
        this.dispatch(userRedux.actions.defaultBonusKick_update(res.user.defaultBonusKick))
        this.dispatch(userRedux.actions.defaultUnit_update(res.user.defaultUnit))
        this.dispatch(userRedux.actions.defaultReturnPercent_update(res.user.defaultReturnPercent))

        if (persist) {
            sessionStorage.setItem('api-token', res['api-token']);
            localStorage.setItem('api-token', res['api-token'])
        }

        const socketService = new SocketService()
        // socketService.listenUpdateBalance()
        // this.path.push('/profile/info')
        return {
            success: true,
            is_admin: res.user.role === USER_ROLE.ADMIN
        }
    }

    async getNotifications(query) {
        const userRedux = this.store.getRedux('user')

        const res = await api_request({
            path: '/api/notification/list',
            method: 'get',
            data: {
                ...query,
                sortBy: 'createdAt',
                sortOrder: 'DESC'
            }
        });

        const oldNotifications = this.store.getState().user.notifications || []
        const notifications = _.values(res.list).concat(oldNotifications)
        const data = _.orderBy(_.uniqBy(notifications, '_id'), ['createdAt'], ['desc'])

        this.dispatch(userRedux.actions.notifications_update(data))
        this.dispatch(userRedux.actions.notifications_total_update(res.total))

        return data
    }

    async readNotification(notificationId) {
        const res = await api_request({
            path: '/api/notification/update',
            method: 'put',
            data: {
                notificationId
            }
        });

        return res
    }

    /**
     * Check if username already exists
     *
     * @param username
     * @returns {Promise<void>}
     */
    async checkUsername(username) {
        return await api_request({
            path: '/api/user/check-username',
            method: 'post',
            data: {
                username
            }
        });
    }

    async register(username, password, profile) {
        const ref = localStorage.getItem('ref')
        if (ref) {
            profile.ref = ref
        }

        const res = await api_request({
            path : '/api/user/register',
            method : 'post',
            data : Object.assign(profile, {
                username,
                password
            })
        });

        return this.setLogged(res, true)
    }

    async forgotPassword(email) {

        return api_request({
            path : '/api/user/forgot-password',
            method : 'post',
            data : {
                email
            }
        })
    }

    async resetPassword(resetToken, password) {

        return api_request({
            path : '/api/user/reset-password',
            method : 'post',
            data : {
                resetToken,
                password
            }
        })
    }

    // restrictive getter - public profile should never return email / private info
    async getMember(userId, options = {}) {
        let path = `/api/user/public/${userId}`
        const memberRedux = this.store.getRedux('member')
        const userRedux = this.store.getRedux('user')

        this.dispatch(userRedux.actions.avatar_loading_update(true))

        await this.dispatch(memberRedux.actions.loading_update(true))

        if (options.admin) {
            path += '?admin=true'
        }

        const result = await api_request({
            path: path,
            method: 'get'
        })

        await this.dispatch(memberRedux.actions.detail_update(result))
        await this.dispatch(memberRedux.actions.loading_update(false))

        this.dispatch(userRedux.actions.avatar_loading_update(false))

        return result
    }

    resetMemberDetail() {
        const memberRedux = this.store.getRedux('member')
        this.dispatch(memberRedux.actions.detail_reset())
    }

    async update(userId, doc) {

        const memberRedux = this.store.getRedux('member')

        await this.dispatch(memberRedux.actions.loading_update(true))

        const result = await api_request({
            path: `/api/user/${userId}`,
            method: 'put',
            data: doc
        })

        await this.dispatch(memberRedux.actions.detail_update(result))
        await this.dispatch(memberRedux.actions.loading_update(false))

        return result
    }

    async logout() {
        const userRedux = this.store.getRedux('user')

        return new Promise((resolve) => {
            this.dispatch(userRedux.actions.is_login_update(false))
            this.dispatch(userRedux.actions.profile_reset())

            this.dispatch(userRedux.actions.is_admin_reset())
            this.dispatch(userRedux.actions.is_leader_reset())

            this.dispatch(userRedux.actions.email_reset())
            this.dispatch(userRedux.actions.publicKey_reset())
            this.dispatch(userRedux.actions.privateKey_reset())
            this.dispatch(userRedux.actions.username_reset())
            this.dispatch(userRedux.actions.profile_reset())
            this.dispatch(userRedux.actions.role_reset())
            this.dispatch(userRedux.actions.current_user_id_reset())
            this.dispatch(userRedux.actions.popup_update_reset())

            sessionStorage.clear()
            localStorage.removeItem('api-token', '')
            this.toggleRegisterLoginModal(true)
            resolve(true)
        })
    }

    async getByIds(ids) {
        const result = await api_request({
            path : `/api/user/${ids}/users`,
            method : 'get',
        });

        return result
    }

    async getAll(query) {
        const memberRedux = this.store.getRedux('member')
        await this.dispatch(memberRedux.actions.users_loading_update(true))

        const path = '/api/user/list'
        this.abortFetch(path)

        let result
        try {
            result = await api_request({
                path,
                method : 'get',
                data: query,
                signal: this.getAbortSignal(path)
            });

            await this.dispatch(memberRedux.actions.users_update(result.list))
            await this.dispatch(memberRedux.actions.users_total_update(result.total))
            await this.dispatch(memberRedux.actions.users_loading_update(false))
        } catch (e) {
            // Do nothing
        }

        return result
    }

    async sendEmail(fromUserId, toUserId, formData) {
        return await api_request({
            path: '/api/user/send-email',
            method: 'post',
            data: {
                fromUserId,
                toUserId,
                ...formData
            }
        })
    }

    async sendRegistrationCode(email, code) {
        return await api_request({
            path: '/api/user/send-code',
            method: 'post',
            data: {
                email,
                code // TODO dont send this in clear text
            }
        })
    }

    async sendBackupKey(param) {
        return await api_request({
            path: '/api/user/send-backup-key',
            method: 'post',
            data: param
        })
    }

    async sendConfirmationEmail(email) {
        return await api_request({
            path: '/api/user/send-confirm',
            method: 'post',
            data: {
                email
            }
        })
    }

    async checkEmail(email) {
        return await api_request({
            path: '/api/user/check-email',
            method: 'post',
            data: {
                email
            }
        })
    }

    async checkUsername(username) {
        return await api_request({
            path: '/api/user/check-username',
            method: 'post',
            data: {
                username
            }
        })
    }
}
