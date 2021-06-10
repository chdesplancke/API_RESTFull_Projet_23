const express = require('express'),
    jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt"),
    router = express.Router(),
    config = require('../config'),
    db = require('../database');

router.post('/register', function(req, res) {
    db.getConnection((err, conn) => {
        conn.query('INSERT INTO users (name, email, password, created_at) VALUE (?,?,?,?)',
            [req.body.name, req.body.email, bcrypt.hashSync(req.body.password, 8), new Date()],
            (error) => {
                if (error) return res.status(500).send("There was a problem registering the user.")
                conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, user) => {
                    conn.release();
                    if (error) return res.status(500).send("There was a problem getting user")
                    let token = jwt.sign({ id: user.id }, config.secret, {expiresIn: 86400 // expires in 24 hours
                    });
                    console.log(token);
                    res.status(200).send({ auth: true, token: token, user: user });
                });
            });
    });
});

router.post('/register-admin', function(req, res) {
    db.getConnection((err, conn) => {
        conn.query('INSERT INTO users (name, email, password, is_admin, created_at) VALUE (?,?,?,?,?)',
            [req.body.name, req.body.email, bcrypt.hashSync(req.body.password, 8), 1, new Date()],
            (error) => {
                if (error) return res.status(500).send("There was a problem registering the user.")
                conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results) => {
                    conn.release();
                    if (error) return res.status(500).send("There was a problem getting user")
                    let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({ auth: true, token: token, user: user });
                });
            });
    });
});

router.post('/login', (req, res) => {
    db.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, user) => {
            conn.release();
            if (error) return res.status(500).send('Erreur interne');
            if (!user[0]) return res.status(404).send('Aucun compte trouvé');
            if (!bcrypt.compareSync(req.body.password, user[0].password))
                return res.status(401).send({ auth: false, token: null });
            let token = jwt.sign({ id: user[0].id }, config.secret, { expiresIn: 86400 // expires in 24 hours
            }); //TODO: mettre tout l'user dans le token
            res.status(200).send({ auth: true, token: token, user: user[0] });
        });
    });
});

module.exports = router;