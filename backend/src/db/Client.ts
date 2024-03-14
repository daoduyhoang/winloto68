import Base from './Base';
import {ClientSchema} from './schema/ClientSchema';

export default class extends Base {
    protected getSchema(){
        return ClientSchema;
    }
    protected getName(){
        return 'client'
    }
}