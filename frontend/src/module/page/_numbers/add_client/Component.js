import React from 'react';
import StandardPage from '../../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import _ from 'lodash'
import './style.scss'
import MediaQuery from 'react-responsive'
import AnimatedNumber from "animated-number-react";
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC, EVENTS} from '@/config/constant'
import { Row , Col, Button, Card, Divider, Input, InputNumber, Progress, Radio, Notification, Table } from 'antd'

import { mmss, miniAddressSummary } from '@/util'

export default class extends StandardPage {

    constructor(props) {
        super(props)

        this.state = {
            setClientName: 'tên khách',
            winningMulti: {
                two: 0,
                three: 0,
                four: 0,
                kick: 0
            },
           bonusKick: 0,
           returnPercent: {
            two: 0,
            three: 0,
            four: 0,
           },
           unit: 1000
        }
    }

    async componentDidMount() {
        this.setState({
            winningMulti: this.props.user.defaultWinningMulti ? this.props.user.defaultWinningMulti : 0,
            bonusKick: this.props.user.defaultBonusKick ? this.props.user.defaultBonusKick : 0,
            returnPercent: this.props.user.defaultReturnPercent ? this.props.user.defaultReturnPercent : 0,
            unit: this.props.user.defaultUnit ? this.props.user.defaultUnit : 1000,
        })
       await this.props.loadClients()
    }

    listenEvents() {
        // window.SOCKET.on(EVENTS.DICE_NEW_BET, (data) => {
        //     Notification.success({
        //         message: 'New Bet',
        //         description: `New bet success`
        //     })
        //     this.setState({
        //         result: null,
        //         seed: null,
        //         blockHash: null,
        //     })
        //     this.getCurrentRound()
        // })

        // window.SOCKET.on(EVENTS.DICE_ROUND_STARTED, (data) => {
        //     Notification.success({
        //         message: 'DICE_ROUND_STARTED',
        //         description: `DICE_ROUND_STARTED`
        //     })
        //     this.getCurrentRound()
        // })

        // window.SOCKET.on(EVENTS.DICE_ROUND_LOCKED, (data) => {
        //     Notification.success({
        //         message: 'DICE_ROUND_LOCKED',
        //         description: `DICE_ROUND_LOCKED`
        //     })
        //     this.getCurrentRound()
        // })

        // window.SOCKET.on(EVENTS.DICE_ROUND_FINALIZED, (data) => {
        //     Notification.success({
        //         message: 'DICE_ROUND_FINALIZED',
        //         description: `DICE_ROUND_FINALIZED`
        //     })
        //     this.setState({
        //         result: data.round.result,
        //         seed: data.round.seed,
        //         blockHash: data.round.blockHash,
        //     })
        //     this.props.updateCurrentBets(data.bets)
        // })
    }

    componentWillUnmount() {
    }

    onWinningMultiTwoChange(value) {
        console.log('onWinningMultiTwoChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.two = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onWinningMultiThreeChange(value) {
        console.log('onWinningMultiThreeChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.three = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onWinningMultiFourChange(value) {
        console.log('onWinningMultiFourChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.four = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onWinningMultiKickChange(value) {
        console.log('onWinningMultiKickChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.kick = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onBonusKickChange(value) {
        console.log('onBonusKickChange', value)
        this.setState({
            bonusKick: value
        })
    }

    onUnitChange(value) {
        console.log('onUnitChange', value)
        this.setState({
            unit: value
        })
    }

    onReturnPercentTwoChange(value) {
        console.log('onReturnPercentTwoChange', value)
        let returnPercent = this.state.returnPercent
        returnPercent.two = value
        this.setState({
            returnPercent: returnPercent
        })
    }

    onReturnPercentThreeChange(value) {
        console.log('onReturnPercentThreeChange', value)
        let returnPercent = this.state.returnPercent
        returnPercent.three = value
        this.setState({
            returnPercent: returnPercent
        })
    }

    onReturnPercentFourChange(value) {
        console.log('onReturnPercentFourChange', value)
        let returnPercent = this.state.returnPercent
        returnPercent.four = value
        this.setState({
            returnPercent: returnPercent
        })
    }

    onSetClientNameChange(e) {
        this.setState({
            setClientName: e.target.value
        })
    }

    renderAddClient() {
        return (
            <div className="normalText">
                <Row><p>Thêm khách hàng</p> </Row>
                <Col span={24}>
                <Col span={12}>
                        <Row>
                            <Col span={8}>Thắng 2</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.two}
                                onChange={this.onWinningMultiTwoChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8}>Thắng 4</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.four}
                                onChange={this.onWinningMultiFourChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Col span={8}>Thắng 3</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.three}
                                onChange={this.onWinningMultiThreeChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8}>Thắng đá</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.kick}
                                onChange={this.onWinningMultiKickChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}>
                        <Row>
                            <Col span={8}>Đơn vị lệnh(VNĐ)</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.unit}
                                onChange={this.onUnitChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}><p></p></Col>
                    <Col span={24}>
                        <Row>
                            <Col span={8}>Thưởng thắng đá tối đa(lần)</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.bonusKick}
                                onChange={this.onBonusKickChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}><p></p></Col>
                    <Col span={12}>
                        <Row>
                            <Col span={8}>Hồi 2</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.returnPercent.two}
                                onChange={this.onReturnPercentTwoChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>

                        <Row>
                            <Col span={8}>Hồi 4</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.returnPercent.four}
                                onChange={this.onReturnPercentFourChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>
                    </Col>

                    <Col span={12}>
                        <Row>
                            <Col span={8}>Hồi 3</Col>
                            <Col span={14}> 
                                <div className="input-bet">                        
                                <InputNumber
                                style={{ width: '100%'}}
                                value={this.state.returnPercent.three}
                                onChange={this.onReturnPercentThreeChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Row>
                    </Col>
                </Col>
                <Col span={24}>
                    <div className="input-bet">                        
                    <Input
                    style={{ width: '100%'}}
                    value={this.state.setClientName}
                    onChange={this.onSetClientNameChange.bind(this)}
                    />
                    </div>
                    <Col span={12}>
                        <Button className="maxWidth" onClick={() => this.addClient()}>Lưu khách</Button>
                    </Col>
                    <Col span={12}>
                        <Button className="maxWidth" onClick={() => this.saveDefaultClient()}>Lưu cho lần sau</Button>
                    </Col>
                </Col>
            </div>
        )
    }

    ord_renderContent() {
        return (
                <div>
                <Col xs={0} md={6}></Col>
                <Col xs={24} md={12}>
                    {this.props.user.username && this.renderAddClient()}
                </Col>
                </div>
        );
    }

    // animateNumber(value) {
    //     return (
    //         <AnimatedNumber
    //             value={value}
    //             formatValue={n => Number(n).toFixed(4)} //{this.formatValue}
    //             duration={this.state.duration}
    //         />
    //     )
    // }

    async addClient() {
        const data = {
            name: this.state.setClientName,
            winningMulti: this.state.winningMulti,
            bonusKick: this.state.bonusKick,
            returnPercent: this.state.returnPercent,
            unit: this.state.unit
        }
        try {
            const rs = await this.props.addClient(data)
            Notification.success({
                message: 'Added',
            })
        } catch(e) {
            Notification.error({
                message: e.toString()
            })
        }
    }

    async saveDefaultClient() {
        const data = {
            winningMulti: this.state.winningMulti,
            bonusKick: this.state.bonusKick,
            returnPercent: this.state.returnPercent,
            unit: this.state.unit
        }
        const rs = await this.props.saveDefaultClient(data)
        Notification.success({
            message: 'Saved',
        })
    }
}
