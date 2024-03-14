import {createContainer, goPath} from "@/util"
import Component from './Component'
import BalanceService from '@/service/BalanceService'
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
    const balanceService = new BalanceService()

    return {
        async withdraw(param) {
            try {
                const rs = await balanceService.withdraw(param)

                if (rs) {
                    message.success('Withdraw success!')
                    return true
                }

            } catch (err) {
                message.error(err.message)
                return false
            }
        }
    }
})
