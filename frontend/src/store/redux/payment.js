import BaseRedux from '@/model/BaseRedux'

class Redux extends BaseRedux {
    defineTypes () {
        return ['payment']
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
