import React from 'react';
import StandardPage from '../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import _ from 'lodash'
import './style.scss'

import { Row , Col, Button, Card, Divider } from 'antd'

export default class extends StandardPage {

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    renderCard(title, text, imgUrl) {
        return (
            <Card
                bordered={false}
                cover={<img className="icon-feature" alt="example" width="80px" src={`/assets/images/${imgUrl}`} />}
              >
                <h3 className="item-title text-center">{title}</h3>
                <p className="item-des">{text}</p>
              </Card>
        )
    }

    renderCardSupported(name, imgUrl) {
        return (
            <Card
                bordered={false}
                cover={<img className="icon-feature" alt="" width="80px" src={`/assets/images/${imgUrl}`} />}
              >
                <p className="support-name text-center">{name}</p>
              </Card>
        )
    }

    renderCardPlugin(name, imgUrl, url) {
        return (
            <Card
                bordered={false}
                cover={<img className="icon-card" src={`/assets/images/${imgUrl}`} />}
              >
                <p className="text-center"><b><a className="plugins-name" target="_blank" href={url}>{name}</a></b></p>
              </Card>
        )
    }

    gettingStarted() {
        this.props.history.push('/document')
    }

    ord_renderContent() {
        return (
            <div>
                <div className="c_Home">
                    <div className="section-top">
                        <div className="heading">
                            <h1>EZPay</h1>
                            <h2 className="memo-title">Platform of the future that revolutionized Payment and Fund-Raising through astonishing features.</h2>
                            <Button onClick={this.gettingStarted.bind(this)} className="btn-getting-started">Getting Started</Button>
                        </div>
                    </div>
                    <div className="section-features">
                        <div className="header-line">
                             <h2 className="font-size-26 text-center">FEATURES</h2>
                        </div>
                        <Row>

                        </Row>
                    </div>
                    <div className="section-supported">
                        <div className="container">
                            <div className="header-line">
                                 <h2 className="text-center font-size-26">SUPPORTED</h2>
                            </div>
                            <Row>

                            </Row>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
