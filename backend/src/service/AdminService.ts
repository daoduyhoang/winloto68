import Base from './Base';
import {constant} from '../constant';
import * as Web3 from 'web3'

const web3 = new Web3()

export default class extends Base {
    private config: any;
    private DB_User: any;
    private DB_Client: any;
    private DB_Result: any;
    private DB_Ticket: any;
    private DB_Message: any;

    protected init(){
        this.DB_User = this.getDBModel('User')
        this.DB_Client = this.getDBModel('Client')
        this.DB_Result = this.getDBModel('Result')
        this.DB_Ticket = this.getDBModel('Ticket')
        this.DB_Message = this.getDBModel('Message')
    }

    public async update_limit(param) {
        const msg = param.msg
        const signature = param.signature
        const exist = await this.msg_exist(msg)
        if (exist) {
            throw 'message already exist!'
        }
        if (!this.verifySignature(msg, signature)) {
            throw 'invalid signature!'
        }
        const db_message = this.getDBModel('Message');
        await db_message.save({text: msg})
        
        const user = await this.DB_User.findOne({username: param.username})
        if (isNaN(param.clientLimit)) {
            throw 'invalid limit'
        }
        await this.DB_User.update({_id: user._id}, {clientLimit: param.clientLimit})
        return true
    }

    public async update_point(param) {
        const inc = param.desc === true ? -1 : 1
        // const msg = param.msg
        // const signature = param.signature
        // const exist = await this.msg_exist(msg)
        // if (exist) {
        //     throw 'message already exist!'
        // }
        // if (!this.verifySignature(msg, signature)) {
        //     throw 'invalid signature!'
        // }
        // const db_message = this.getDBModel('Message');
        // await db_message.save({text: msg})
        
        const user = await this.DB_User.findOne({username: param.username})

        if ((user.receivedPoint + inc*30 > user.invitedPoint) || (user.receivedPoint + inc*30 < 0))
        {
            throw 'received point must be in range from 0 to ' + user.invitedPoint
        }
      
        await this.DB_User.update({_id: user._id}, {$inc: {receivedPoint: inc*30}})
        return true
    }

    public async update_license(param) {
        const inc = param.desc === true ? -1 : 1
        const msg = param.msg
        const signature = param.signature
        const days = param.duration ? Number(param.duration) : 30
        const oneDay = 24*60*60*1000
        const duration = inc * days * oneDay
        const username = (param.username).toLowerCase()
        const exist = await this.msg_exist(msg)
        if (exist) {
            throw 'message already exist!'
        }

        if (!this.verifySignature(msg, signature)) {
            throw 'invalid signature!'
        }
        // signature test pass
        const user = await this.DB_User.findOne({username: username})
        if (!user) {
            throw 'user not found!'
        }
        let expiredTime = user.expiredTime
        let newExpiredTime = expiredTime > new Date() ? + new Date(expiredTime) + duration : + new Date() + duration
        // console.log('xxx', newExpiredTime)
        await this.DB_User.update({_id: user._id}, {expiredTime: newExpiredTime})
        await this.DB_Message.save({text: msg})
        if (user.invitedBy) {
            await this.DB_User.update({_id: user.invitedBy}, {$inc: {invitedPoint: inc * days}})
        }
    }

    public async getUsers() {
        return await this.DB_User.list({username: {$ne: 'admin'}})
    }

    private async msg_exist(msg) {
        const message = await this.DB_Message.findOne({text: msg})
        return message ? true : false
    }

    private verifySignature(msg, signature):Boolean {
        let utf8Address = web3.utils.utf8ToHex(msg)
        let recover = web3.eth.accounts.recover(utf8Address, signature)
        return recover.toLowerCase() === process.env.ADMIN.toLowerCase()
    }
}
