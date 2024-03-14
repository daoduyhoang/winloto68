import {createContainer} from '@/util'
import Component from './Component'
import ClientService from '@/service/ClientService'
import SocketService from '@/service/SocketService'
import {message} from 'antd'
import _ from 'lodash'

export default createContainer(Component, (state) => {
    return {
        user: state.user,
    }
}, () => {
    const clientService = new ClientService();
    const socketService = new SocketService();

    return {
        async updateClient(data) {
            return await clientService.updateClient(data)
        },
        async saveDefaultClient(data) {
            return await clientService.saveDefaultClient(data)
        },
        async loadClients() {
            await clientService.loadClients()
        }
    }
})
