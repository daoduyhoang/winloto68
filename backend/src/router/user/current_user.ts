import Base from '../Base';
import UserService from '../../service/UserService';

export default class extends Base {
    // protected needLogin = true;
    async action(){
        if (this.session.user) {


            const userService = this.buildService(UserService);
            const user = await userService.show({ userId: this.session.user._id });

            let rs = {
                user
            };
            return await this.result(1, rs);
        } else {
            return this.result(-1, 'no session')
        }
    }
}
