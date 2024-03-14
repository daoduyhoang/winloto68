import BaseService from '../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request} from '@/util';

export default class extends BaseService {
    async saveDefaultClient(client) {
        // console.log('xxx', client)
        const res = await api_request({
            path: '/api/client/save_default_client',
            method: 'put',
            data: client
        });
        // console.log('xxx', res)
        await this.loadClients()
        return res
    }

    async addClient(client) {
        // console.log('xxx', client)
        const res = await api_request({
            path: '/api/client/add_client',
            method: 'post',
            data: client
        });
        // console.log('xxx', res)
        await this.loadClients()
        return res
    }

    async updateClient(client) {
        // console.log('xxx', client)
        const res = await api_request({
            path: '/api/client/update_client',
            method: 'put',
            data: client
        });
        // console.log('xxx', res)
        await this.loadClients()
        return res
    }

    async loadClients() {
        const res = await api_request({
            path: '/api/client/get_client',
            method: 'get'
        });
        // console.log('xxx', res)
        const userRedux = this.store.getRedux('user')
        await this.dispatch(userRedux.actions.clients_update(res))
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
