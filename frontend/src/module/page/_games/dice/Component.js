import React from 'react';
import StandardPage from '../../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import _ from 'lodash'
import './style.scss'
import MediaQuery from 'react-responsive'
import AnimatedNumber from "animated-number-react";
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC, EVENTS} from '@/config/constant'
import { Row , Col, Button, Card, Divider, InputNumber, Progress, Radio, Notification, Table } from 'antd'

import { mmss, miniAddressSummary } from '@/util'

import Die from './Die'

export default class extends StandardPage {

    constructor(props) {
        super(props)

        this.state = {
            result: null,
            seed: null,
            blockHash: null,
            duration: 1000,
            betAmountTails: 0.01,
            betAmountHeads: 0.01,
            chain: null,
            currentTime: new Date().getTime() / 1000
        }
    }

    async componentDidMount() {
        let self = this
        setInterval(() => {
            self.setState({
                currentTime: new Date().getTime() / 1000
            })
        }, 1000)
        this.props.getBalance()
        await this.props.getListChain()
        this.getCurrentRoundChangeChain()
        this.listenEvents()
        this.getRoundResults()
    }

    listenEvents() {
        window.SOCKET.on(EVENTS.DICE_NEW_BET, (data) => {
            Notification.success({
                message: 'New Bet',
                description: `New bet success`
            })
            this.setState({
                result: null,
                seed: null,
                blockHash: null,
            })
            this.getCurrentRound()
        })

        window.SOCKET.on(EVENTS.DICE_ROUND_STARTED, (data) => {
            Notification.success({
                message: 'DICE_ROUND_STARTED',
                description: `DICE_ROUND_STARTED`
            })
            this.getCurrentRound()
        })

        window.SOCKET.on(EVENTS.DICE_ROUND_LOCKED, (data) => {
            Notification.success({
                message: 'DICE_ROUND_LOCKED',
                description: `DICE_ROUND_LOCKED`
            })
            this.getCurrentRound()
        })

        window.SOCKET.on(EVENTS.DICE_ROUND_FINALIZED, (data) => {
            Notification.success({
                message: 'DICE_ROUND_FINALIZED',
                description: `DICE_ROUND_FINALIZED`
            })
            this.setState({
                result: data.round.result,
                seed: data.round.seed,
                blockHash: data.round.blockHash,
            })
            this.props.updateCurrentBets(data.bets)
        })
    }

    componentWillUnmount() {
    }

    getRoundResults() {
        const chain = this.getCurrentChain()
        this.props.getRoundResults({
            chain: chain._id,
            limit: 10,
            skip: 0,
            // sort: 'betSum' // betSum betCount playerCount default: createdAt
        })
    }

    getCurrentRound() {
        this.setState({result: null})
        const chain = this.getCurrentChain()
        this.props.getCurrentRound({chain: chain._id})
    }

    getCurrentRoundChangeChain() {
        const chain = this.getCurrentChain()
        this.props.getCurrentRound({chain: chain._id})
        this.props.joinDiceGame({chain: chain._id})
    }

    setBetAmount(amount) {
        this.setState({
            betAmountTails: amount,
            betAmountHeads: amount
        })
    }

    onChaneAmountTails(amount) {
        this.setState({
            betAmountTails: amount
        })
    }

    onChaneAmountHeads(amount) {
        this.setState({
            betAmountHeads: amount
        })
    }

    betGame(team, amount) {
        const list = this.props.listChain
        let chainId = list[0] && list[0]._id

        if (this.state.chain) {
            chainId = this.state.chain
        }

        this.props.betGame({
            chain: chainId,
            team: team,
            amount: amount
        }).then(res => {
            Notification.success({
                message: 'Bet Success',
                description: `You bet success ${amount} for team ${team}`
            })
            this.props.getBalance()
            this.getCurrentRound()
        }, err => {
            Notification.error({
                message: err.toString(),
            })
        })
    }

    async onChangeChain(e) {
        const chainId = e.target.value

        await this.setState({chain: chainId})
        this.getCurrentRoundChangeChain()
    }

    getCurrentChain() {
        const list = this.props.listChain
        let chainId = list[0] && list[0]._id

        if (this.state.chain) {
            chainId = this.state.chain
        }

        return _.find(list, {'_id': chainId})
    }

    playAgain() {
        this.setState({
            result: null,
            seed: null,
            blockHash: null,
        })
        this.getCurrentRound()
        this.getRoundResults()
    }

