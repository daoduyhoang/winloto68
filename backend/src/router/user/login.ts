import Base from '../Base';
import UserService from '../../service/UserService';
import {utilCrypto} from '../../utility';
import * as moment from 'moment';
import * as Web3 from 'web3';
const web3 = new Web3()

export default class extends Base {

    /**
     * The API token only encrypts stores the userId, on a request we always query the full user, nothing else
     * passed from the client is trusted.
     *
     * Since we encrypt with the APP_SECRET on the server side we trust that
     *
     * @returns {Promise<{code: number; data: any; message: string} | {code: number; type: string; error: string}>}
     */
    async action(){
        const userService = this.buildService(UserService);
        const param = this.getParam();

        // const account = web3.eth.accounts.privateKeyToAccount(privateKey)
        // const hashKey = userService.getPassword(privateKey, account.address);
        let user
        if (param.privateKey) {
            user = await userService.getUserByPKey(param.privateKey);
        } else {
            if (!param.username || !param.password) throw 'Login fail!'
            user = await userService.getUserByPW(param)
            
        }

        if(!user){
            throw 'Login fail!';
        }

        const resultData = {
            user
        };

        // record user login date
        const updatedAt = await userService.recordLogin({ userId: user.id });

        // always return api-token on login, this is needed for future requests
        this.session.userId = user.id;
        resultData['api-token'] = utilCrypto.encrypt(JSON.stringify({
            userId : user.id,
            updatedAt: updatedAt,
            expired : moment().add(365, 'd').unix()
        }));

        return this.result(1, resultData);
    }
}
