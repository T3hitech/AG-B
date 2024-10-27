const knex = require('knex');
const fs = require('fs');
const { validation } = require('../utils/validation');

const kDB = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBDATABASE,
        port: process.env.DBPORT
    }
});

const pushUser = (user) => {
    return new Promise(async (resolve, reject) => {
        let dbResponse = {};
        try {
            let result = await kDB('USER_ACTIVATION').insert({ USERNAME: user.username, PASSCODE: Buffer.from(user.passcode).toString('base64'), EMAIL: user.email, USERSTATUS: 'PENDING', CREATEDON: new Date() });
            if (result.error) {
                dbResponse.error = 'User not added';
                reject(validation(dbResponse));
            } else {
                dbResponse = 'User Added';
                resolve(validation(dbResponse));
            }
        } catch (err) {
            dbResponse.error = err.sqlMessage;
            reject(validation(dbResponse));
        }
    })
}

const getUser = (username) => {
    return new Promise(async (resolve, reject) => {
        let dbResponse = {};
        try {
            let result = await kDB('USER_ACTIVATION').where({ USERNAME: username });
            if (result.error || result.length == 0) {
                dbResponse.error = 'User Not Found';
                reject(validation(dbResponse));
            } else {
                dbResponse = 'User Found';
                resolve(validation(result));
            }
        } catch (err) {
            dbResponse.error = err.sqlMessage;
            reject(validation(dbResponse));
        }
    })
}

const updateUser = (username) => {
    return new Promise(async (resolve, reject) => {
        let dbResponse = {};
        try {
            let result = await kDB('USER_ACTIVATION').where({ USERNAME: username }).update({ USERSTATUS: 'Active' });
            if (result.error) {
                dbResponse.error = 'Activation Pending';
                reject(validation(dbResponse));
            } else {
                dbResponse = 'User Activated';
                resolve(validation(dbResponse));
            }
        } catch (err) {
            dbResponse.error = err.sqlMessage;
            reject(validation(dbResponse));
        }
    })
}

const getPw = (email) => {
    return new Promise(async (resolve, reject) => {
        let dbResponse = {};
        try {
            let result = await kDB('USER_ACTIVATION').where({ EMAIL: email });
            if (result.error || result.length == 0) {
                dbResponse.error = 'User Not Found';
                reject(validation(dbResponse));
            } else {
                // let decodeParam = Buffer.from(result[0].PASSCODE, 'base64').toString('ascii');
                // dbResponse = decodeParam;
                resolve(validation(result[0]));
            }
        } catch (err) {
            dbResponse.error = err.sqlMessage;
            reject(validation(dbResponse));
        }
    })
}

module.exports = { pushUser, getUser, updateUser, getPw };
