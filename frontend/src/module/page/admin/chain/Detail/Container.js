import { createContainer } from '@/util'
import Component from './Component'
import ChainService from '@/service/ChainService'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    return {
        loading: state.chain.loading,
        is_admin: state.user.is_admin,
        chains: state.chain.list,
        chain: state.chain.detail
    }
}, () => {
    const chainService = new ChainService()

    return {
        async getDetail(id) {
            return await chainService.getDetail(id)
        }
    }
})
