import BaseService from '../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request} from '@/util';

export default class extends BaseService {
    async getCashIn(param) {
        const redux = this.store.getRedux('transaction')

        const res = await api_request({
            path: '/api/balance/get_cash_in',
            method: 'get',
            data: param
        });

        this.dispatch(redux.actions.cashin_update(res.list))
        this.dispatch(redux.actions.totalCashin_update(res.total))
        return res
    }

    async getCashOut(param) {
        const redux = this.store.getRedux('transaction')

        const res = await api_request({
            path: '/api/balance/get_cash_out',
            method: 'get',
            data: param
        });

        this.dispatch(redux.actions.cashout_update(res.list))
        this.dispatch(redux.actions.totalCashout_update(res.total))
        return res
    }
}
