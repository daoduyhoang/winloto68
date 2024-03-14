import {createContainer} from '@/util'
import Component from './Component'
import TransactionService from '@/service/TransactionService'

export default createContainer(Component, (state) => {

    return {
        user: state.user,
        list: state.transaction.cashout,
    }
}, () => {
    const transactionService = new TransactionService();

    return {
        async getCashOut (param) {
            await transactionService.getCashOut(param)
        }
    }
})
