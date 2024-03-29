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
        async changePassword(password) {
            try {
                const rs = await userService.changePassword(password)

                // if (rs) {
                //     message.success('success')
                // }

            } catch (err) {
                console.error(err)
                message.error(err.message)
            }
        }
    }
})
