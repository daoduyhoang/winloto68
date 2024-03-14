import Base from '../Base';
import create_user from './create_user'
import update_license from './update_license'
import update_point from './update_point'
import update_limit from './update_limit'
import reset_pkey from './reset_pkey'
import get_users from './get_users'

export default Base.setRouter([
    {
        path : '/create_user',
        router : create_user,
        method : 'post'
    },
    {
        path : '/update_license',
        router : update_license,
        method : 'put'
    },
    {
        path : '/update_point',
        router : update_point,
        method : 'put'
    },
    {
        path : '/update_limit',
        router : update_limit,
        method : 'put'
    },
    {
        path : '/reset_pkey',
        router : reset_pkey,
        method : 'put'
    },
    {
        path : '/get_users',
        router : get_users,
        method : 'get'
    },
]);