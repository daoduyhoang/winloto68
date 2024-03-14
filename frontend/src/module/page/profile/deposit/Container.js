import {createContainer} from '@/util'
import Component from './Component'
import TransactionService from '@/service/TransactionService'

export default createContainer(Component, (state) => {

    return {
        user: state.user,
        list: state.transaction.cashin,
    }
}, () => {
    const transactionService = new TransactionService();

    return {
        async getCashIn (param) {
            await transactionService.getCashIn(param)
        }
    }
})
