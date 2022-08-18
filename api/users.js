const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER localhost:3000/users/register
router.post("/register", async (req, res) => {
    try {
        const { name, username, password } = req.body;
        if (name.length < 1)
            return res.status(400).json({
                message: "Name must be at least 1 character",
                code: 400,
            });
        if (username.length < 8)
            return res.status(400).json({
                message: "Username must be at least 8 characters",
                code: 400,
            });
        if (password.length < 8)
            return res.status(400).json({
                message: "Password must be at least 8 characters",
                code: 400,
            });

        let userFound = await User.findOne({
            username,
        });
        if (userFound)
            return res.status(400).json({
                message: "Username already exists",
                code: 400,
            });

        const user = new User();
        user.name = name;
        user.username = username;

        // HASH / ENCRYPT PASSWORD
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        user.password = hash;
        user.save();
        return res.json({
            message: "Registered Successfully",
            user,
        });
    } catch (e) {
        return res.json({
            e,
            message: "Failed to register",
            code: 400,
        });
    }
});

// LOGIN localhost:3000/users/login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        let userFound = await User.findOne({
            username,
        });
        if (!userFound)
            return res.status(400).json({
                message: "Username does not exist",
                code: 400,
            });

        let isMatch = bcrypt.compareSync(password, userFound.password);
        if (!isMatch)
            return res.status(400).json({
                message: "Incorrect Username / Password",
                code: 400,
            });

        jwt.sign(
            {
                data: userFound,
            },
            "secret",
            {
                expiresIn: "24h",
            },
            (err, token) => {
                if (err)
                    return res.status(400).json({
                        err,
                        message: "Cannot generate token",
                        code: 400,
                    });
                return res.json({ token, message: "Logged in successfully" });
            }
        );
    } catch (e) {
        return res.json({
            e,
            message: "Invalid Credentials",
            code: 400,
        });
    }
});

module.exports = router;
