import * as _ from 'lodash'

const create = (list) => {
    return _.zipObject(list, list)
}

export const SIGN_WALLET = '0xe2fc7C62D0bC66c8f52c1c744053A52a432A7ab2'

export const SORT_BY = {
    ALL: 'ALL',
    MORNING: 'MORNING',
    AFTERNOON: 'AFTERNOON',
    NIGHT: 'NIGHT'
}

export const USER_ROLE = {
    MEMBER : 'MEMBER',
    LEADER : 'LEADER',
    ADMIN : 'ADMIN',
    COUNCIL: 'COUNCIL',
    SECRETARY: 'SECRETARY',
}

export const USER_LANGUAGE = {
    en: 'en',
    zh: 'zh',
    vn: 'vn'
}

export const USER_GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
}

export const DEFAULT_IMAGE = {
    TASK: '/assets/images/task_thumbs/12.jpg',
    UNSET_LEADER: '/assets/images/User_Avatar_Other.png'
}

export const SORT_ORDER = create(['ASC', 'DESC'])
