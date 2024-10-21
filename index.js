const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const signup = require('./routes/signup');
const verify = require('./routes/emailVerify');
const login = require('./routes/login');
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'DELETE', 'PUT', 'POST']
}));
app.use('/signup', signup);
app.use('/verify', verify);
app.use('/login', login);

app.get('/', (req, res) => {
    res.send('success');
});
app.post('/logintest', (req, res) => {
    let user = req.body;
    res.send(user);
})
app.post('/signuptest', (req, res) => {
    let user = req.body;
    res.send(user);
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));