import BaseRedux from '@/model/BaseRedux'

class Redux extends BaseRedux {
    defineTypes () {
        return ['result']
    }

    defineDefaultState() {
        return {
            loading: false,
            detail: {},
            list: [],
        };
    }
}

export default new Redux()
