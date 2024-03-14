import {Schema} from 'mongoose';

export const RefSchema = {
    userId: {type: Schema.Types.ObjectId, ref: 'users'},
    inviteBy: {type: Schema.Types.ObjectId, ref: 'users'},
    status: String, // const type PENDING | APPROVE
    approveDate: Date
};
