const express= require('express')
const bodyParser= require('body-parser')
const mongoose= require('mongoose')
const placeRoute= require('./routes/place')
const userRoute= require('./routes/user')
const HttpError= require('./models/error')
const cors= require('cors')

const app= express()

app.use(bodyParser.json())
app.use(cors())

// app.use((req, res, next)=>{
//     res.setHeader('Access-control-ALlow-Origin', '*')
//     res.setHeader('Access-control-ALlow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
//     res.setHeader('Access-control-ALlow-Methods', 'GET, POST, PATCH, DELETE')
//     next()
// })
app.use('/places',placeRoute)
app.use('/users',userRoute)


app.use((req,res,next)=>{                   //unknown route err
    const error= new HttpError("This route not listed!!!!!", 404)
    next(error)
})

app.use((error, req, res, next)=>{          //Error middleware
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500).json({message: error.message || 'Unknown Error'})
})

mongoose.connect('mongodb+srv://akash:1234@cluster0.buaqqyp.mongodb.net/places?retryWrites=true&w=majority').then(
    
    ()=>{
        console.log("Database Connected................");
        app.listen(5000,()=>{
            console.log('Server Connected..............');
        })}
).catch((err)=>{
    console.log(err);
})

