import {Schema} from 'mongoose';

export const ClientSchema = {
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    active: {type: Boolean, default: true}, // const type PENDING | APPROVE
    name: {type: String},
    // SETTINGS
    winningMulti: {type: Object}, // 2,3,4,kick
    bonusKick: {type: Number},
    returnPercent: {type: Object},
    unit: {type: Number}
};
