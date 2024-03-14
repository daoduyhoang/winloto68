import { createContainer } from '@/util'
import Component from './Component'
import ChainService from '@/service/ChainService'
import { Message } from 'antd'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    return {
        loading: state.chain.loading,
        is_admin: state.user.is_admin,
        chains: state.chain.list
    }
}, () => {
    const chainService = new ChainService()

    return {
        async listChain() {
            return await chainService.getList()
        },
        async deleteChain(id) {
            const rs = await chainService.delete(id)
            if (rs) {
                Message.success('Delete chain success!')
                chainService.getList()
            }
        }
    }
})
