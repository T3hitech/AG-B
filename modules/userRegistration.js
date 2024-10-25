const { validation } = require('../utils/validation');
const mail = require('../modules/sendMail');
const dbOps = require('../modules/dbOps');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRETKEY;

const signupSchema = Joi.object({
    email: Joi.string().required().min(5).max(50),
    username: Joi.string().required(),
    passcode: Joi.string().min(5).max(20).required()
});
const loginSchema = Joi.object({
    username: Joi.string().required(),
    passcode: Joi.string().min(5).max(20).required()
});

const signUpuser = (userDetails) => {
    return new Promise(async (resolve, reject) => {
        let valide = {};
        let validate = signupSchema.validate(userDetails);
        if (validate.error) {
            valide.error = validate.error.message;
            reject(validation(valide));
        } else {
            try {
                let userAdd = await dbOps.pushUser(userDetails);
                if (userAdd.error == false) {
                    // try {
                    //     let result = await mail.sendMail(userDetails);
                    //     if (result.error == false) {
                    //         result.msg = 'email sent for activation';
                    //         resolve(result);
                    //     }
                    // } catch (err) {
                    //     reject(err);
                    // }
                    resolve(userAdd);
                } else {
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        }
    })
}

const userActivation = (decodeParam) => {
    return new Promise(async (resolve, reject) => {
        try {
            try {
                let userExist = await dbOps.getUser(decodeParam);
                if (userExist.error == false) {
                    if (userExist.msg[0].USERSTATUS == 'Active') {
                        let status = "User Already Activated";
                        resolve(validation(status));
                    } else {
                        let updateStatus = await dbOps.updateUser(decodeParam);
                        if (updateStatus.error == false) {
                            updateStatus.status = 'Activation Success';
                            resolve(updateStatus);
                        } else {
                            reject(updateStatus);
                        }
                    }
                } else {
                    reject(userExist);
                }
            } catch (err) {
                reject(err);
            }
        } catch (err) {
            reject(err);
        }
    })
}

const verfityUserExistance = (userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            let findStatus = await dbOps.getUser(userDetails.username);
            if (findStatus.error == false && findStatus.msg[0].USERSTATUS == 'Active') {
                resolve(findStatus);
            } else {
                reject(findStatus);
            }
        } catch (err) {
            reject(err);
        }
    })
}

const getLoginToken = (userDetails) => {
    return new Promise(async (resolve, reject) => {
        let valide = {};
        let validStatus = loginSchema.validate(userDetails);
        if (validStatus.error) {
            valide.error = validStatus.error.message;
            reject(validation(valide));
        } else {
            try {
                let response = await verfityUserExistance(userDetails);
                if (response.error == false) {
                    let tokened = tokenGenerate(userDetails);
                    resolve(validation(tokened));
                } else {
                    reject(response);
                }
            } catch (err) {
                reject(err);
            }
        }
    })
}

const getLogin = (headers) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await verifyToken(headers);
            if (response) {
                resolve(response);
            } else {
                reject(response);
            }
        } catch (err) {
            reject(err);
        }
    })
}

const verfityUser = (userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            let findStatus = await dbOps.getUser(userDetails.username);
            if (findStatus.error == false && findStatus.msg[0].USERSTATUS == 'Active') {
                let foundPw = Buffer.from(findStatus.msg[0].PASSCODE, 'base64').toString('ascii');
                if (userDetails.passcode == foundPw) {
                    resolve(findStatus);
                } else {
                    findStatus.error = true;
                    findStatus.msg = "Credentials Not Matched !!";
                    reject(findStatus);
                }
            } else {
                reject(findStatus);
            }
        } catch (err) {
            reject(err);
        }
    })
}

const tokenGenerate = (user) => {
    const tokened = jwt.sign(user, secretKey, { expiresIn: '2h' });
    return tokened ? tokened : null;
}

const verifyToken = (requestHeader) => {
    return new Promise((resolve, reject) => {
        let retToken = {}, retStatus = {};
        if (requestHeader == undefined) {
            retToken.error = 'No Token Found';
            reject(validation(retToken));
        } else {
            let resToken = requestHeader.split(' ')[1];
            if (resToken == '' || resToken == undefined) {
                retToken.error = 'No Token Found';
                reject(validation(retToken));
            } else {
                jwt.verify(resToken, secretKey, async (err, data) => {
                    if (err) {
                        retToken.error = err.message;
                        retStatus = validation(retToken);;
                        reject(retStatus);
                    } else {
                        try {
                            let response = await verfityUser(data);
                            if (response.error == false) {
                                retToken = 'Authorized';
                                resolve(validation(retToken));
                            } else {
                                reject(response);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    }
                });
            }
        }
    })

}

module.exports = { signUpuser, userActivation, getLoginToken, getLogin }