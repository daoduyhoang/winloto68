import { createContainer } from '@/util'
import Component from './Component'
import AdminService from '@/service/AdminService'
import { message } from 'antd/lib/index'
import _ from 'lodash'

export default createContainer(Component, (state) => {
    return {

    }
}, () => {
    const adminService = new AdminService()

    return {
    }
})
