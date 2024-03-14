import {createContainer} from '@/util'
import Component from './Component'
import DiceService from '@/service/_games/DiceService'
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
        currentRound: state.dice.currentRound ? state.dice.currentRound : {},
        currentBets: state.dice.currentBets,
        roundResults: state.dice.roundResults,
        socket: state.socket.event
    }
}, () => {
    const diceService = new DiceService()
    const chainService = new ChainService();
    const balanceService = new BalanceService();
    const socketService = new SocketService();

    return {
        async updateCurrentBets(bets) {
            await diceService.updateCurrentBets(bets)
        },
        async getCurrentRound(params) {
            await diceService.getCurrentRound(params)
        },
        async betGame(params) {
            return await diceService.betGame(params)
        },
        async getListChain() {
            await chainService.getList()
        },
        async getBalance() {
            await balanceService.getBalance()
        },
        joinDiceGame(params) {
            socketService.joinDiceGame(params)
        },

        async getTestFaucet() {
            await balanceService.getTestFaucet()
        },
        async getRoundResults(params) {
            await diceService.getRoundResults(params)
        },
        async cancelBet(params) {
            try {
                await diceService.cancelBet(params)
                message.success('Cancel bets success!')
                return true
            } catch (err) {
                message.error(err.message)
            }
        }
    }
})
