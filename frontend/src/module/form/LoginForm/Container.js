import {createContainer, goPath} from "@/util"
import Component from './Component'
import UserService from '@/service/UserService'
import {message} from 'antd'
import I18N from '@/I18N'

message.config({
    top: 100
})

export default createContainer(Component, (state) => {
    return {
        ...state.user.login_form,
        language: state.language
    }
}, () => {
    const userService = new UserService()

    return {
        async login(privateKey, persist) {
            try {
                const rs = await userService.login(privateKey, persist)

                if (rs) {
                    message.success(I18N.get('login.success'))
                    userService.toggleRegisterLoginModal(false)

                    const loginRedirect = sessionStorage.getItem('loginRedirect')
                    if (loginRedirect) {
                        this.history.push('loginRedirect')
                        sessionStorage.setItem('loggedIn', '1')
                        sessionStorage.setItem('loginRedirect', null)
                    }
                    userService.path.push('/profile/info')
                    return true
                }

            } catch (err) {
                message.error(err.message)
                return false
            }
        },

        async normalLogin(username, password, persist) {
            try {
                const rs = await userService.normalLogin(username, password, persist)

                if (rs) {
                    message.success(I18N.get('login.success'))
                    userService.toggleRegisterLoginModal(false)

                    const loginRedirect = sessionStorage.getItem('loginRedirect')
                    if (loginRedirect) {
                        this.history.push('loginRedirect')
                        sessionStorage.setItem('loggedIn', '1')
                        sessionStorage.setItem('loginRedirect', null)
                    }
                    userService.path.push('/profile/info')
                    return true
                }

            } catch (err) {
                message.error(err.message)
                return false
            }
        },
        toggleRegisterLoginModal(toggle) {
            userService.toggleRegisterLoginModal(toggle)
        },
        responseFacebook(event) {
            userService.responseFacebook(event)
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
                        // this.history.push('/profile/info')
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
