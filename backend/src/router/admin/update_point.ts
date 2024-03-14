import Base from '../Base';
import AdminService from '../../service/AdminService';
import {constant} from '../../constant';

export default class extends Base {
    protected needAdmin = true;
    async action(){
        const param = this.getParam()
        const adminService = this.buildService(AdminService);
        const rs = await adminService.update_point(param)
        return this.result(1, rs);
    }
}