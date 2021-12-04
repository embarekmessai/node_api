const User = require("../models/User");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

//REGISTER
router.post("/register", async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async(req, res) => {
    try {
        const user = req.body.username ? await User.findOne({ username: req.body.username }) : await User.findOne({ email: req.body.email });
        // const user = await User.findOne({ userame: req.body.username })
        // IF Credentials wrongs
        !user && res.status(401).json("Wrong User Name");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;

        originalPassword != inputPassword && res.status(401).json("Wrong Password");

        const { password, ...others } = user._doc

        res.status(200).json(others);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;