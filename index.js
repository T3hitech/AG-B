const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const signup = require('./routes/signup');
const verify = require('./routes/emailVerify');
const login = require('./routes/login');
const stripe = require('./routes/stripePayment');
const PORT = process.env.PORT;

// Azure Website URL from environment variable or directly
const AZURE_WEBSITE_URL = process.env.AZURE_WEBSITE_URL || 'https://app-aqwebsite-demo-cenus-001.azurewebsites.net';

app.use(express.json());
app.use(cors({
    origin: [AZURE_WEBSITE_URL, 'http://localhost:4200'],
    methods: ['GET', 'DELETE', 'PUT', 'POST']
}));

app.use('/signup', signup);
app.use('/verify', verify);
app.use('/login', login);
app.use('/stripe', stripe);

app.get('/', (req, res) => {
    res.send('success');
});

app.post('/logintest', (req, res) => {
    let user = req.body;
    res.send(user);
});

app.post('/signuptest', (req, res) => {
    let user = req.body;
    res.send(user);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
