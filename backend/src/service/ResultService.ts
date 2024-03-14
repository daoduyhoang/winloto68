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
        return true
    }

    public async get(param) {
        return true
    }

    public async update(param) {
        return true
    }

    public async delete(param) {
        return true
    }
}
