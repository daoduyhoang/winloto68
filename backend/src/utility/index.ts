import utilCrypto from './crypto';
import mail from './mail';
import validate from './validate';
import sso from './sso';
import getRawResult_MB from './result_MB';
import getRawResult_MN from './result_MN';
import getTime from './time';

export {
    utilCrypto,
    sso,
    validate,
    mail,
    getRawResult_MB,
    getRawResult_MN,
    getTime
};

export const getEnv = () => process.env.NODE_ENV;
