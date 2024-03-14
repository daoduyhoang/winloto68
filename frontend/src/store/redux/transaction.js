import BaseRedux from '@/model/BaseRedux'

class Redux extends BaseRedux {
    defineTypes () {
        return ['transaction']
    }

    defineDefaultState() {
        return {
            loading: false,
            detail: {},
            list: [],
            cashin: [],
            totalCashin: 0,
            cashout: [],
            totalCashout: 0,
        };
    }
}

export default new Redux()
