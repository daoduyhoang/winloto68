import {createContainer} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService';
import _ from 'lodash'

export default createContainer(Component, (state) => {
    return {
    }
}, () => {
    const userService = new UserService();

    return {
        toggleRegisterLoginModal(toggle) {
            userService.toggleRegisterLoginModal(toggle)
        }
    }
})
