import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Menu, SubMenu } from 'antd'
import MediaQuery from "react-responsive"
import I18N from '@/I18N'
import { Link } from 'react-router-dom';
import { Affix, Radio, Badge, Tooltip } from 'antd';
import './style.scss'
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from "../../../../config/constant"

export default class extends BaseComponent {

    ord_states() {
        return {
            navItem: 1
        };
    }

    handlePageChange(value) {
        this.setState({
            navItem: value
        })
    }

    handleMenuClick(item, key, keyPath) {
        const lookup = {
            profileInfo: '/profile/info',
            balance: '/profile/balance',
            deposit: '/profile/deposit',
            withdraw: '/profile/withdraw',
            users: '/admin/users',
            chains: '/admin/chains',
            chain_create: '/admin/chain_create'
        }

        const route = lookup[item.key]
        route && this.props.history.push(route)
    }

    renderMenu(isMobile) {
        return (
            <Menu
                className={isMobile ? '' : 'no-padding-items'}
                defaultSelectedKeys={[this.props.selectedItem]}
                onClick={this.handleMenuClick.bind(this)}
                mode={isMobile ? 'horizontal' : 'inline'}
            >
     {/*            <Menu.Item key="profileInfo" disabled={true}>
                    {I18N.get('2300')}
                </Menu.Item>
                {this.props.is_login &&
                    <Menu.Item key="balance" disabled={true}>
                        {I18N.get('1307')}
                    </Menu.Item>
                }
                {this.props.is_login &&
                    <Menu.Item key="deposit" disabled={true}>
                        {I18N.get('1308')}
                    </Menu.Item>
                }
                {this.props.is_login &&
                    <Menu.Item key="withdraw" disabled={true}>
                        {I18N.get('1309')}
                    </Menu.Item>
                } */}
                {this.props.is_admin &&
                    <Menu.Item key="users" >
                        {I18N.get('1302')}
                    </Menu.Item>
                }
            </Menu>
        )
    }

    ord_render () {
        // TODO check why we can not use redirect use this.props.history
        return (
            <div className="navigator">
                <MediaQuery minWidth={MIN_WIDTH_PC}>
                    <Affix offsetTop={15}>
                        {this.props.is_admin &&
                            <h5 className="admin-label">
                                {I18N.get('role.admin.mode')}
                            </h5>
                        }
                        {this.renderMenu(false)}
                    </Affix>
                </MediaQuery>
                <MediaQuery maxWidth={MAX_WIDTH_MOBILE}>
                    {this.renderMenu(true)}
                </MediaQuery>
            </div>
        )
    }
}
