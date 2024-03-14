import BaseRedux from '@/model/BaseRedux'

class Redux extends BaseRedux {
    defineTypes () {
        return ['dice']
    }

    defineDefaultState() {
        return {
            currentRound: {},
            betSum: {BIG: 0, SMALL: 0},
            myBetSum: {BIG: 0, SMALL: 0},
            currentBets: {},
            roundResults: [],
            topPlayers: [],
            loading: false
        };
    }
}

export default new Redux()
