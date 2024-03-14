import BaseService from '../model/BaseService'
import BalanceService from '@/service/BalanceService'
import _ from 'lodash'
import {api_request} from '@/util';

export default class extends BaseService {
    async initEvent(socket) {
        window.SOCKET = socket

        const socketRedux = this.store.getRedux('socket')
        const balanceService = new BalanceService()

        socket.on('UPDATE_BALANCE', async (data) => {
            console.log('UPDATE_BALANCE')
            balanceService.getBalance()
        })
    }

    listenUpdateBalance() {
        const user = this.store.getState().user

        window.SOCKET.emit('EMIT_UPDATE_BALANCE', user.current_user_id)
    }

    joinDiceGame(params) {
        window.SOCKET.emit('JOIN_DICE', params)
    }

    joinLnGame(params) {
        window.SOCKET.emit('JOIN_LN', params)
    }
}
