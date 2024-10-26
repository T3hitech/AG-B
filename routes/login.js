const express = require('express');
const router = express.Router();
const { getLoginToken, getLogin, getForwardPw } = require('../modules/userRegistration');
require('dotenv').config();

router.post('/getToken', async (req, res) => {
    const postData = req.body;
    try {
        let response = await getLoginToken(postData);
        if (response) {
            res.status(200).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (err) {
        res.status(200).send(err);
    }
})

router.get('/getLogin', async (req, res) => {
    let headers = req.headers['authorization'];
    try {
        let response = await getLogin(headers);
        if (response) {
            res.status(200).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (err) {
        res.status(200).send(err);
    }
})

router.post('/forgotpw', async (req, res) => {
    let email = req.body;
    try {
        let response = await getForwardPw(email);
        res.status(200).send(response);
    } catch (err) {
        res.status(200).send(err);
    }
})

module.exports = router;
