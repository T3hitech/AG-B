const express = require('express');
const router = express.Router();
const { validation } = require('../utils/validation');
const mail = require('../modules/sendMail');
const dbOps = require('../modules/dbOps');
const Joi = require('joi');
const { signUpuser } = require('../modules/userRegistration');

router.post('/', async (req, res) => {
    let userDetails = req.body;
    try {
        let response = await signUpuser(userDetails);
        if (response.error == false) {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        res.status(200).send(err);
    }
});

module.exports = router;