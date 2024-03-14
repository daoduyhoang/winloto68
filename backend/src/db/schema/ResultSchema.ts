import {Schema} from 'mongoose';

export const ResultSchema = {
    dai: {type: String},
    date: {type: String},
    id: {type: String, tolower: true, unique: true}, // = dai + '_' + date
    data: {type: Object}
};
