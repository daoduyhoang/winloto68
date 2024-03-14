import BaseRedux from '@/model/BaseRedux'

class Redux extends BaseRedux {
    defineTypes () {
        return ['luckyNumber']
    }

    defineDefaultState() {
        return {
            currentRound: {},
            currentTickets: [],
            roundResults: [],
            topPlayers: [],
            loading: false
        };
    }
}

export default new Redux()
