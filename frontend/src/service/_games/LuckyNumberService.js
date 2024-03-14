import BaseService from '../../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request} from '@/util';
import {utils} from 'web3'

const BigNumber = utils.BN

export default class extends BaseService {

    async buyTicket(params) {
        console.log('buy params', params)
        const result = await api_request({
            path: '/api/ln/buy',
            method: 'post',
            data: params
        })
        console.log(result)
        return result
    }

    async cancelBet(params) {
        const result = await api_request({
            path: '/api/ln/leave',
            method: 'delete',
            data: params
        })

        return result
    }

    async getCurrentRound(params) {
        const current_user_id = this.store.getState().user.current_user_id
        const redux = this.store.getRedux('luckyNumber')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.currentRound_reset())
        await this.dispatch(redux.actions.currentTickets_reset())

        const result = await api_request({
            path: '/api/ln/get_current_round',
            method: 'get',
            data: params
        })
        console.log('getCurrentRound', result)

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.currentRound_update(result.round))
        await this.dispatch(redux.actions.currentTickets_update(result.tickets))

        return result
    }

    async getCurrentTickets(params) {
        const redux = this.store.getRedux('luckyNumber')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.tickets_reset())

        const result = await api_request({
            path: '/api/ln/get_current_tickets',
            method: 'get',
            data: params
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.tickets_update(result.tickets))
        console.log('tickets', result)
        return result
    }

    async getRoundLog(params) {
        const redux = this.store.getRedux('luckyNumber')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.histories_reset())

        const result = await api_request({
            path: '/api/ln/get_round_results',
            method: 'get',
            data: params
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.histories_update(result.list))

        return result
    }

    async getRoundResults(params) {
        const redux = this.store.getRedux('luckyNumber')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.roundResults_reset())

        const result = await api_request({
            path: '/api/ln/get_round_results',
            method: 'get',
            data: params
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.roundResults_update(result))

        return result
    }

    async updateCurrentTickets(tickets) {
        const redux = this.store.getRedux('luckyNumber')
        await this.dispatch(redux.actions.currentTickets_update(tickets))
    }
}
