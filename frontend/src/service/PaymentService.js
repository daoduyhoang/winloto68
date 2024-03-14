import BaseService from '../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request} from '@/util';

export default class extends BaseService {
    async getPayment(paymentId) {
        let data = {
            paymentid: paymentId
        }
        const res = await api_request({
            path: '/api/payment/get',
            method: 'get',
            data: data
        });

        return res
    }

    async createPayment(params) {
        console.log(params)
        let data = params
        const res = await api_request({
            path: '/api/payment/create',
            method: 'post',
            data: data
        });

        return res
    }
}
