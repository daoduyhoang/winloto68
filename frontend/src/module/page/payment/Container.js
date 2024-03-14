import {createContainer} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService';
import PaymentService from '@/service/PaymentService';
import _ from 'lodash'

export default createContainer(Component, (state) => {

    console.log(state)
    return {
    }
}, () => {
    const userService = new UserService();
    const paymentService = new PaymentService();

    return {
        toggleRegisterLoginModal(toggle) {
            userService.toggleRegisterLoginModal(toggle)
        },

        async getPayment(paymentId) {
            return await paymentService.getPayment(paymentId)
        },
        async createPayment(params) {
            return await paymentService.createPayment(params)
        }
    }
})
