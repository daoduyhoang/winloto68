import BaseService from '../model/BaseService'
import _ from 'lodash'
import I18N from '@/I18N'
import {api_request, format, getDetails, cutDai, initDetailByType} from '@/util';

export default class extends BaseService {
    async submitTicket(data) {
        // console.log('xxx', client)
        const res = await api_request({
            path: '/api/ticket/add_ticket',
            method: 'post',
            data: data
        });
        await this.loadTickets(data)
        return res
    }

    async updateTicket(data) {
        // console.log('xxx', client)
        const res = await api_request({
            path: '/api/ticket/update_ticket',
            method: 'put',
            data: data
        });
        await this.loadTickets(data)
        return res
    }

    async deleteTicket(data) {
        console.log('xxx', data)
        const res = await api_request({
            path: '/api/ticket/delete_ticket',
            method: 'delete',
            data: data
        });
        return res
    }

    async loadTickets(data) {
        // console.log('xxx loadTickets', data)
        const res = await api_request({
            path: '/api/ticket/get_ticket',
            method: 'get',
            data: data
        });
        // console.log('xxx', res)
        let tickets = []
        const rawTickets = res.tickets
        // const result = res.result.MB ? res.result.MB.data : null
        const client = res.client
        let sum = 0
        let returnSum = 0
        let winAmount = 0
        let rest = 0
        // console.log('result', result)
        // console.log('client', client)
        let detailByType = initDetailByType()
        if (rawTickets.length > 0) {
            for(let i = 0; i < rawTickets.length; i++) {
                let ticket = rawTickets[i]
                ticket['details'] = {
                    sum: 0,
                    returnSum: 0,
                    winAmount: 0,
                    rest: 0,
                    errors: [],
                    logs: [],
                    originInput: [],
                }
                let perDaiTickets = cutDai(ticket.rawTx)
                perDaiTickets.forEach(perDaiTicket => {
                    let dai = perDaiTicket.DAI
                    let input = perDaiTicket.input
                    let results = this.getResultByDai(res.result, dai)
                    let origin = input
                    let subTx= format(input)
                    let details
                    // console.log('xxx results', results)
                    details = getDetails(dai, subTx, client, results)
                    // console.log('xxx', details)
                    ticket['details'].sum += details.sum
                    ticket['details'].returnSum += details.returnSum
                    ticket['details'].winAmount += details.winAmount
                    ticket['details'].rest += details.rest
                    ticket['details'].errors = ticket['details'].errors.concat(details.errors)
                    ticket['details'].logs = ticket['details'].logs.concat(details.logs)
                    ticket['details'].originInput = ticket['details'].originInput.concat(origin)
                    for (let i = 0; i < 5; i++) {
                        detailByType[i].sum += (details.detailByType)[i].sum
                        detailByType[i].returnSum += (details.detailByType)[i].returnSum
                        detailByType[i].winAmount += (details.detailByType)[i].winAmount
                    }
                });

                // // let mienResult = 
                // let result = res.result.MB ? res.result.MB.data : null
                // let tx = format(ticket.rawTx)
                // // console.log('tx', tx)
                // let details = getDetails(tx, client, result)
                // // console.log('xxxxx', details)
                // ticket['tx'] = tx
                // ticket['details'] = details
                // ticket['errors'] = details.errors
                if (ticket['details'].errors.length > 0) {
                    //ERROR FOUND
                    console.log('ticket error', ticket['details'].errors)
                }
                tickets.push(ticket)
                // console.log('xxx', ticket)
                sum+=ticket['details'].sum
                returnSum+=ticket['details'].returnSum
                winAmount+=ticket['details'].winAmount
                rest+=ticket['details'].rest
            }
        }
        const userRedux = this.store.getRedux('user')
        // console.log(detailByType)
        await this.dispatch(userRedux.actions.result_reset())
        await this.dispatch(userRedux.actions.result_update(res.result))
        await this.dispatch(userRedux.actions.tickets_update(tickets))
        await this.dispatch(userRedux.actions.detailByType_update(detailByType))
        await this.dispatch(userRedux.actions.sum_update(sum))
        await this.dispatch(userRedux.actions.returnSum_update(returnSum))
        await this.dispatch(userRedux.actions.winAmount_update(winAmount))
        await this.dispatch(userRedux.actions.rest_update(rest))
    }

    async getBalance() {
        const userRedux = this.store.getRedux('user')

        const res = await api_request({
            path: '/api/balance/get',
            method: 'get'
        });

        this.dispatch(userRedux.actions.balances_update(res))

        return res
    }

    async withdraw(param) {
        const res = await api_request({
            path: '/api/balance/withdraw',
            method: 'post',
            data: param
        });

        return res
    }

    /*
        DANGER TEST PHASE ONLY
    */
    async getTestFaucet() {
        console.log('sdagdsa')
        const res = await api_request({
            path: '/api/user/test',
            method: 'post',
        });

        return res
    }

    getResultByDai(result, dai) {

        if (dai==='mb') {
            return result.MB ? [result.MB.data] : null
        }
        if (!result.MN) return null

        const data = result.MN.data

        if (dai==='dc') {
            return [data[0].data]
        }

        if (dai==='dp') {
            return [data[1].data]
        }

        if (dai==='2d') {
            return [data[0].data,data[1].data]
        }

        for (let i = 0; i < data.length; i++) {
            let daiName = (data[i]).name
            daiName= daiName.toLowerCase().replace(/đ/g,"d")
            let arr = daiName.split(' ')
            let daiSymbol = arr[0][0] + arr[1][0]
            if (daiSymbol === 'bl') daiSymbol = 'bal'
            if (dai===daiSymbol) {
                return [data[i].data]
            }
        }
        return null
    }
}
