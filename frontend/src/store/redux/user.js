import BaseRedux from '@/model/BaseRedux';
import { now } from 'moment';

class UserRedux extends BaseRedux {
    defineTypes() {
        return ['user'];
    }

    defineDefaultState() {
        return {
            loading: false,
            avatar_loading: false,

            is_login: false,
            is_leader: false,
            is_admin: false,

            email: '',
            username: '',
            role: '',
            wallet: '',
            trxWallet: '',
            publicKey: '',
            privateKey: '',
            login_form: {
                username: '',
                password: '',
                loading: false
            },

            // TODO: I think we scrap this
            register_form: {
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            },

            profile: {

            },
            current_user_id: null,

            teams: [],
            notifications: [],
            notifications_total: 0,

            popup_update: false,
            showRegisterLoginModal: false,
            countInvite: 0,
            wallets: [],
            balances: [],

            receivedPoint: 0,
            invitedPoint: 0,

            clients: null,
            clientCount: 0,
            clientLimit: 0,
            expiredTime: new Date(),
            tickets: null,
            defaultWinningMulti: null,
            defaultBonusKick: null,
            defaultReturnPercent: null,
            defaultUnit: 1000,

            result: null,

            sum: 0,
            returnSum: 0,
            winAmount: 0,
            rest: 0,
            detailByType: null
        };
    }
}

export default new UserRedux()
