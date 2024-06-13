const loginRouter = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


loginRouter.post("/", async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            message: 'Invalid username or password'
        })
    }
    const data = {
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        id: user._id
    }
    // create token, expres in 1 hour
    const token = jwt.sign(data, process.env.SECRET, {expiresIn: '1h'})
    return res.status(200).send({ token, userid: user._id, role: user.role, permissions: user.permissions })
})


module.exports = loginRouter