import {createContainer} from '@/util'
import Component from './Component'
import BalanceService from '@/service/BalanceService'
import ChainService from '@/service/ChainService'

export default createContainer(Component, (state) => {

    return {
        user: state.user,
        listChain: state.chain.list,
    }
}, () => {
    const blanceService = new BalanceService();
    const chainService = new ChainService();

    return {
        updateBalance() {
            blanceService.updateBalance()
        },
        async withdraw(param) {
            await blanceService.withdraw(param)
        },
        async getBalance() {
            await blanceService.getBalance()
        },
        async getListChain() {
            await chainService.getList()
        }
    }
})
