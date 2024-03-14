import React from 'react';
import StandardPage from '../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import _ from 'lodash'
import './style.scss'

import * as NETWORKS from './NetworksTest.json'

var CoinKey = require('coinkey')
var ci = require('coininfo')
var Web3 = require('web3')
const web3 = new Web3()
const TronWeb = require('tronweb')

import {transfer} from './transfer'

import {Select, Form, Icon, Input, Button, InputNumber} from 'antd'

const FormItem = Form.Item
const { Option } = Select;

const isTestnet = (name) => {
    return name=== undefined || name.toLowerCase().includes('test')
}

const getNetwork = (coinType) => {
    let coinInfo = ci(coinType)
    let network = {
        messagePrefix: coinInfo.messagePrefix ? coinInfo.messagePrefix : '',
        bech32: coinInfo.bech32,
        bip32: coinInfo.versions.bip32,
        pubKeyHash: coinInfo.versions.public,
        scriptHash: coinInfo.versions.scripthash,
        wif: coinInfo.versions.private,
    }
    return network
}

const getAddressFromWif = (coinType, wifKey) => {
    let network = getNetwork(coinType)
    let coinInfo = ci(coinType)
    let key = CoinKey.fromWif(wifKey, {private: coinInfo.versions.private, public: coinInfo.versions.public})
    return key
}

const getHexPKey = (wallet) => {
    return wallet.privateKey.toString('hex')
}

export default class extends StandardPage {

    constructor(props) {
        super(props)

        this.state = {
            wallet: null,
            ethWallet: null,
            trxWallet: null,
            privateKey: 'e7d89625067fa83486ecebcb535cbccd59bdd9dd65ca52c807017257ab65753b',
            wifKey: 'cVMNzjZ1qww3LTu6tcKfPaxgPwdN46TEdLJLMjc6LM4fsNhGnMYr',
            createdWallet: null,
            network: null,
            defaultWif: 'cVMNzjZ1qww3LTu6tcKfPaxgPwdN46TEdLJLMjc6LM4fsNhGnMYr',
            defaultPKey: 'e7d89625067fa83486ecebcb535cbccd59bdd9dd65ca52c807017257ab65753b',
            toWallet: '',
            amount: 0,
        }
    }

    componentDidMount() {
        Object.keys(NETWORKS).forEach(function (i) {
            console.log(NETWORKS[i])
        });
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

    pKeyLogin(e) {
        e.preventDefault()
        let coinType = this.state.network.ciSymbol
        console.log(coinType)
        let coinInfo = ci(coinType)
        console.log(this.state.privateKey)
        var key = new CoinKey(new Buffer(this.state.privateKey, 'hex'), {private: coinInfo.versions.private, public: coinInfo.versions.public})
        let wifKey = key.privateWif
        this.setState({wifKey: wifKey})
        key = getAddressFromWif(coinType, wifKey)
        let privateKey = this.state.privateKey
        let account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey)
        let trxWallet = TronWeb.address.fromHex(account.address)
        console.log(key.publicAddress)
        let address = key.publicAddress
        this.setState({
            wallet: address,
            wifKey: wifKey,
            ethWallet: account.address,
            trxWallet: trxWallet
        })
        // console.log(key.privateKey.toString('hex'))
    }

