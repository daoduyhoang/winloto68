import Base from '../Base';
import AdminService from '../../service/AdminService';

export default class extends Base {
    protected needAdmin = true;
    async action(){
        let param = this.getParam();
        const adminService = this.buildService(AdminService);
        const rs = await adminService.getUsers()
        return this.result(1, rs);
    }
}