    renderChain() {
        const list = this.props.listChain
        const chainId = list[0] && list[0]._id

        const balances = this.props.user.balances

        // if (!_.isEmpty(list)) {
            list.forEach(chain => {
                let balance = _.find(balances, {'chain': chain._id})

                if (balance && balance.value > 0) {
                    chain.value = balance.value
                } else {
                    chain.value = 0
                }
            })
        // }

        // if (!chainId) {
        //     return null
        // }

        return (
            <Radio.Group onChange={this.onChangeChain.bind(this)} defaultValue={chainId}>
                {_.map(list, (chain) => {
                    return <Radio.Button key={chain._id} value={chain._id}>{chain.name} ({chain.value / `1e${chain.decimal}`} {chain.symbol})</Radio.Button>
                })}
            </Radio.Group>
        )
    }

    renderRoundInfo() {
        return (
            <div className= "round-info">
                {<p>HASH: {this.props.currentRound.hash}</p>}
                {this.state.seed && <p>SEED: {this.state.seed}</p>}
                {this.props.currentRound.keyBlock > 0 && <p>KeyBlock: {this.props.currentRound.keyBlock}</p>}
                {this.state.blockHash && <p>blockHash: {this.state.blockHash}</p>}
            </div>
        )
    }

    ord_renderContent() {
        return (
            <div>
                <div className="c_Home">
                    <Row>
                        <Button size="large" onClick={() => this.props.getTestFaucet()} className="item">get test faucet for testing games</Button>
                    </Row>
                    <Row>
                        {this.renderChain()}
                    </Row>
                    <MediaQuery minWidth={MIN_WIDTH_PC}>
                        <div className="game-container">
                            {this.renderRoundInfo()}
                            <div className="left-side">
                                {/*{this.renderBalance()}*/}
                                <div className="bet-countdown">
                                    {this.renderTailsBet()}
                                    {this.renderCountdown()}
                                    {this.renderHeadsBet()}
                                </div>
                                <div className="">
                                    {this.renderAutoAmount()}
                                </div>
                            </div>
                            <div class="right-side">
                                <div className="current-bet">
                                    {this.renderCurrentBet()}
                                    {this.renderRoundResults()}
                                </div>
                            </div>
                        </div>
                    </MediaQuery>
                    <MediaQuery maxWidth={MAX_WIDTH_MOBILE}>
                        <div className="game-container">
                            {/*{this.renderBalance()}*/}
                            <div className="">
                                {this.renderCountdown()}
                            </div>
                            <div className="bet-countdown">
                                <div className="wrap-bet">
                                    {this.renderTailsBet()}
                                    {this.renderHeadsBet()}
                                </div>
                            </div>
                            <div className="">
                                {this.renderAutoAmount()}
                            </div>
                            <div className="current-bet">
                                {this.renderCurrentBet()}
                            </div>
                        </div>
                    </MediaQuery>
                    <div className="container">
                        {/*{this.renderFinalizeModal()}*/}
                        {/*<Row className="games test">
                            <HistoryRound list={this.props.rounds} />
                        </Row>*/}
                    </div>
                    <div id="tick-clock"></div>
                    <div id="flip-sound"></div>
                    <div id="win-sound"></div>
                    <div id="lose-sound"></div>
                </div>
                <Footer/>
            </div>
        );
    }

    cancelBets() {
        const chain = this.getCurrentChain()

        this.props.cancelBet({chain}).then(() => {
            this.getCurrentRound()
            this.props.getBalance()
        })
    }

    renderCurrentBet() {
        return (
            <div className="current-bets">
                <div className="title">Current bets</div>
                {this.props.currentRound.status !== 'LOCKED' && <Button onClick={this.cancelBets.bind(this)}>Cancel Bets</Button>}
                <Row>
                    <Col span={12}>
                        {this.renderCurrentTeamTails()}
                    </Col>
                    <Col span={12}>
                        {this.renderCurrentTeamHeads()}
                    </Col>
                </Row>
            </div>
        )
    }

