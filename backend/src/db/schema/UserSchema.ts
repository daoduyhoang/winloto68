import {Schema} from 'mongoose'
import {PictureSchema} from './PictureSchema'

const defaultWinningMulti = {
    two: 75,
    three: 650,
    four: 6000,
    kick: 650,
}

const defaultBonusKick = 1

const defaultReturnPercent = {
    two: 75,
    three: 68,
    four: 68,
}

const defaultUnit = 1000

export const Region = {
    country: String,
    state: String,
    city: String
}

export const Profile = {
    firstName : String,
    lastName: String,
    avatar : String,
    avatarFilename: String,
    avatarFileType: String,
    banner : String,
    bannerFilename: String,
    bannerFileType: String,
    gender : String,
    birth : Date,
    timezone: String,
    region: Region,
    country : String,
    state : String,
    city : String,
    profession: String
}

export const User = {
    profile : Profile,
    defaultLanguage: String,
    // constants.USER_ROLE
    active : {
        type : Boolean,
        default : false
    },
    // resetToken, ensure this is never returned
    resetToken: String,
    logins: [Date],
    googleId: String,
    facebookId: String,
    password: String,
    salt: String,
    privateKey: String,
    publicKey: String,
    amountNeedAprove: Number,
    limitPerDay: Number,
    limitPerWeek: Number,
    limitPerMonth: Number,
    milestoneDay: Date,
    milsetoneWeek: Date,
    milsetoneMonth: Date,
    appName: String,
    email: String,
    username: {type: String, lowercase: true, unique: true},
    hashKey: String,
    role: String,
    status: String,
    ipAddress: String,
    isBanned: {type: Boolean, default: false},
    invitedBy: {type: Schema.Types.ObjectId, ref: 'users'},
    invitedPoint: {type: Number, default: 0},
    receivedPoint: {type: Number, default: 0},
    
    clientCount: {type: Number, default: 0},
    clientLimit: {type: Number, default: 10},
    expiredTime: {type: Date, default: +new Date()}, // + 30*24*60*60*1000
    defaultWinningMulti : {type: Object, default: defaultWinningMulti},
    defaultBonusKick : {type: Object, default: defaultBonusKick},
    defaultReturnPercent : {type: Object, default: defaultReturnPercent},
    defaultUnit : {type: Number, default: 1000},
}
