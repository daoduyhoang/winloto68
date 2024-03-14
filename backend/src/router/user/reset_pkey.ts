import Base from '../Base';
import UserService from '../../service/UserService';

export default class extends Base {
    protected needLogin = true;
    async action(){
        const userService = this.buildService(UserService);
        const newKey = await userService.resetPKey()
        let rs = {
            newPrivateKey: newKey
        };
        return await this.result(1, rs);
    }
}
