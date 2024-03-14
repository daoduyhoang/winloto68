import BaseService from '../model/BaseService'
import SocketService from '@/service/SocketService'
import io from 'socket.io-client'
import _ from 'lodash'
import {USER_ROLE, SIGN_WALLET} from '@/constant'
import {api_request} from '@/util';
import {message} from 'antd'
import I18N from '@/I18N'
import Web3 from 'web3'

message.config({
    top: 100
})

export default class extends BaseService {

    async createUser(param) {
        const username = param.username
        const password = param.password ? param.password : '88888888'
        if (!window.ethereum) throw 'install metamask'
        await window.ethereum.enable()
        let web3= new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(username), address)
        let data = {
            username: username,
            password: password,
            signature: signature,
            invitedBy: param.invitedBy === undefined ? null : param.invitedBy
        }
        console.log(data)
        // call API /login
        const res = await api_request({
            path: '/api/user/auto-create',
            method: 'post',
            data: data
        });
        console.log('xxx', res)

        return res
    }

    async updateClientLimit(param) {
        await window.ethereum.enable()
        let web3= new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        let msg= web3.utils.randomHex(32)
        // console.log(SIGN_WALLET)
        let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(msg), address)

        let data = {
            username: param.username,
            signature: signature,
            clientLimit: param.clientLimit,
            msg: msg
        }
        const res = await api_request({
            path: '/api/admin/update_limit',
            method: 'put',
            data: data
        });
        return res
    }

    async resetHashKey(param) {
        await window.ethereum.enable()
        let web3= new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        let msg= web3.utils.randomHex(32)
        // console.log(SIGN_WALLET)
        let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(msg), address)

        let data = {
            username: param.username,
            signature: signature,
            msg: msg
        }
        const res = await api_request({
            path: '/api/admin/reset_hash_key',
            method: 'put',
            data: data
        });
        return res
    }

    async update_license(username, days) {
        await window.ethereum.enable()
        let web3= new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        let msg= web3.utils.randomHex(32)
        // console.log(SIGN_WALLET)
        let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(msg), address)

        let data = {
            username: username,
            signature: signature,
            desc: days < 0,
            msg: msg
        }
        // console.log('data', data)
        // call API /login
        const res = await api_request({
            path: '/api/admin/update_license',
            method: 'put',
            data: data
        });

        return true
    }

    async update_point(username, point) {
        // await window.ethereum.enable()
        // let web3= new Web3(window.ethereum)
        // const accounts = await web3.eth.getAccounts()
        // const address = accounts[0]
        // let msg= web3.utils.randomHex(32)
        // console.log(SIGN_WALLET)
        // let signature = await web3.eth.personal.sign(web3.utils.utf8ToHex(msg), address)

        let data = {
            username: username,
            // signature: signature,
            desc: point < 0,
            // msg: msg
        }
        // console.log('data', data)
        // call API /login
        const res = await api_request({
            path: '/api/admin/update_point',
            method: 'put',
            data: data
        });

        return true
    }
}
