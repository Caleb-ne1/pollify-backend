const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../Models/user');
const {createToken, validateToken} = require("../Middleware/jwt")

router.post("/register", (req, res) => {
    const { full_name, email, password } = req.body;

    bcrypt.hash(password, 16)
        .then((hashedPassword) => {
            const newUser = new User({
                full_name: full_name,
                email: email,
                password: hashedPassword
            });

            return newUser.save();
        })
        .then(() => {
            res.status(201).json({ message: 'User registered successfully!' });
        })
        .catch((err) => {
            res.status(500).json({ error: 'Error registering user', details: err });
        });
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email: email});
    if(!user) {
        res.status(400).send({message: "user does not exist"})
    } else {
        const dbPassword = user.password

        bcrypt.compare(password, dbPassword)
            .then((match) => {
                if(!match) {
                    res.status(400).send({message: "Wrong username or password"})
                } else {
                    const accessToken = createToken(user)

                    res.cookie("access-token", accessToken, {
                        maxAge: 2592000000,
                        httpOnly: true
                    })
                    res.status(200).send({message : `welcome ${user.email}`})
                }
            })
    }
})

module.exports = router
