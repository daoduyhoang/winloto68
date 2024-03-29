/*global location, analytics*/
import React from 'react';
import BasePage from '@/model/BasePage';
import {Layout, Icon} from 'antd';
import Header from '../layout/Header/Container';
import {BackTop} from 'antd'
import MobileMenu from './mobile/side_menu/Container';
import Sider from './siderChat/Container';
import {spring, presets, Motion} from 'react-motion'

export default class extends BasePage {

    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            showMobile: false
        }

        analytics.page(location.pathname)
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        })
    }

    toggleMobileMenu() {
        this.setState({
            showMobile: !this.state.showMobile
        })
    }

    ord_renderPage() {

        const s = this.ord_animate()
        const mp = {
            defaultStyle: {
                left: 100
            },
            style : {
                left: spring(20, presets.noWobble)
            }
        }
        const windowHeight = window.innerHeight

        return (
            <Layout className="p_standardPage">
                {this.state.showMobile &&
                <Motion {...mp}>
                    {
                        (tar) => {
                            return <MobileMenu animateStyle={s.style_fn(tar)} toggleMobileMenu={this.toggleMobileMenu.bind(this)}/>
                        }
                    }
                </Motion>
                }
                <Layout id="root-container" style={{ minHeight: `${windowHeight}px`}} className={this.state.collapsed ? 'sider-collapsed' : 'sider-no-collapsed'}>
                    <Header toggleMobileMenu={this.toggleMobileMenu.bind(this)}/>
                    <Layout.Content>
                        {this.ord_renderContent()}
                    </Layout.Content>
                    <BackTop/>
                </Layout>
                {/* {<Icon className="icon-chat" onClick={() => window.scrollTo(0, 0)} type="up" style={{ fontSize: '20px', color: '#fff' }} theme="outlined" />} */}
                <Sider collapsed={this.state.collapsed} toggle={this.toggle.bind(this)} />
            </Layout>
        );
    }

    ord_animate() {

        // the width of the menu is 80vw
        return {
            style_fn: (val) => {
                return {
                    left: val.left + 'vw'
                }
            }
        }
    }

    ord_renderContent() {
        return null;
    }

    ord_loading(f=false){
        this.setState({loading : f});
    }
}
