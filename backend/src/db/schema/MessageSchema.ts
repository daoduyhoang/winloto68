import {Schema} from 'mongoose';

export const MessageSchema = {
    text: {type: String, unique: true},
   /*  user: {type: Schema.Types.ObjectId, ref: 'users'},
    room: Number */
}
