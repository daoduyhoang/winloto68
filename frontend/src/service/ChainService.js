import BaseService from '../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request} from '@/util';

export default class extends BaseService {

    async getList() {
        const redux = this.store.getRedux('chain')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.list_reset())

        const result = await api_request({
            path: '/api/chain/list',
            method: 'get'
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.list_update(result))

        return result
    }

    async getDetail(id) {
        const redux = this.store.getRedux('chain')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.detail_reset())

        const result = await api_request({
            path: `/api/chain/show/${id}`,
            method: 'get'
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.detail_update(result))

        return result
    }

    async create(data) {
        const result = await api_request({
            path: '/api/chain/create',
            method: 'post',
            data: data
        })

        return result
    }

    async update(data) {
        const result = await api_request({
            path: '/api/chain/update',
            method: 'put',
            data: data
        })

        return result
    }

    async delete(id) {
        const result = await api_request({
            path: `/api/chain/delete/${id}`,
            method: 'delete'
        })

        return true
    }
}
