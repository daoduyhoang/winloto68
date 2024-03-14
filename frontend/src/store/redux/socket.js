import BaseRedux from '@/model/BaseRedux'

class Redux extends BaseRedux {
    defineTypes () {
        return ['socket']
    }

    defineDefaultState() {
        return {
            event: {},
        };
    }
}

export default new Redux()
