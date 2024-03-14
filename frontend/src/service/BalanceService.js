import BaseService from '../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request} from '@/util';

export default class extends BaseService {
    async updateBalance() {
        const res = await api_request({
            path: '/api/balance/update',
            method: 'put'
        });

        return res
    }

    async getBalance() {
        const userRedux = this.store.getRedux('user')

        const res = await api_request({
            path: '/api/balance/get',
            method: 'get'
        });

        this.dispatch(userRedux.actions.balances_update(res))

        return res
    }

    async withdraw(param) {
        const res = await api_request({
            path: '/api/balance/withdraw',
            method: 'post',
            data: param
        });

        return res
    }

    /*
        DANGER TEST PHASE ONLY
    */
    async getTestFaucet() {
        console.log('sdagdsa')
        const res = await api_request({
            path: '/api/user/test',
            method: 'post',
        });

        return res
    }
}
