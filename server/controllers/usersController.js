DUMMY_USERS=[
    {
        id: "u1",
        name: "Akash",
        email: "a@gmail.com",
        password: "1234"
    },
    {
        id: "u2",
        name: "Akash2",
        email: "a2@gmail.com",
        password: "1234"
    }
]
const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/error');
const {validationResult}= require('express-validator')
const User= require('../models/user')

const getUsers= async (req,res,next)=>{
    let user
    try {
        user= await User.find({}, '-password')
    } catch (err) {
        const error= new HttpError('Failed to Login Try again!!!', 401)
        return next(error)
    }

    res.status(200).json({users: user.map(user=>user.toObject( {getters: true} ))})
}
const signup= async (req,res,next)=>{
    const errors= validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError('Please check your data', 422)
    }
    const {name, email, password}= req.body
    // console.log(req.body);
    // const hasEmail= DUMMY_USERS.filter(u=>u.email === email)
    // if (hasEmail) {
    //     throw new HttpError('Email already exists!!!!', 422)
    // }
    let existingUser
    try {
        existingUser= await User.findOne({email: email})
    } catch (error) {
        const err= new HttpError('Something went wrong!!!', 401)
        return next(err)
    }
    if (existingUser) {
        const error= new HttpError('Email already exsists!!!', 401)
        return next(error)
    } 
    const createUser= new User({
        name,
        email,
        password,
        image: 'https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg',
        places: []
    })
    try {
        await createUser.save()
    } catch (err) {
      const error= new HttpError('Sign up Falied!!! Try again', 500)
      return next(error)
      
    }
    // const user= {
    //     id: uuidv4(),
    //     name,
    //     email,
    //     password
    // }
    // DUMMY_USERS.push(user)
    res.status(201).json({user: createUser.toObject( {getters: true} )})
}
const login= async (req,res,next)=>{
    const {email, password}= req.body
    console.log(req.body);
    // const identifiedUser= DUMMY_USERS.find(u=>u.email === email)
    // if (!identifiedUser || identifiedUser.password !==password) {
        
    //     throw new HttpError('Wrong Username and Password!!!!', 401)
    // }

    try {
        existingUser= await User.findOne({email: email, password: password})
    } catch (err) {
        const error= new HttpError('Failed to Login Try again!!!', 401)
        return next(error)
    }
    if (!existingUser) {
        const error= new HttpError('Invalid Email and Password!!!', 401)
        return next(error)
    }
    res.json({message: "You are logged in", user:existingUser.toObject({ getters: true })}).status(400)
}

exports.getUsers= getUsers
exports.signup= signup

exports.login= login