    renderRoundResults() {
        let data = this.props.roundResults && this.props.roundResults || []
        const currentChain = this.getCurrentChain()

        if (!currentChain) {
            return null
        }

        const columns = [
            {
                title: 'Round Results',
                children: [
                    {
                        title: 'Round ID',
                        dataIndex: 'roundId',
                        key: 'roundId',
                        render: (roundId, record) => {
                            return roundId
                        }
                    },
                    {
                        title: 'Block',
                        dataIndex: 'keyBlock',
                        key: 'keyBlock',
                        render: (keyBlock, record) => {
                            return keyBlock
                        }
                    },
                    {
                        title: 'Result',
                        dataIndex: 'result',
                        key: 'result',
                        render: (result, record) => {
                            return result
                        }
                    },
                    {
                        title: 'Players',
                        dataIndex: 'playerCount',
                        key: 'playerCount',
                        render: (playerCount, record) => {
                            return playerCount
                        }
                    },
                    {
                        title: 'Bets',
                        dataIndex: 'betCount',
                        key: 'betCount',
                        render: (betCount, record) => {
                            return betCount
                        }
                    },
                    {
                        title: 'Sum',
                        dataIndex: 'betSum',
                        key: 'betSum',
                        render: (betSum, record) => {
                            return betSum / `1e${currentChain.decimal}`
                        }
                    },
                ]
            }
        ]

        return (
            <div>
                <Table
                    dataSource={data}
                    loading={this.props.loading}
                    columns={columns}
                    pagination={false}
                    rowKey="roundId">
                </Table>
            </div>
        )
    }

    renderCurrentTeamTails() {
        let data = this.props.currentBets && this.props.currentBets.BIG || []
        const currentChain = this.getCurrentChain()

        if (!currentChain) {
            return null
        }

        const columns = [
            {
                title: 'BIG',
                children: [
                    {
                        title: 'Player',
                        dataIndex: 'user',
                        key: 'user',
                        render: (user, record) => {
                            let wallet = user.wallet

                            if (currentChain.type === 'TRX') {
                                wallet = user.trxWallet
                            }

                            return miniAddressSummary(wallet)
                        }
                    },
                    {
                        title: 'Amount',
                        dataIndex: 'value',
                        key: 'value',
                        render: (value, record) => {
                            return value / `1e${currentChain.decimal}`
                        }
                    },
                    {
                        title: 'Status',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status, record) => {
                            return status
                        }
                    }
                ]
            }
        ]

