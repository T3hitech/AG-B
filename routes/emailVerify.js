const express = require('express');
const router = express.Router();
const { userActivation } = require('../modules/userRegistration');

router.get('/search', async (req, res) => {
    let qParam = req.query.search;
    let decodeParam = Buffer.from(qParam, 'base64').toString('ascii');
    let goToHome = `<a href="http://localhost:4200/Home" class="rbl">GoToHome</a>`
    try {
        let response = await userActivation(decodeParam);
        if (response.error == false) {
            res.status(200).send(goToHome);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;