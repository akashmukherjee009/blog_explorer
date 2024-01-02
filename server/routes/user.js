const express= require('express')
const usersController = require('../controllers/usersController')
const {check} = require('express-validator')

const router= express.Router()

router.get('/', usersController.getUsers)
router.post(
    '/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').not().isEmpty().isLength({min:4}),
    ],
    usersController.signup
)
router.post('/login', usersController.login)


module.exports= router