        return (
            <div>
                <Table
                    dataSource={data}
                    loading={this.props.loading}
                    columns={columns}
                    pagination={false}
                    rowKey="updatedAt">
                </Table>
            </div>
        )
    }

    renderCurrentTeamHeads() {
        let data = this.props.currentBets && this.props.currentBets.SMALL || []
        const currentChain = this.getCurrentChain()

        if (!currentChain) {
            return null
        }

        const columns = [
            {
                title: 'SMALL',
                children: [
                    {
                        title: 'Player',
                        dataIndex: 'user',
                        key: 'user',
                        render: (user, record) => {
                            let wallet = user.wallet

                            if (currentChain.type === 'TRX') {
                                wallet = user.trxWallet
                            }

                            return miniAddressSummary(wallet)
                        }
                    },
                    {
                        title: 'Amount',
                        dataIndex: 'value',
                        key: 'value',
                        render: (value, record) => {
                            return value / `1e${currentChain.decimal}`
                        }
                    },
                    {
                        title: 'Status',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status, record) => {
                            return status
                        }
                    }
                ]
            }
        ]

        return (
            <div>
                <Table
                    dataSource={data}
                    loading={this.props.loading}
                    columns={columns}
                    pagination={false}
                    rowKey="updatedAt">
                </Table>
            </div>
        )
    }

    renderAutoAmount() {
        return (
            <div className="auto-amount">
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.1)} className="item">0.10</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.15)} className="item">0.15</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.2)} className="item">0.20</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.3)} className="item">0.30</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.5)} className="item">0.50</Button>
            </div>
        )
    }

    animateNumber(value) {
        return (
            <AnimatedNumber
                value={value}
                formatValue={n => Number(n).toFixed(4)} //{this.formatValue}
                duration={this.state.duration}
            />
        )
    }

    renderTailsBet() {
        const chain = this.getCurrentChain()
        const toDiv = chain ? `1e${chain.decimal}` : 1
        return (
            <div className="tails">
                <div className="image"><img src="/assets/images/tails.svg" /></div>
                <div className="player"><img src="/assets/images/player-tails.png" /> {this.props.currentRound.totalPlayerTails} Bets</div>
                <div className="amount">
                    {this.animateNumber(this.props.betSum.BIG / toDiv)} {this.props.networkSymbol}
                </div>
                <div className="input-bet">
                    <InputNumber size="large"
                        onChange={this.onChaneAmountTails.bind(this)}
                        value={this.state.betAmountTails}
                        defaultValue={this.state.betAmountTails} />
                </div>
                <div className="bet">
                    <Button
                        disabled={this.props.locked || this.props.disabledBet}
                        onClick={this.betGame.
                        bind(this, true, this.state.betAmountTails)}
                        loading={this.props.disabledBet}
                        className="bet-btn">
                        Bet BIG
                    </Button>
                </div>
            </div>
        )
    }

    renderHeadsBet() {
        const chain = this.getCurrentChain()
        const toDiv = chain ? `1e${chain.decimal}` : 1
        // console.log('locked', this.props.locked, this.props.disabledBet)
        return (
            <div className="heads">
                <div className="image"><img src="/assets/images/heads.svg" /></div>
                <div className="player"><img src="/assets/images/player-heads.png" /> {this.props.currentRound.totalPlayerHeads} Bets</div>
                <div className="amount">
                    {this.animateNumber(this.props.betSum.SMALL / toDiv)} {this.props.networkSymbol}
                </div>
                <div className="input-bet">
                    <InputNumber size="large"
                        onChange={this.onChaneAmountHeads.bind(this)}
                        value={this.state.betAmountHeads}
                        defaultValue={this.state.betAmountHeads} />
                </div>
                <div className="bet">
                    <Button
                        disabled={this.props.locked || this.props.disabledBet}
                        onClick={this.betGame.bind(this, false, this.state.betAmountHeads)}
                        loading={this.props.disabledBet}
                        className="bet-btn">
                        Bet SMALL
                    </Button>
                </div>
            </div>
        )
    }

    renderResult() {
        const chain = this.getCurrentChain()
        const toDiv = chain ? `1e${chain.decimal}` : 1
        let winteam = Number(this.state.result) > 3 ? 'BIG' : 'SMALL'
        let wonAmount = winteam === 'BIG' ? this.props.myBetSum.BIG : this.props.myBetSum.SMALL
        wonAmount = wonAmount / toDiv
        let won = Number(wonAmount) > 0
        return (
            <div className="result">
                <button onClick={() => this.playAgain()}> play again</button>
                <Die result={this.state.result}/>
                {/* <h2 className="result">DICE = {this.state.result}</h2> */}
                <h4 className="result">{winteam} WIN</h4>
                {won &&
                    <div>
                        <h4 className="result">WIN AMOUNT = {wonAmount.toFixed(4)}</h4>
                    </div>
                }
                {!won &&
                    <h4 className="result">LOSE</h4>
                }
            </div>)
    }

    renderSpinCountdown() {
        let duration = Math.floor((new Date(this.props.currentRound.endTime).getTime() - new Date(this.props.currentRound.startTime).getTime())/ 1000) + 1
        let distance = Math.floor(new Date(this.props.currentRound.endTime).getTime() / 1000 - this.state.currentTime)
        if (distance < 0) distance = 0

        let displayText = '00'
        if (distance > 0) {
            displayText = distance
        }

        let percent = ((distance / duration)) * 100
        return (
            <div className="countdown-times">
                <Progress strokeColor="red" showInfo={false} type="circle" percent={percent} />
                <div className="times">{displayText}</div>
            </div>
        )
        // return
        // const flip = (<div className="spin-times"><img src="/assets/images/flip.svg" /></div>)
        // const percent = ((distance / 60) / 2) * 100

        // if (this.props.winTeam) {
        //     return null
        // }

        // if (this.props.started) {
        //     if (mmss(this.props.endTime) === '00:00') {
        //         return flip
        //     } else if (mmss(this.props.endTime) !== '00:00') {
        //         return (
        //             <div className="countdown-times">
        //                 <Progress strokeColor="red" showInfo={false} type="circle" percent={percent} />
        //                 <div className="times">{mmss(this.props.endTime)}</div>
        //             </div>
        //         )
        //     } else if (this.props.locked && !this.props.finalized && mmss(this.props.endTime) === '00:00') {
        //         return flip
        //     }
        // } else if (!this.props.started) {
        //     return (
        //         <div className="countdown-times">
        //             <Progress strokeColor="red" showInfo={false} type="circle" percent={this.state.percent} />
        //             <div className="times">00:00</div>
        //         </div>
        //     )
        // }
    }

    renderCountdown() {
        return (
            <div className="countdown">
                <div className="game-name">
                    <img src="/assets/images/coinflip-name.png" />
                </div>
                <div className="content-countdown">
                    {this.props.winTeam === 'TAILS' && <div className="spin-times"><img src="/assets/images/tails.svg" /></div>}
                    {this.props.winTeam === 'HEADS' && <div className="spin-times"><img src="/assets/images/heads.svg" /></div>}
                    {this.state.result === null && this.renderSpinCountdown()}
                    {this.state.result !== null && this.renderResult()}
                </div>
            </div>
        )
    }
}
