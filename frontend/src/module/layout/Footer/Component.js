import React from 'react';
import BaseComponent from '@/model/BaseComponent';
import { Col, Row, Avatar, Icon } from 'antd'
import I18N from '@/I18N'

import './style.scss'

export default class extends BaseComponent {
    ord_render() {
        return (
            <div className="c_Footer">
                <div className="horizGap">

                </div>
                <div className="footer-box">
                    <Row className="d_rowFooter d_footerSection">
                        <Col className="logo-bottom" xs={24} sm={24} md={6}>
                            <img className="logo_own" src="/assets/images/logo.svg"/>
                        </Col>
                        <Col className="resources" xs={24} sm={24} md={6}>
                            <div className="links footer-vertical-section">
                                <div className="title-big title brand-color">
                                    Resources
                                </div>
                                <div className="title brand-color">
                                    <Icon type="team" />Game Team
                                </div>
                            </div>
                        </Col>
                        <Col className="contact-container" xs={24} sm={24} md={6}>
                            <div className="contact footer-vertical-section">
                                <div className="title-big title brand-color">
                                    <Icon type="contacts" /> Contact
                                </div>
                                <div className="title brand-color"><Icon type="mail" /> xxx.contact@gmail.com</div>
                                <div className="title brand-color"><Icon type="phone" /> 0388888888</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={6}>
                            <div className="join footer-vertical-section">
                                <div className="title-big title brand-color">
                                    Join Us On
                                </div>
                                <div className="social-icons">
                                    <a href="#" target="_blank"><Icon style={{ fontSize: '26px', color: 'white'}} type="github" /></a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
