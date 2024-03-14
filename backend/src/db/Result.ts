import Base from './Base';
import {ResultSchema} from './schema/ResultSchema';

export default class extends Base {
    protected getSchema(){
        return ResultSchema;
    }
    protected getName(){
        return 'result'
    }
}