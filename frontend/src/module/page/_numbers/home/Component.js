import React from 'react';
import StandardPage from '../../StandardPage';
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import _ from 'lodash'
import './style.scss'
import MediaQuery from 'react-responsive'
import AnimatedNumber from "animated-number-react";
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC, EVENTS} from '@/config/constant'
import { Col, Button, Menu, Dropdown, Input, InputNumber, Icon, DatePicker , Modal, Table, Notification} from 'antd'

import { mmss, miniAddressSummary } from '@/util'
import moment from 'moment';
import { now } from 'moment';
import { object } from 'prop-types';

const dateFormat = 'DD/MM/YYYY'

const { TextArea } = Input;
const { confirm } = Modal;

const numberToText = ['đặc biệt', 'nhất', 'nhì', 'ba', 'tư', 'năm', 'sáu', 'bảy','tám']

export default class extends StandardPage {

    constructor(props) {
        super(props)

        this.state = {
            showDetailByType: true,
            dai: 'MB',
            subDai: 0,
            showClientDetail: false,
            showResult: false,
            showClient: true,
            tmpRawTx: '',
            editingTicket: null,
            dateString: '',
            dateStringVN: '',
            rawTx: '',
            selectedClientName: null,
            selectClient: null,
            setClientName: 'clientName',
            winningMulti: {
                two: 0,
                three: 0,
                four: 0,
                kick: 0
            },
           bonusKick: 0,
           unit: 1000,
           returnPercent: {
            two: 0,
            three: 0,
            four: 0,
           }
        }
    }

