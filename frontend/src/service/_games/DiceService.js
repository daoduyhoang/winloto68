import BaseService from '../../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request} from '@/util';
import {utils} from 'web3'

const BigNumber = utils.BN

const getSum = (bets, current_user_id) => {
    if (!bets) return {
        BIG: 0,
        SMALL: 0
    }

    let smallSum = new BigNumber('0')
    let mySmallSum = new BigNumber('0')
    bets.SMALL.forEach(bet => {
        smallSum= smallSum.add(new BigNumber(bet.value))
        if (bet.user._id === current_user_id) {
            mySmallSum = mySmallSum.add(new BigNumber(bet.value))
        }
    })
    let bigSum = new BigNumber('0')
    let myBigSum = new BigNumber('0')
    bets.BIG.forEach(bet => {
        bigSum= bigSum.add(new BigNumber(bet.value))
        if (bet.user._id === current_user_id) {
            myBigSum = myBigSum.add(new BigNumber(bet.value))
        }
    })

    let rs = {
        all: {
            SMALL: smallSum.toString(),
            BIG: bigSum.toString()
        },
        my: {
            SMALL: mySmallSum.toString(),
            BIG: myBigSum.toString()
        }
    }
    return rs
}

export default class extends BaseService {

    async betGame(params) {
        const result = await api_request({
            path: '/api/dice/bet',
            method: 'post',
            data: params
        })

        return result
    }

    async cancelBet(params) {
        const result = await api_request({
            path: '/api/dice/leave',
            method: 'delete',
            data: params
        })

        return result
    }

    async getCurrentRound(params) {
        const current_user_id = this.store.getState().user.current_user_id
        const redux = this.store.getRedux('dice')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.currentRound_reset())
        await this.dispatch(redux.actions.currentBets_reset())

        const result = await api_request({
            path: '/api/dice/get_current_round',
            method: 'get',
            data: params
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.currentRound_update(result.round))
        await this.dispatch(redux.actions.currentBets_update(result.bets))
        let betSum = getSum(result.bets, current_user_id)
        await this.dispatch(redux.actions.betSum_update(betSum.all))
        await this.dispatch(redux.actions.myBetSum_update(betSum.my))

        return result
    }

    async getCurrentBets() {
        const redux = this.store.getRedux('dice')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.currentBets_reset())

        const result = await api_request({
            path: '/api/dice/get_current_bets',
            method: 'get'
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.currentBets_update(result))

        return result
    }

    async getRoundResults(params) {
        const redux = this.store.getRedux('dice')
        await this.dispatch(redux.actions.loading_update(true))
        await this.dispatch(redux.actions.roundResults_reset())

        const result = await api_request({
            path: '/api/dice/get_round_results',
            method: 'get',
            data: params
        })

        await this.dispatch(redux.actions.loading_update(false))
        await this.dispatch(redux.actions.roundResults_update(result))

        return result
    }

    async updateCurrentBets(bets) {
        const redux = this.store.getRedux('dice')
        await this.dispatch(redux.actions.currentBets_update(bets))
    }
}
