const usersRouter = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {checkSchema, validationResult } = require('express-validator')

const checkSchemas = checkSchema({
    username: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'username is required'
    },
    password: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'password is required',
        isLength: {
            options: {min: 8},
            errorMessage: 'password must be at least 8 characters long'
        }
    },
    email: {
        in: ['body'],
        notEmpty: true,
        isEmail: true,
        errorMessage: 'invalid email address'
    },
    phone: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        isMobilePhone: true,
        errorMessage: 'invalid phone number'
    },
    description: {
        in: ['body'],
        isString: true,
    }
})

// create new user
usersRouter.post('/', checkSchemas, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {username, password, email, phone,role, description} = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username: username,
        passwordHash: passwordHash,
        email: email,
        phone: phone,
        description: description,
        role: role,
        permissions: ['my events']
    })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

// get host users
usersRouter.get('/hosts', async (req, res) => {
    const users = await User.find({role: 'host'})
    res.json(users)
})

module.exports = usersRouter