    wifLogin(e) {
        e.preventDefault()
        let coinType = this.state.network.ciSymbol
        let key = getAddressFromWif(coinType, this.state.wifKey)
        let privateKey = key.privateKey.toString('hex')
        let account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey)
        let trxWallet = TronWeb.address.fromHex(account.address)
        console.log(key.publicAddress)
        let address = key.publicAddress
        this.setState({
            wallet: address,
            privateKey: key.privateKey.toString('hex'),
            ethWallet: account.address,
            trxWallet: trxWallet
        })
        // console.log(key.privateKey.toString('hex'))
    }

    transferCoin(e) {
        // console.log(this.state.toWallet)
        // console.log(this.state.amount)
        // console.log(this.state.wifKey)
        let network = getNetwork(this.state.network.ciSymbol)
        let apiSymbol = this.state.network.apiSymbol
        let amount = (this.state.amount * 1e8).toFixed(0)
        let toAddress = this.state.toWallet
        let rawTx = transfer(this.state.wifKey, network, apiSymbol, amount, toAddress)
    }

    selectNetwork(network) {
        this.setState({
            network: network
        })
    }

    onWifKeyChange(e) {
        this.setState({
            wifKey: e.target.value
        })
    }

    onPKeyChange(e) {
        this.setState({
            privateKey: e.target.value
        })
    }

    onToWalletChange(e) {
        this.setState({
            toWallet: e.target.value
        })
        console.log(e.target.value)
    }

    onAmountChange(value) {
        this.setState({
            amount: value
        })
        console.log(value)
    }

    createWallet() {
        let coinInfo = ci(this.state.network.ciSymbol)
        let account = web3.eth.accounts.create()
         //account = web3.eth.accounts.privateKeyToAccount('0x9cba3db8c5cdca888a86ce0eda915d2ec0d061eb0396f1490fe3cb7bcedf2eee')
        let privateKeyHex = account.privateKey.substring(2)
        let createdWallet = new CoinKey(new Buffer(privateKeyHex, 'hex'), {private: coinInfo.versions.private, public: coinInfo.versions.public})
        let trxWallet = TronWeb.address.fromHex(account.address)
        this.setState({
            createdWallet: createdWallet,
            privateKey: privateKeyHex,
            ethWallet: account.address,
            trxWallet: trxWallet
        })
    }

    networksRender() {
        return (
            <div>
                <h1>Select Network</h1>
                <h1>CURRENTLY BTC TEST ONLY</h1>
                <Select style={{ width: 120 }} onChange={this.selectNetwork.bind(this)}>
                    {Object.keys(NETWORKS).map((key) => (
                        <Option value={NETWORKS[key]} disabled={!isTestnet(NETWORKS[key].apiSymbol)}>{NETWORKS[key].name}</Option>
                    ))
                    }
                </Select>
            </div>
        )
    }

    createWalletRender() {
        return (
        <Form className="c_loginForm">
            <FormItem>
                <h1><a href={this.state.network.faucetUrl} target='_blank'>FAUCET {this.state.network.name}</a></h1>
                {this.state.createdWallet && <p>wallet: {this.state.createdWallet.publicAddress}</p>}
                {this.state.createdWallet && <p>wifKey: {this.state.createdWallet.privateWif}</p>}
                {this.state.createdWallet && <p>pKey: {this.state.privateKey}</p>}
                {this.state.createdWallet && <p>ethWallet: {this.state.ethWallet}</p>}
                {this.state.createdWallet && <p>trxWallet: {this.state.trxWallet}</p>}
            </FormItem>
            <FormItem>
                {/*<a className="login-form-forgot pull-right" onClick={this.forgotPassword.bind(this)}>Forgot password</a>*/}
            </FormItem>
            <FormItem>
                <Button ltype="ebp" onClick = {() => this.createWallet()} className="d_btn_join">
                    Create Wallet
                </Button>
            </FormItem>
        </Form>
        )

    }

    loginRender() {
        return (
            <div>
                <Form onSubmit={this.pKeyLogin.bind(this)} className="c_loginForm">
                    <FormItem>
                        <Input onChange={this.onPKeyChange.bind(this)}
                            size="large"
                            prefix={<Icon style={{color: '#fff'}} type="key" />}
                            type="text" placeholder={'Private key'}
                            defaultValue={this.state.defaultPkey}
                            />
                    </FormItem>
                    <FormItem>
                        {/*<a className="login-form-forgot pull-right" onClick={this.forgotPassword.bind(this)}>Forgot password</a>*/}
                    </FormItem>
                    <FormItem>
                        <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn_join">
                            Login
                        </Button>
                    </FormItem>
                </Form>
                <Form onSubmit={this.wifLogin.bind(this)} className="c_loginForm">
                    <FormItem>
                        <Input onChange={this.onWifKeyChange.bind(this)}
                            size="large"
                            prefix={<Icon style={{color: '#fff'}} type="key" />}
                            type="text" placeholder={'Wif key'}
                            defaultValue={this.state.defaultWif}
                            />
                    </FormItem>
                    <FormItem>
                        {/*<a className="login-form-forgot pull-right" onClick={this.forgotPassword.bind(this)}>Forgot password</a>*/}
                    </FormItem>
                    <FormItem>
                        <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn_join">
                            Login
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }

    chainSoUrl() {
        // https://chain.so/address/BTCTEST/n3yAA566LBp9gMoaCXK3Dfs8mWerRoG4PF
        return 'https://chain.so/address/' + this.state.network.apiSymbol + '/' + this.state.wallet
    }


    accountRender() {
        return (
            <div>
                <Form className="c_loginForm">
                    <h1><a href={this.state.network.faucetUrl} target='_blank'>FAUCET {this.state.network.name}</a></h1>
                    <FormItem>
                        <Input onChange={this.onToWalletChange.bind(this)} size="large" placeholder={'To wallet address'}/>
                    </FormItem>
                    <FormItem>
                        <InputNumber onChange={this.onAmountChange.bind(this)} placeholder="Amout" size="large" />
                    </FormItem>
                    <FormItem>
                        <Button onClick={this.transferCoin.bind(this)} type="ebp" className="d_btn_join">
                            Transfer
                        </Button>
                    </FormItem>
                </Form>
                <Form className="c_loginForm">
                    <FormItem>
                        {<p>explorer <a href={this.chainSoUrl()} target='_blank'>wallet: {this.state.wallet}</a></p>}
                        {<p>wifKey: {this.state.wifKey}</p>}
                        {<p>pKey: {this.state.privateKey}</p>}
                        {<p>ethWallet: {this.state.ethWallet}</p>}
                        {<p>trxWallet: {this.state.trxWallet}</p>}
                    </FormItem>
                    <FormItem>
                        {/*<a className="login-form-forgot pull-right" onClick={this.forgotPassword.bind(this)}>Forgot password</a>*/}
                    </FormItem>
                </Form>
            </div>
        )
    }

    ord_renderContent() {

        return (
            <div>
                <div className="c_Document">
                    <div className="section-top">
                        <div className="heading">
                            <h1>BTC LTC ZCASH DOGE DASH wallet dapp</h1>
                        </div>
                    </div>
                    <div className="section-doc">
                        {!this.state.network && this.networksRender()}
                        {!this.state.wallet && this.state.network && this.createWalletRender()}
                        {!this.state.wallet && this.state.network && this.loginRender()}
                        {this.state.wallet && this.state.network && this.accountRender()}
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
