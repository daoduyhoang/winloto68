import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import user from './redux/user'
import member from './redux/member'
import language from './redux/language'
import chain from './redux/chain'
import payment from './redux/payment'
import transaction from './redux/transaction'
import result from './redux/result'
import socket from './redux/socket'
import dice from './redux/dice'
import luckyNumber from './redux/luckyNumber'

const default_state = {
    init: false
};

const appReducer = (state = default_state, action) => {
    switch (action.type) {

    }

    return state
}

export default combineReducers({
    app: appReducer,
    router: routerReducer,
    user: user.getReducer(),
    member: member.getReducer(),
    language: language.getReducer(),
    chain: chain.getReducer(),
    payment: payment.getReducer(),
    transaction: transaction.getReducer(),
    result: result.getReducer(),
    socket: socket.getReducer(),
    dice: dice.getReducer(),
    luckyNumber: luckyNumber.getReducer()
})
