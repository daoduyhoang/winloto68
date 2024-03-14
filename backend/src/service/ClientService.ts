import Base from './Base';
import {constant} from '../constant';

export default class extends Base {
    private config: any;
    private DB_User: any;
    private DB_Client: any;
    private DB_Result: any;
    private DB_Ticket: any;

    protected init(){
        this.DB_User = this.getDBModel('User')
        this.DB_Client = this.getDBModel('Client')
        this.DB_Result = this.getDBModel('Result')
        this.DB_Ticket = this.getDBModel('Ticket')
    }

    public async create(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        const currentClients = user.clientCount
        if (currentClients >= user.clientLimit) {
            throw 'Number of clients limited.'
        }
        const doc = {
            user: user._id,
            name: param.name,
            winningMulti: param.winningMulti,
            bonusKick: param.bonusKick,
            returnPercent: param.returnPercent,
            unit: param.unit,
        }
        await this.DB_User.update({_id: user._id}, {$inc: {clientCount: 1}})
        return await this.DB_Client.save(doc);
    }

    public async saveDefault(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        const doc = {
            defaultWinningMulti: param.winningMulti,
            defaultBonusKick: param.bonusKick,
            defaultReturnPercent: param.returnPercent,
            defaultUnit: param.unit
        }

        return await this.DB_User.update({_id: user._id}, doc);
    }

    public async get(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        return await this.DB_Client.find({user: user._id})
    }

    public async update(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        return await this.DB_Client.update({user: user._id, _id: param._id}, param)
    }

    public async delete(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        const client = await this.DB_Client.findOne({_id : param._id})
        if (user._id !== client.user) {
            throw 'you dont own this client.'
        }
        return await this.DB_Client.findByIdAndDelete(param._id)
    }

    private async count(user) {
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        return await this.DB_Client.count({user: user})
    }
}
