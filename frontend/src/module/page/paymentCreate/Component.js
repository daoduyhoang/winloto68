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
        console.log(props)
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
                <h3 className="text-center">{title}</h3>
                <p>{text}</p>
              </Card>
        )
    }

    renderCardSupported(name, imgUrl) {
        return (
            <Card
                bordered={false}
                cover={<img className="icon-feature" alt="" width="80px" src={`/assets/images/${imgUrl}`} />}
              >
                <h3 className="text-center"><b>{name}</b></h3>
              </Card>
        )
    }

    createAccount() {
        this.props.toggleRegisterLoginModal(true)
    }

    ord_renderContent() {
        return (
            <div>
                <div className="c_Payment">
                    <div className="section-top">
                        <div className="heading">
                            <h1>API DOCUMENTATION</h1>
                        </div>
                    </div>
                    <div className="section-doc">
                        <p className="title-size-large">1 Introduction</p>
                        <p>The EZ Pay APIs are provided method payment with cryptocurrencies, so please just use what you need and no more. We support both GET/POST requests and there is a rate limit 7 million payment at the same time.</p>
                        <p>To use the API service please <a onClick={this.createAccount.bind(this)}>create account</a> and get FREE Public-Key Token from within Profile->My Profile area which you can then use with all your api requests. </p>
                        <p className="title-size-large">2 Request payment</p>
                        <p className="title-size-small">2.1 Add wallet address to whitelist</p>
                        <p>To make payments with EZ Pay you need to add your wallet to the whitelist in Profile->My Profile</p>
                        <p className="title-size-small">2.2 Call Api payment</p>
                        <pre class="">
                            <span>POST Method: https://api.eazy-gateway.io/api/payment/create?apikey=YourPublicKeyToken</span>
                            <br/>
                            <br/>
                            <span>Request params:</span><br/>
                            <span dangerouslySetInnerHTML={{__html: `
                                {
                                    apiKey: YourPublicKeyToken,
                                    token: token id receive from system,
                                    to: wallet address receive token,
                                    value: amount need to send,
                                    gasLimit: receive from system
                                }
                            `}}></span>
                            <br/>
                            <span>Response data:</span><br/>
                            <span dangerouslySetInnerHTML={{__html: `
                                {
                                    code: 1
                                    data: {
                                        apiKey: YourPublicKeyToken,
                                        token: token id receive from system,
                                        to: wallet address receive token,
                                        value: amount need to send,
                                        gasLimit: receive from system
                                        _id: "5ceb5db144d659117310dd49"
                                    },
                                    message: "ok"
                                }
                            `}}></span>
                        </pre>
                        <p></p>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
