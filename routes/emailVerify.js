const express = require('express');
const router = express.Router();
const { userActivation } = require('../modules/userRegistration');

router.post('/search', async (req, res) => {
    let qParam = req.body.username;
    let decodeParam = Buffer.from(qParam, 'base64').toString('ascii');
    // let goToHome = `<a href="http://localhost:4200/Login" class="rbl">GoToHome</a>`
    try {
        let response = await userActivation(decodeParam);
        res.status(200).send(response);
        // if (response.error == false) {
        //     res.status(200).send(goToHome);
        // } else {
        //     res.status(400).send(response);
        // }
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;