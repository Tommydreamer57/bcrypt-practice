const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express()

app.use(bodyParser.json());

const PORT = process.env.PORT || 3011
const CONNECTION_STRING = process.env.CONNECTION_STRING

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(PORT, () => console.log(`app listening on port ${PORT}`))
})


app.get('/users', (req, res) => {
    const db = req.app.get('db')
    db.users().then(users => {
        res.status(200).send(users)
    })
})

app.post('/login', (req, res) => {
    const db = req.app.get('db')
    db.login([req.body.username]).then(user => {
        const username = user[0].username
        const hash = user[0].password
        bcrypt.compare(req.body.password, hash, (err, result) => {
            if (result) {
                console.log(username, hash)
                res.status(200).send(username)
            }
        })
    })
})

app.post('/register', (req, res) => {
    const db = req.app.get('db')
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            db.register([req.body.username, hash]).then(user => {
                console.log(user[0])
            })
        })
    });
})
