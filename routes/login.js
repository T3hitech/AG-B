const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { getLoginToken, getLogin } = require('../modules/userRegistration');
require('dotenv').config();

router.post('/getToken', async (req, res) => {
    const postData = req.body;
    try {
        let response = await getLoginToken(postData);
        if (response) {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/getLogin', async (req, res) => {
    let headers = req.headers['authorization'];
    try {
        let response = await getLogin(headers);
        if (response) {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;