    async componentDidMount() {
        const dateString = moment().format("YYYY-MM-DD");
        const dateStringVN = moment().format(dateFormat);
        this.setState({
            dateString: dateString,
            dateStringVN: dateStringVN,
            winningMulti: this.props.user.defaultWinningMulti ? this.props.user.defaultWinningMulti : 0,
            bonusKick: this.props.user.defaultBonusKick ? this.props.user.defaultBonusKick : 0,
            unit: this.props.user.defaultUnit ? this.props.user.defaultUnit : 1000,
            returnPercent: this.props.user.defaultReturnPercent ? this.props.user.defaultReturnPercent : 0
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

    onDateChange = (date, dateString) => {
        const s = moment(date).format('YYYY-MM-DD')
        this.setState({
            dateString: s,
            dateStringVN: moment(date).format(dateFormat)
        })
        this.loadTickets(this.state.selectedClient._id, s)
    }

    onRawTxChange(e) {
        const rawTx = e.target.value
        this.setState({
            rawTx: rawTx
        })
    }

    onTmpRawTxChange(e) {
        this.setState({
            tmpRawTx: e.target.value
        })
    }

    onWinningMultiTwoChange(value) {
       // console.log('onWinningMultiTwoChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.two = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onWinningMultiThreeChange(value) {
       // console.log('onWinningMultiThreeChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.three = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onWinningMultiFourChange(value) {
       // console.log('onWinningMultiFourChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.four = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onWinningMultiKickChange(value) {
       // console.log('onWinningMultiKickChange', value)
        let winningMulti = this.state.winningMulti
        winningMulti.kick = value
        this.setState({
            winningMulti: winningMulti
        })
    }

    onBonusKickChange(value) {
       // console.log('onBonusKickChange', value)
        this.setState({
            bonusKick: value
        })
    }

    onUnitChange(value) {
        // console.log('onUnitChange', value)
         this.setState({
             unit: value
         })
     }

    onReturnPercentTwoChange(value) {
       // console.log('onReturnPercentTwoChange', value)
        let returnPercent = this.state.returnPercent
        returnPercent.two = value
        this.setState({
            returnPercent: returnPercent
        })
    }

    onReturnPercentThreeChange(value) {
       // console.log('onReturnPercentThreeChange', value)
        let returnPercent = this.state.returnPercent
        returnPercent.three = value
        this.setState({
            returnPercent: returnPercent
        })
    }

    onReturnPercentFourChange(value) {
       // console.log('onReturnPercentFourChange', value)
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

    onSelectDai(dai) {
        this.setState({
            dai: dai
        })
    }

    onSelectSubDai(key) {
        this.setState({
            subDai: key
        })
    }

    onSelectClient(client) {
    //    console.log('selectedClient', client)
        this.setState({
            showClient: false,
            selectedClientName: client.name,
            selectedClient: client,
            winningMulti: client.winningMulti,
            bonusKick: client.bonusKick,
            unit: client.unit,
            returnPercent: client.returnPercent,
            setClientName: client.name
        })
        this.loadTickets(client._id, this.state.dateString)
    }

    setEditingTicket(ticket) {
        this.setState({
            editingTicket: ticket._id,
            tmpRawTx: ticket.rawTx
        })
    }

    showClients() {
        this.setState({
            showClient: true
        })
    }
    hideClients() {
        this.setState({
            showClient: false
        })
    }

    showClientDetail() {
        this.setState({
            showClientDetail: !this.state.showClientDetail,
            showResult: false
        })
    }

    showResult() {
        this.setState({
            showResult: !this.state.showResult,
            showClientDetail: false
        })
    }

    renderClients() {
        const clients = this.props.user.clients
        if (!clients) return
        return (
            <Col span={24} >
                <Col span={24} >
                    <Col span={12}>
                        <Button type="dashed" disabled={true} className="maxWidth bgGreen" >{this.state.selectedClientName ? this.state.selectedClientName : "Danh sách"}</Button>
                    </Col>
                    <Col span={12}>
                    {!this.state.showClient &&
                        <Button type="button" className="maxWidth" onClick={() => this.showClients()}>Danh sách <Icon type="down" /></Button>
                    }
                    {this.state.selectedClientName && this.state.showClient &&
                        <Button type="button" className="maxWidth" onClick={() => this.hideClients()}>Ẩn <Icon type="up" /></Button>
                    }
                    </Col>
                </Col>
                <Col className="marginBottom" span={24} >
                    {
                        this.state.showClient && clients.map(client => {
                            return (
                            <Col key={client._id} span={8}>
                                <Button className="maxWidth" type="button" onClick={() => this.onSelectClient(client)}> {client.name} 
                                </Button>
                            </Col>
                            )
                        })
                    }
                </Col>
            </Col>
        )
    }

    renderDais() {
        return (
            <Col span={24} >
                <Col span={12}>
                    <Button className="maxWidth" type="button" onClick={() => this.onSelectDai('MB')}> Miền Bắc </Button>
                </Col>
                <Col span={12}>
                    <Button className="maxWidth" type="button" onClick={() => this.onSelectDai('MN')}> Miền Nam </Button>
                </Col>
            </Col>
        )
    }

    renderSubmitTicket() {
        return (
            <Col span={24}>
                <DatePicker defaultValue={moment()} format={dateFormat} onChange={this.onDateChange} />
                <div className="input-bet">                        
                    <TextArea
                    rows={4}
                    style={{ width: '100%'}}
                    value={this.state.rawTx}
                    onChange={this.onRawTxChange.bind(this)}
                    placeholder={'Paste String'}
                    />
                </div>
                <Col sm={24} md={24}>
                    <Button type="primary" className="maxWidth" onClick={() => this.submitTicket()}>Submit</Button>
                </Col>
                <Col span={24}>
                    <Button onClick={() => this.onShowDetailByType()} className="maxWidth">
                        {this.state.showDetailByType ? 'Ẩn' : 'Hiện chi tiết ngày'} 
                        <Icon type={this.state.showDetailByType ? "up" : "down"} />
                    </Button>
                </Col>
            </Col>
        )
    }

    renderGiais_MB(data) {
        return (data.map((row,key) => {
            return (
                <Col className="marginBottom borderBottom paddingBottom" key={key} span={24}>
                    <p className="removePaddingBottom"> Giải {numberToText[key]} </p>
                    <Button className="maxWidth"><strong>{row.map(number=>{return number + ' '})}</strong></Button>
                </Col>
            )
        }))
    }

    renderDais_MN(data) {
        // if (!this.props.result) return
        // let result = this.props.result.MN
        // let data = result ? result.data : []
        // if (!data || data.length === 0) return null
        // console.log('zzz data', result)
        let selectedSubDai = this.state.subDai >= data.length ? data[0] : data[this.state.subDai]
        return (
            <Col span={24}>
                {data.map((subDai, key) => {
                    return(
                    <Col span={6}>
                        <Button className="maxWidth" type="button" key={subDai.code} onClick={() => this.onSelectSubDai(key)}>{subDai.name}
                        </Button>
                    </Col>
                    )
                })}
                <Col span={24}>
                {selectedSubDai && <p>Đài: {selectedSubDai.name}</p>}
                </Col>
            </Col>
        )
    }

    renderGiais_MN(data) {
        if (!data || data.length === 0) return null
        let subDai = this.state.subDai >= data.length ? data[0] : data[this.state.subDai]
        let giais = subDai.data
        return (giais.map((row,key) => {
            return (
                <Col className="marginBottom borderBottom paddingBottom" key={key} span={24}>
                    <p className="removePaddingBottom"> Giải {numberToText[key]} </p>
                    <Button className="maxWidth"><strong>{row.map(number=>{return number + ' '})}</strong></Button>
                </Col>
            )
        }))
    }

    renderResult() {
        let result = this.props.result[this.state.dai] ? this.props.result[this.state.dai] : null
        let data = result ? this.props.result[this.state.dai].data : []
        return (
            <Col span={24}>
                {this.renderDais()}
                <Col span={24}>
                Kết quả đài {this.state.dai} ngày: {this.state.dateStringVN}
                </Col>
                <Col span={24}>
                {!result && "Kết quả ngày hôm nay chưa xổ. Vui lòng kiểm tra lại sau."}
                </Col>
                {this.state.dai==='MB' && this.renderGiais_MB(data)}
                {this.state.dai==='MN' && this.renderDais_MN(data)}
                {this.state.dai==='MN' && this.renderGiais_MN(data)}
                {/* {data.map((row,key) => {
                    return (
                        <Col key={key} span={24}>
                            <p> Giải {numberToText[key]} </p>
                            <p>{row.map(number=>{return number + ' '})}</p>
                        </Col>
                    )
                })} */}
            </Col>
        )
    }

    renderAddClient() {
        return (
            <div className="normalText">
                <Col className="marginTop" span={24}>
                    <Col span={24} >
                        <Col span={8}>Đơn vị lệnh</Col>
                        <Col span={16}>                            
                            <div className="input-bet">                        
                            <InputNumber
                            disabled={true}
                            style={{ width: '100%'}}
                            value={this.state.unit}
                            onChange={this.onUnitChange.bind(this)}
                            />
                            </div>  
                        </Col>
                    </Col>
                </Col>

                <Col className="marginTop" span={24}>
                    <Col span={8}>Thưởng đá tối đa(lần)</Col>
                    <Col span={16}>                            
                        <div className="input-bet">                        
                        <InputNumber
                        disabled={true}
                        style={{ width: '100%'}}
                        value={this.state.bonusKick}
                        onChange={this.onBonusKickChange.bind(this)}
                        />
                        </div>  
                    </Col>
                </Col>

                <Col className="marginTop" span={24}>
                <Button className="maxWidth">Thắng</Button>
                <Col span={24}>
                        <Col span={12} >
                            <Col span={8}>2 con</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                disabled={true}
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.two}
                                onChange={this.onWinningMultiTwoChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Col>

                        <Col span={12} >
                            <Col span={8}>3 con</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                disabled={true}
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.three}
                                onChange={this.onWinningMultiThreeChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Col>

                        <Col span={12} >
                            <Col span={8}>4 con</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                disabled={true}
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.four}
                                onChange={this.onWinningMultiFourChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Col>

                        <Col span={12} >
                            <Col span={8}>Đá</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                disabled={true}
                                style={{ width: '100%'}}
                                value={this.state.winningMulti.kick}
                                onChange={this.onWinningMultiKickChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Col>
                    </Col>

                    <Col className="marginTop" span={24}>
                        <Button className="maxWidth">Hồi</Button>
                        <Col span={12}>
                            <Col span={8}>2 con (%)</Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                disabled={true}
                                style={{ width: '100%'}}
                                value={this.state.returnPercent.two}
                                onChange={this.onReturnPercentTwoChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Col>

                        <Col span={12}>
                            <Col span={24} >
                                <Col span={8}>3 con (%) </Col>
                                <Col span={14}> 
                                    <div className="input-bet">                        
                                    <InputNumber
                                    disabled={true}
                                    style={{ width: '100%'}}
                                    value={this.state.returnPercent.three}
                                    onChange={this.onReturnPercentThreeChange.bind(this)}
                                    />
                                    </div>  
                                </Col>
                            </Col>
                        </Col>

                        <Col span={12}>
                            <Col span={8}>4 con (%) </Col>
                            <Col span={14}>                            
                                <div className="input-bet">                        
                                <InputNumber
                                disabled={true}
                                style={{ width: '100%'}}
                                value={this.state.returnPercent.four}
                                onChange={this.onReturnPercentFourChange.bind(this)}
                                />
                                </div>  
                            </Col>
                        </Col>
                    </Col>

                </Col>
            </div>
        )
    }

    onShowDetailByType() {
        this.setState({
            showDetailByType: !this.state.showDetailByType
        })
    }

    renderTicketsHeader() {
        if (!this.props.detailByType) return 
        const detailByType = this.props.detailByType
        let data
        if (!this.state.showDetailByType) {
            data = [            {
                type: '+',
                sum: (detailByType[1]).sum + (detailByType[2]).sum + (detailByType[3]).sum + (detailByType[4]).sum,
                returnSum: (detailByType[1]).returnSum + (detailByType[2]).returnSum + (detailByType[3]).returnSum + (detailByType[4]).returnSum,
                winAmount: (detailByType[1]).winAmount + (detailByType[2]).winAmount + (detailByType[3]).winAmount + (detailByType[4]).winAmount,
                rest: (detailByType[1]).returnSum - (detailByType[1]).winAmount + (detailByType[2]).returnSum - (detailByType[2]).winAmount + 
                (detailByType[3]).returnSum - (detailByType[3]).winAmount + (detailByType[4]).returnSum - (detailByType[4]).winAmount
            }] 
        } else {
            data = [
                {
                    type: '2C',
                    sum: (detailByType[2]).sum,
                    returnSum: (detailByType[2]).returnSum,
                    winAmount: (detailByType[2]).winAmount,
                    rest: (detailByType[2]).returnSum - (detailByType[2]).winAmount
                },
    
                {
                    type: '3C',
                    sum: (detailByType[3]).sum,
                    returnSum: (detailByType[3]).returnSum,
                    winAmount: (detailByType[3]).winAmount,
                    rest: (detailByType[3]).returnSum - (detailByType[3]).winAmount
                },
    
                {
                    type: '4C',
                    sum: (detailByType[4]).sum,
                    returnSum: (detailByType[4]).returnSum,
                    winAmount: (detailByType[4]).winAmount,
                    rest: (detailByType[4]).returnSum - (detailByType[4]).winAmount
                },
    
                {
                    type: 'DX',
                    sum: (detailByType[1]).sum,
                    returnSum: (detailByType[1]).returnSum,
                    winAmount: (detailByType[1]).winAmount,
                    rest: (detailByType[1]).returnSum - (detailByType[1]).winAmount
                },
    
                {
                    type: '2C+DA',
                    sum: (detailByType[1]).sum + (detailByType[2]).sum,
                    returnSum: (detailByType[1]).returnSum + (detailByType[2]).returnSum,
                    winAmount: (detailByType[1]).winAmount + (detailByType[2]).winAmount,
                    rest: (detailByType[1]).returnSum - (detailByType[1]).winAmount + (detailByType[2]).returnSum - (detailByType[2]).winAmount
                },
    
                {
                    type: '3C+4C',
                    sum: (detailByType[3]).sum + (detailByType[4]).sum,
                    returnSum: (detailByType[3]).returnSum + (detailByType[4]).returnSum,
                    winAmount: (detailByType[3]).winAmount + (detailByType[4]).winAmount,
                    rest: (detailByType[3]).returnSum - (detailByType[3]).winAmount + (detailByType[4]).returnSum - (detailByType[4]).winAmount
                },
    
                {
                    type: '+',
                    sum: (detailByType[1]).sum + (detailByType[2]).sum + (detailByType[3]).sum + (detailByType[4]).sum,
                    returnSum: (detailByType[1]).returnSum + (detailByType[2]).returnSum + (detailByType[3]).returnSum + (detailByType[4]).returnSum,
                    winAmount: (detailByType[1]).winAmount + (detailByType[2]).winAmount + (detailByType[3]).winAmount + (detailByType[4]).winAmount,
                    rest: (detailByType[1]).returnSum - (detailByType[1]).winAmount + (detailByType[2]).returnSum - (detailByType[2]).winAmount + 
                    (detailByType[3]).returnSum - (detailByType[3]).winAmount + (detailByType[4]).returnSum - (detailByType[4]).winAmount
                },
            ]
        }


      
        const columns = [
            {
                title: <Col span={24}>
                            <Col xs={24} md={24}>
                            {'Ngày ' + this.state.dateStringVN }
                            </Col>
                            {/* <Col xs={12} md={6}>
                            {' Tổng= ' + sum }
                            </Col>
                            <Col xs={12} md={6}>
                            {' Xác= ' + returnSum }
                            </Col>
                            <Col xs={12} md={6}>
                            {' Trúng= ' + winAmount}
                            </Col>
                            <Col xs={12} md={6}>
                            {' Còn= ' + rest}
                            </Col> */}
                        </Col>,
                children: [
                    {
                        title: '#',
                        dataIndex: 'type',
                        key: 'type',
                        render: (type, record) => {
                            return (
                                <p>{record.type}</p>
                            )
                        }
                    },
                    {
                        title: 'Tổng',
                        dataIndex: 'sum',
                        key: 'sum',
                        render: (sum, record) => {
                            return (
                                <p>{record.sum.toFixed(2)}</p>
                            )
                        }
                    },
                    {
                        title: 'Xác',
                        dataIndex: 'body',
                        key: 'body',
                        render: (body, record) => {
                            return (
                                <p>{record.returnSum.toFixed(2)}</p>
                            )
                        }
                    },
                    {
                        title: 'Trúng',
                        dataIndex: 'win',
                        key: 'win',
                        render: (win, record) => {
                            return (
                                <p>{record.winAmount.toFixed(2)}</p>
                            )
                        }
                    },
                    {
                        title: 'Còn',
                        dataIndex: 'rest',
                        key: 'rest',
                        render: (rest, record) => {
                            return (
                                <p>{record.rest.toFixed(2)}</p>
                            )
                        }
                    },
                ]
            }
        ]
        return (
            <Col span={24} className="normalText">
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    rowKey="type"
                    rowClassName={ (record, index) => {  return index !== data.length - 1 ? '' : 'rowHighlight' }   }>

                </Table>
            </Col>
        )
    }

    renderTickets() {
        const unit = this.state.unit ? this.state.unit : 0
        const sum = (this.props.user.sum * unit).toLocaleString(navigator.language, { minimumFractionDigits: 0 })
        const returnSum = (this.props.user.returnSum * unit).toLocaleString(navigator.language, { minimumFractionDigits: 0 })
        const winAmount = (this.props.user.winAmount * unit).toLocaleString(navigator.language, { minimumFractionDigits: 0 })
        const rest = (this.props.user.rest * unit).toLocaleString(navigator.language, { minimumFractionDigits: 0 })
        let obj = Object(this.props.user.tickets)
        let data = Object.keys(obj).map(function(key) {
          return obj[key]
        });
        const columns = [
            {
               /*  title: <Col span={24}>
                            <Col xs={24} md={24}>
                            {'Ngày ' + this.state.dateStringVN }
                            </Col>
                            <Col xs={12} md={6}>
                            {' Tổng= ' + sum }
                            </Col>
                            <Col xs={12} md={6}>
                            {' Xác= ' + returnSum }
                            </Col>
                            <Col xs={12} md={6}>
                            {' Trúng= ' + winAmount}
                            </Col>
                            <Col xs={12} md={6}>
                            {' Còn= ' + rest}
                            </Col>
                        </Col>, */
                title: 'Chi tiết',
                children: [
 /*                    {
                        title: 'Mã',
                        dataIndex: 'rawTx',
                        key: 'rawTx',
                        description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
                        render: (rawTx, record) => {
                            return(<TextArea
                            disabled={record._id !== this.state.editingTicket}
                            rows={4}
                            style={{ width: '100%'}}
                            defaultValue={rawTx}
                            onChange={this.onTmpRawTxChange.bind(this)}
                            placeholder={'Paste String'}
                            />)
                        }
                    }, */
                    {
                        title: 'Lỗi',
                        dataIndex: 'errors',
                        key: 'errors',
                        render: (errors, record) => {
                            return (
                                <p>{record.details.errors.length}</p>
                            )
                        }
                    },
                    {
                        title: 'Tổng',
                        dataIndex: 'sum',
                        key: 'sum',
                        render: (sum, record) => {
                            return (
                                <p>{record.details.sum.toFixed(2)}</p>
                            )
                        }
                    },
                    {
                        title: 'Xác',
                        dataIndex: 'body',
                        key: 'body',
                        render: (body, record) => {
                            return (
                                <p>{record.details.returnSum.toFixed(2)}</p>
                            )
                        }
                    },
                    {
                        title: 'Trúng',
                        dataIndex: 'win',
                        key: 'win',
                        render: (win, record) => {
                            return (
                                <p>{record.details.winAmount.toFixed(2)}</p>
                            )
                        }
                    },
                    {
                        title: 'Còn',
                        dataIndex: 'rest',
                        key: 'rest',
                        render: (rest, record) => {
                            return (
                                <p>{record.details.rest.toFixed(2)}</p>
                            )
                        }
                    },
       /*              {
                        title: 'Sửa',
                        dataIndex: 'delete',
                        key: 'delete',
                        render: (_id, record) => {
                            return (
                                <Col span={24}>
                                    <Col span={24}>
                                        <Button className="maxWidth" onClick={() => record._id === this.state.editingTicket ? this.saveEditingTicket(record) : this.setEditingTicket(record)}>
                                        {record._id === this.state.editingTicket ? 'Lưu' : 'Sửa'}
                                        </Button>
                                    </Col>
                                    <Col span={24}>
                                        <Button className="maxWidth" onClick={() => this.onDeleteTicket(record)}>Xóa</Button>
                                    </Col>
                                </Col>
                            )
                        }
                    }, */
                ]
            }
        ]
    
        return (
            <Col span={24}>
                {this.renderTicketsHeader()}
                <Table
                    dataSource={data}
                    columns={columns}
                    expandedRowRender={record =>
                        <Col span={24}>
                            <Col span={20}>
                            <TextArea
                            disabled={record._id !== this.state.editingTicket}
                            rows={4}
                            style={{ width: '100%'}}
                            defaultValue={record.rawTx}
                            onChange={this.onTmpRawTxChange.bind(this)}
                            placeholder={'Paste String'}
                            />
                            </Col>
                            <Col span={4}>
                                <Col span={24}>
                                    <Col span={24}>
                                        <Button className="maxWidth" onClick={() => record._id === this.state.editingTicket ? this.saveEditingTicket(record) : this.setEditingTicket(record)}>
                                        {record._id === this.state.editingTicket ? 'Lưu' : 'Sửa'}
                                        </Button>
                                    </Col>
                                    <Col span={24}>
                                        <Button className="maxWidth" type="danger" onClick={() => this.onDeleteTicket(record)}>Xóa</Button>
                                    </Col>
                                </Col>
                            </Col>
                            {this.renderLogs(record)}
                        </Col>
                    }
                    pagination={false}
                    rowKey="_id">
                </Table>
            </Col>
        )
      }
    
    renderLogs(ticket) {
        let logs = ticket.details.logs
        // console.log(logs)
        let data = Object.keys(logs).map(function(key) {
            let dai = logs[key].dai
            let detail = logs[key].detail
            let subTicket = logs[key].subTicket
            let numbers = subTicket.numbers
            let cmds = subTicket.cmds.map(ele=> {
                return ele.type + ' ' + ele.value
            })
            return {
                dai: dai,
                numbers: numbers.toString(),
                cmds: cmds.toString(),
                detail: detail,
                color: detail.winAmount>0 ? 'redText' : 'normalText'
            }
        });
        const columns = [
            {
                title: 'Chi tiết',
                children: [
                    {
                        title: 'Đài',
                        dataIndex: 'dai',
                        key: 'dai',
                        sorter: (a, b) => a.dai > b.dai,
                        render: (dai, record) => {
                            return (
                                <p>{record.dai}</p>
                            )
                        }
                    },
                    {
                        title: 'Lệnh',
                        dataIndex: 'cmd',
                        key: 'cmd',
                        render: (value, record) => {
                            return (
                                <p>{record.cmds}</p>
                            )
                        }
                    },
                    {
                        title: 'Số',
                        dataIndex: 'numbers',
                        key: 'numbers',
                        render: (numbers, record) => {
                            return (
                                <p>{record.numbers}</p>
                            )
                        }
                    },
                    {
                        title: 'Tổng',
                        dataIndex: 'sum',
                        key: 'sum',
                        sorter: (a, b) => a.detail.sum - b.detail.sum,
                        render: (numbers, record) => {
                            return (
                                <p>{record.detail.sum}</p>
                            )
                        }
                    },
                    {
                        title: 'Xác',
                        dataIndex: 'returnSum',
                        key: 'returnSum',
                        sorter: (a, b) => a.detail.returnSum - b.detail.returnSum,
                        render: (numbers, record) => {
                            return (
                                <p>{record.detail.returnSum}</p>
                            )
                        }
                    },
                    {
                        title: 'Trúng',
                        dataIndex: 'winAmount',
                        key: 'winAmount',
                        sorter: (a, b) => a.detail.winAmount - b.detail.winAmount,
                        render: (numbers, record) => {
                            return (
                                <p className={record.color}>{record.detail.winAmount}</p>
                            )
                        }
                    },
                    {
                        title: 'Còn',
                        dataIndex: 'rest',
                        key: 'rest',
                        sorter: (a, b) => a.detail.rest - b.detail.rest,
                        render: (numbers, record) => {
                            return (
                                <p>{record.detail.rest}</p>
                            )
                        }
                    },
                ]
            }
        ]
        return (
            <Col span={24} className="normalText">
            <Table
                className="bgDark"
                dataSource={data}
                columns={columns}
                pagination={false}
                rowKey="_id">
            </Table>
        </Col>
        )
    }

    ord_renderContent() {
        const expired = new Date() > new Date(this.props.expiredTime)
        return (
                <div>
                <Col span={1}></Col>
                <Col span={22}>
                    <Col span={24}  className="normalText"><p>Trang chính</p> </Col>
                    <Col className={expired ? "redText" : "normalText"} xs={24} md={24}>Hạn sử dụng: {moment(this.props.expiredTime).format(dateFormat)}</Col>
                    <Col className={"normalText"} xs={24} md={24}>Hoa hồng: đã nhận {Number(this.props.receivedPoint)/30} / tổng {Number(this.props.invitedPoint)/30}</Col>
                    {expired &&
                        <Col className="normalText" xs={24} md={24}>Bạn vui lòng liên hệ admin để đăng ký sử dụng dịch vụ.</Col>
                    }
                    {(!this.props.user.clients || this.props.user.clients.length === 0) && !expired &&
                        <Col className="normalText" xs={24} md={24}>
                            Bạn chưa tạo khách nào. Vui lòng  tạo khách để bắt đầu thống kê kết quả.
                        </Col>
                    }
                    <Col className="normalText" xs={24} md={8}>
                        {this.renderClients()}
                        <Col span={24}>
                            <Col span={12}>
                                {this.state.selectedClient &&
                                    <Button className= "maxWidth" onClick={() => this.showClientDetail()} type="button">{this.state.showClientDetail ? "Ẩn thông tin" : "Hiện thông tin"} 
                                        <Icon type={this.state.showClientDetail ? "up" : "down"} />
                                    </Button>
                                }
                            </Col>
                            <Col span={12}>
                                {this.props.result &&
                                    <Button className= "maxWidth" onClick={() => this.showResult()} type="button">{this.state.showResult ? "Ẩn kết quả" : "Hiện kết quả"}
                                         <Icon type={this.state.showResult ? "up" : "down"} />
                                    </Button>
                                }
                            </Col>
                        </Col>

                        {this.state.selectedClient && this.state.showClientDetail && this.renderAddClient()}
                        {this.props.result && this.state.showResult && this.renderResult()}
                    </Col>
                    <Col xs={0} md={1}></Col>
                    <Col className="normalText" xs={24} md={15}>
                        {this.state.selectedClient && this.renderSubmitTicket()}
                        {this.state.selectedClient && this.renderTickets()}
                    </Col>
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

    async updateClient() {
        const data = {
            _id: this.state.selectedClient._id,
            name: this.state.setClientName,
            winningMulti: this.state.winningMulti,
            bonusKick: this.state.bonusKick,
            unit: this.state.unit,
            returnPercent: this.state.returnPercent
        }
        const rs = await this.props.updateClient(data)
        if (rs) this.setState({selectedClientName: this.state.setClientName})
       // console.log('xxx rs', rs)
    }

    async submitTicket() {
        try {
            const data = {
                client: this.state.selectedClient._id,
                date: this.state.dateString,
                rawTx: this.state.rawTx
            }
            await this.props.submitTicket(data)
            Notification.success({
                message: 'Created',
            })
        } catch(e) {
            Notification.error({
                message: e.toString()
            })
        }
    }

    async loadTickets(client, dateString) {
        const data = {
            client: client,
            date: dateString,
        }
        return await this.props.loadTickets(data)
    }

    async deleteTicket(ticket) {
        await this.props.deleteTicket({_id: ticket._id})
        await this.loadTickets(this.state.selectedClient._id, this.state.dateString)
    }

    async onDeleteTicket(ticket) {
        console.log('xxx delete ticket ', ticket)
        const self = this
        confirm({
            content: <div>Deleting... Are You Sure? </div>,
            onOk() {
                self.deleteTicket(ticket)
                Notification.success({
                    message: 'Deleted',
                })
            },
            onCancel() {
                console.log('Cancel');
                return false
            },
        });
    }

    async saveEditingTicket(ticket) {
        try {
            const tmp = this.state.tmpRawTx
            if (tmp !== ticket.rawTx) {
                console.log('saving', ticket._id, tmp)
                const data = {
                    _id: ticket._id,
                    rawTx: tmp,
                    client: this.state.selectedClient._id,
                    date: this.state.dateString,
                }
                await this.props.updateTicket(data)
            }
            this.setState({
                editingTicket: null
            })
            Notification.success({
                message: 'saved',
            })
        } catch(e) {
            Notification.error({
                message: e.toString()
            })
        }
    }
    
}
