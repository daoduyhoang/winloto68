import Base from '../Base';
import UserService from '../../service/UserService';


export default class extends Base {

    async action() {
        const userService = this.buildService(UserService);
        await userService.checkUsername(this.getParam());
        return this.result(1, {});
    }
}
