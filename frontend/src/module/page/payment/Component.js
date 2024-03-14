import React from 'react';
import StandardPage from '../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import _ from 'lodash'
import './style.scss'
import qs from 'qs'

import { Row , Col, Button, Card, Divider } from 'antd'
const sha3 = require('solidity-sha3');
const qrUrl = (json) => {
    let encoded = encodeURIComponent(JSON.stringify(json));
    //let decoded = JSON.parse(decodeURIComponent(encoded));
    return 'https://chart.googleapis.com/chart?cht=qr&chl='+ encoded +'&chs=160x160&chld=L|0'
}

export default class extends StandardPage {

    constructor(props) {
        super(props)
        if (props.match.params.paymentId) {
            let paymentId = props.match.params.paymentId
            this.state = {
                created: true,
                paymentId : paymentId
            }
        } else {
            let params = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
            this.state = {
                created: false,
                params : params
            }
        }
    }

    async componentDidMount() {
        if (!this.state.created) {
            console.log('create', this.state.params)
            this.props.createPayment(this.state.params).then((res) => {
                console.log('payment created', res)
                this.loadPayment(res._id)
            }).catch((err) => {
                console.log('err', err.toString())
            })
        } else {
            this.loadPayment(this.state.paymenId)
        }
    }

    async loadPayment(paymentId) {
        let payment = await this.props.getPayment(paymentId)
        let token = payment.token
        let chain = payment.chain
        let qrData = {
            to: payment.to,
            token: token ? {address: token.address}: null,
            value: payment.rest,
            gas: payment.gas,
            chain: chain.name,
            description: payment.description
        }
        let tx = {
        }
        this.setState({
            payment: payment,
            qrUrl: qrUrl(qrData)
        })
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
                            <h1>PAYMENT BY ID</h1>
                        </div>
                    </div>
                    { JSON.stringify(this.state.payment, null, 2)}
                    <img src={this.state.qrUrl}/>
                </div>
                <Footer/>
            </div>
        );
    }
}
