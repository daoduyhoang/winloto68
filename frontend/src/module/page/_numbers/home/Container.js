import {createContainer} from '@/util'
import Component from './Component'
import ClientService from '@/service/ClientService'
import TicketService from '@/service/TicketService'
import SocketService from '@/service/SocketService'
import {message} from 'antd'
import _ from 'lodash'

export default createContainer(Component, (state) => {
    return {
        user: state.user,
        expiredTime: state.user.expiredTime,
        sum: state.user.sum,
        returnSum: state.user.returnSum,
        winAmount: state.user.winAmount,
        rest: state.user.rest,
        result: state.user.result,
        detailByType: state.user.detailByType,
        invitedPoint: state.user.invitedPoint,
        receivedPoint: state.user.receivedPoint,
    }
}, () => {
    const clientService = new ClientService();
    const ticketService = new TicketService();
    const socketService = new SocketService();

    return {
        async submitTicket(data) {
            return await ticketService.submitTicket(data)
        },
        async updateTicket(data) {
            return await ticketService.updateTicket(data)
        },
        async deleteTicket(data) {
            return await ticketService.deleteTicket(data)
        },
        async updateClient(data) {
            return await clientService.updateClient(data)
        },
        async saveDefaultClient(data) {
            return await clientService.saveDefaultClient(data)
        },
        async loadClients() {
            return await clientService.loadClients()
        },
        async loadTickets(data) {
            return await ticketService.loadTickets(data)
        }
    }
})
