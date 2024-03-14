import {createContainer} from '@/util'
import Component from './Component'
import LuckyNumberService from '@/service/_games/LuckyNumberService'
import ChainService from '@/service/ChainService'
import BalanceService from '@/service/BalanceService'
import SocketService from '@/service/SocketService'
import {message} from 'antd'
import _ from 'lodash'

export default createContainer(Component, (state) => {
    return {
        betSum: state.dice.betSum,
        myBetSum: state.dice.myBetSum,
        betTailsAmount: 0,
        networkSymbol: 'ETH',
        betAmountTails: 0,
        betHeadsAmount: 0,
        winTeam: false,
        listChain: state.chain.list,
        user: state.user,
        currentRound: state.luckyNumber.currentRound ? state.luckyNumber.currentRound : {},
        currentTickets: state.luckyNumber.currentTickets,
        roundResults: state.luckyNumber.roundResults,
        socket: state.socket.event
    }
}, () => {
    const luckyNumberService = new LuckyNumberService()
    const chainService = new ChainService();
    const balanceService = new BalanceService();
    const socketService = new SocketService();

    return {
        async updateCurrentTickets(tickets) {
            await luckyNumberService.updateCurrentTickets(tickets)
        },
        async getCurrentRound(params) {
            await luckyNumberService.getCurrentRound(params)
        },
        async buyTicket(params) {
            return await luckyNumberService.buyTicket(params)
        },
        async getListChain() {
            await chainService.getList()
        },
        async getBalance() {
            await balanceService.getBalance()
        },
        joinLnGame(params) {
            socketService.joinLnGame(params)
        },

        async getTestFaucet() {
            await balanceService.getTestFaucet()
        },
        async getRoundResults(params) {
            await luckyNumberService.getRoundResults(params)
        },
        async cancelBet(params) {
            try {
                await luckyNumberService.cancelBet(params)
                message.success('Cancel bets success!')
                return true
            } catch (err) {
                message.error(err.message)
            }
        }
    }
})
