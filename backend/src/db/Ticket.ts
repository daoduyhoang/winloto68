import Base from './Base';
import {TicketSchema} from './schema/TicketSchema';

export default class extends Base {
    protected getSchema(){
        return TicketSchema;
    }
    protected getName(){
        return 'ticket'
    }
}