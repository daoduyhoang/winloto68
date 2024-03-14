import React from 'react';
import ReactDOM from 'react-dom'
import {Helmet} from "react-helmet"
import _ from 'lodash';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import store from '@/store';
import config from '@/config';
import {USER_ROLE} from '@/constant'
import {api_request} from "./util";
import URI from 'urijs'
import UserService from '@/service/UserService'
import SocketService from '@/service/SocketService'
import io from 'socket.io-client'

import './boot';
import './style/index.scss';
import './style/mobile.scss';

const middleware = (render, props)=>{
	return render;
};

const App = () => {
    return (
        <div>
            <Helmet>
                <meta name="cr-env" content={process.env.NODE_ENV} />
                <meta name="cr-version-number" content={process.env.CR_VERSION ? '' + process.env.CR_VERSION : 'unknown'} />
                {process.env.NODE_ENV === 'production' && <script defer src="/assets/js/rollbar_prod.js"></script>}
                {process.env.NODE_ENV === 'staging' && <script defer src="/assets/js/rollbar_staging.js"></script>}
                {process.env.NODE_ENV === 'production' && <script async src={'https://www.googletagmanager.com/gtag/js?id=' + process.env.GA_ID}></script>}
                {process.env.NODE_ENV === 'production' && <script>{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '` + process.env.GA_ID + `');`}</script>}
                {/*
                <script>{
                    (function() {
                        window.Intercom("update");
                    })()
                }</script>
                */}
            </Helmet>
            <Switch id="ebp-main">

                {
                    _.map(config.router, (item, i) => {
                        const props = _.omit(item, ['page', 'path', 'type']);
                        const R = item.type || Route;
                        return (
                            <R path={item.path} key={i} exact component={item.page} {...props} />
                        );
                    })
                }
            </Switch>
        </div>
    );
};

const render = () => {
    ReactDOM.render(
        (
            <Provider store={store}>
                <ConnectedRouter middleware={middleware} history={store.history}>
                    <App/>
                </ConnectedRouter>
            </Provider>
        ),
        document.getElementById('ebp-root')
    );
};

if (!sessionStorage.getItem('api-token') && localStorage.getItem('api-token')) {
    sessionStorage.setItem('api-token', localStorage.getItem('api-token'))
}

if (sessionStorage.getItem('api-token') && !localStorage.getItem('api-token')) {
    store.history.push('/login')
    sessionStorage.clear();
}

const userService = new UserService()
const socket = io.connect(process.env.SERVER_URL)
const socketService = new SocketService()

socket.on('connect', () => {
    socketService.initEvent(socket)
})

if (sessionStorage.getItem('api-token')) {
    const userRedux = store.getRedux('user');
    api_request({
        path : '/api/user/current_user',
        success : (data)=>{
            userService.setLogged(data, false)

            render()
        },
        error: () => {
            sessionStorage.clear()
            localStorage.removeItem('api-token')
            render()
        }
    });
}
else {
    const params = new URI(window.location.search || '').search(true)
    if (params.ref) {
        localStorage.setItem('ref', params.ref)
    }
    render();
}

