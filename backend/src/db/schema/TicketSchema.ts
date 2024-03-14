import {Schema} from 'mongoose';

export const TicketSchema = {
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    client: {type: Schema.Types.ObjectId, ref: 'client'},
    // SETTINGS
    date: {type: String},
    rawTx: {type: String}
};
