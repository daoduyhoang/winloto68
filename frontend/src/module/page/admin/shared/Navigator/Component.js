import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Menu, SubMenu } from 'antd'
import I18N from '@/I18N'
import { Link } from 'react-router-dom';

import './style.scss'

export default class extends BaseComponent {
    ord_render () {
        // TODO check why we can not use redirect use this.props.history
        return (
            <Menu
                defaultSelectedKeys={[this.props.selectedItem]}
                mode="inline"
            >
                <Menu.Item key="users">
                    <Link to="/admin/users">{I18N.get('1302')}</Link>
                </Menu.Item>
            </Menu>
        )
    }
}
