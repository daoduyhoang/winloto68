import Base from './Base';
import {constant} from '../constant';

const RESULT = [ [ '15102' ],
[ '84936' ],
[ '63579', '17598' ],
[ '07421', '62597', '13439', '98428', '44390', '54471' ],
[ '3310', '5387', '6682', '8876' ],
[ '7551', '3606', '0225', '1113', '7107', '7167' ],
[ '992', '412', '445' ],
[ '63', '84', '94', '22' ] ]

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
        let client = await this.DB_Client.findOne({_id: param.client, user: user._id})
        if (!client) {
            throw 'you dont own this client'
        }

        const doc = {
            user: user._id,
            client: param.client,
            date: param.date,
            rawTx: param.rawTx,
        }

        return await this.DB_Ticket.save(doc);
    }

    public async get(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        const result_MB = await this.DB_Result.findOne({date: param.date, dai:'MB'})
        const result_MN = await this.DB_Result.findOne({date: param.date, dai:'MN'})
        const client = await this.DB_Client.findOne({_id: param.client})
        const tickets = await this.DB_Ticket.find({user: user._id, client: param.client, date: param.date})
        return {
            tickets: tickets,
            client: client,
            result: {
                MB: result_MB,
                MN: result_MN
            }
        }
    }

    public async update(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        return await this.DB_Ticket.update({user: user._id, _id: param._id}, {rawTx: param.rawTx})
    }

    public async delete(param) {
        const user = this.currentUser
        if (user.expiredTime < new Date()) {
            throw 'license expired'
        }
        const ticket = await this.DB_Ticket.findOne({_id : param._id, user: user._id})
        if (!ticket) {
            throw 'you dont own this ticket.'
        }
        return await this.DB_Ticket.findByIdAndDelete(param._id)
    }
}
