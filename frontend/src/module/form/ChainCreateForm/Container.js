import {createContainer, goPath} from "@/util";
import Component from './Component';
import ChainService from '@/service/ChainService'
import {message} from 'antd'
import _ from 'lodash'

message.config({
    top: 100
})


export default createContainer(Component, (state)=>{
    return {
        currentUserId: state.user.current_user_id,
        is_admin: state.user.is_admin
    };
}, ()=>{
    const chainService = new ChainService();

    return {
        async create(formData) {
            return chainService.create(formData)
        },
        async update(data) {
            return await chainService.update(data)
        }
    };
});
