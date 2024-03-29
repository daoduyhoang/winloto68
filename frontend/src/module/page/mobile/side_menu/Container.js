import {createContainer} from '@/util';
import Component from './Component';
import UserService from '@/service/UserService';
import {message} from 'antd';

export default createContainer(Component, (state) => {
    return {
        isLogin: state.user.is_login,
        user: state.user
    };
}, () => {
    const userService = new UserService();
    return {
        async logout() {
            const rs = await userService.logout();
            if (rs) {
                message.success('logout success');
                // userService.path.push('/login');
            }
        },
        toggleRegisterLoginModal(toggle) {
            userService.toggleRegisterLoginModal(toggle)
        }
    };
});
