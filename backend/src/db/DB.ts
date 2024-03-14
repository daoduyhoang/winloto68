import * as mongoose from 'mongoose';
import Test from './Test';
import User from './User';
import Log from './Log';
import Connection from './Connection';
import Message from './Message';

import Client from './Client';
import Ticket from './Ticket';
import Result from './Result';


import {utilCrypto} from '../utility';
import * as uuid from 'uuid'

export default class {
    protected db: any;
    public connection: mongoose.ConnectionBase;

    constructor(){
        this.db = {};
    }

    public isConnected(): boolean{
        return this.connection && this.connection.readyState === 1;
    }

    public async start(): Promise<mongoose.ConnectionBase>{
        const url = process.env.DB_URL;
        const db = await mongoose.createConnection(url);
        this.connection = db;

        // Setup callback
        this.connection.on('error', this.handleDBError);

        this.connection.on('disconnected', this.handleUnexpectedDisconnect);

        this.connection.on('reconnected', function () {
            console.log('MongoDB reconnected!');
        });

        await this.initDB(db);

        await this.prepareRecord();

        return db;
    }

    private handleDBError() {

        return (error: any) => {

            console.log('Error is happenning', error);
        };
    }

    private handleUnexpectedDisconnect() {

        console.log('handleUnexpectedDisconnect')

        return (error: any) => {

            console.error('mongodb is disconnect', error);
            setTimeout(() => {
                this.start();
            }, 5000);
        };
    }

    public disconnect() {
        mongoose.connection.close()
    }

    private initDB(db){
        this.db.Test = new Test(db);
        this.db.User = new User(db);
        this.db.Log = new Log(db);
        this.db.Connection = new Connection(db);
        this.db.Message = new Message(db);

        this.db.Ticket = new Ticket(db);
        this.db.Result = new Result(db);
        this.db.Client = new Client(db);
    }

    public getModel(name: string){
        const rs = this.db[name];
        if(!rs){
            throw new Error('invalid model name : '+name);
        }
        return rs;
    }

    private async prepareRecord(){
        const db_user = this.db.User
        let admin = await db_user.findOne({username : 'admin'})
        if (admin) {
            return admin
        }
        // create admin user
        const salt = uuid.v4();
        const password = this.getPassword(process.env.ADMIN_PASSWORD, salt);
        const account = {
            privateKey: process.env.ADMIN_KEY,
            address: process.env.ADMIN_PUBKEY
        }
        const doc = {
            hashKey: this.getPassword(account.privateKey, account.address),
            username: process.env.ADMIN_USERNAME,
            publicKey: account.address,
            privateKey: account.privateKey,
            password,
            salt,
            email: 'admin@gmail.com',
            role: 'ADMIN',
            active: true,
            profile: {
                firstName: 'Admin',
                lastName: '',
                region: {
                    country: 'Global',
                    city: ''
                }
            }
        };
        try{
            const rs = await this.db.User.save(doc);
            console.log('create admin user =>', rs);
        }catch(err){
            if(err.code === 11000){
                console.log('admin user already exists');
            }
            else{
                console.error(err);
            }
        }
    }

    private getPassword(password, salt){
        return utilCrypto.sha512(password+salt);
    }
}
