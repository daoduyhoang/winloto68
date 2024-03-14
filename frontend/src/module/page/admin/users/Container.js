import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import AdminService from '@/service/AdminService'
import { message } from 'antd/lib/index'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    if (!_.isArray(state.member.users)) {
        state.member.users = _.values(state.member.users)
    }

    return {
        loading: state.member.users_loading,
        is_admin: state.user.is_admin,
        users: state.member.users || []
    }
}, () => {
    const userService = new UserService()
    const adminService = new AdminService()

    return {
        async listUsers () {
            try {
                return await userService.getAll({admin: false})
            } catch (err) {
                console.error(err)
                message.error(err.message)
            }
        },
        async update_license (username, toAdd) {
            return adminService.update_license(username,toAdd)
        },
        async update_point (username, toAdd) {
            return adminService.update_point(username,toAdd)
        },
        async createUser(data) {
            return await adminService.createUser(data)
            // try {
            //     return await adminService.createUser(data)
            // } catch(e) {
            //     console.log('error', e)
            //     return false
            // }
        },
        async resetHashKey(data) {
            return await adminService.resetHashKey(data)
        },        
        async updateClientLimit(data) {
            return await adminService.updateClientLimit(data)
        }

    }
})
