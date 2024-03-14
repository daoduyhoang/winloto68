import {createContainer, goPath} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import {message} from 'antd'
import I18N from '@/I18N'

message.config({
    top: 100
})

/**
 * Note at the moment we do lazy client side registration code generation
 * TODO: move this to server side
 */
export default createContainer(Component, (state) => {
    return {
        ...state.user.register_form,
        language: state.language,
        isLogin: state.user.is_login,
        privateKey: state.user.privateKey,
        wallet: state.user.wallet,
    }
}, () => {
    const userService = new UserService()

    return {
        async register(username, password, profile) {
            try {
                const rs = await userService.register(username, password, profile)

                if (rs) {
                    message.success(I18N.get('login.success'))
                    const registerRedirect = sessionStorage.getItem('registerRedirect')

                    if (registerRedirect) {
                        return true;
                    } else {
                        // this.history.push('/')
                    }
                }
            } catch (err) {
                console.error(err)
                message.error(err && err.message ? err.message : 'Registration Failed - Please Contact Our Support')
            }
        },

        async autoCreateAccount(param) {
            try {
                const rs = await userService.autoCreate(param)

                if (rs) {
                    message.success(I18N.get('login.success'))

                    return true
                }
            } catch (err) {
                message.error(err)
            }
        },

        async sendBackupKey(param) {
            try {
                const rs = await userService.sendBackupKey(param)

                if (rs) {
                    message.success(I18N.get('register.form.sendBackupKey.success'))

                    return true
                }
            } catch (err) {
                message.error(err)
            }
        },

        async sendEmail(toUserId, formData) {
            return userService.sendEmail(this.currentUserId, toUserId, formData)
        },

        async sendRegistrationCode(email, code) {
            return userService.sendRegistrationCode(email, code)
        },

        async checkEmail(email) {
            try {
                await userService.checkEmail(email)
                return false
            } catch (err) {
                return true
            }
        },
        async checkUsername(username) {
            try {
                await userService.checkUsername(username)
                return false
            } catch (err) {
                return true
            }
        },
        toggleRegisterLoginModal(toggle) {
            userService.toggleRegisterLoginModal(toggle)
        },

        async authenByGoogle(data) {
            try {
                const rs = await userService.authenByGoogle(data)

                if (rs) {
                    message.success(I18N.get('login.success'))

                    const loginRedirect = sessionStorage.getItem('loginRedirect')
                    if (loginRedirect) {
                        console.log('login redirect')
                        this.history.push(loginRedirect)
                        sessionStorage.setItem('loggedIn', '1')
                        sessionStorage.setItem('loginRedirect', null)
                    } else {
                        this.history.push('/profile/info')
                    }
                    return true
                }

            } catch (err) {
                message.error(err.message)
                return false
            }
        }
    }
})
