import Base from '../Base';
import UserService from '../../service/UserService';

export default class extends Base {
    protected needAdmin = true;
    async action(){
        let param = this.getParam();
        const userService = this.buildService(UserService);
        const newKey = await userService.resetPKeyByAdmin(param)
        const rs = {
            newPrivateKey: newKey
        }
        return this.result(1, rs);
    }
}
