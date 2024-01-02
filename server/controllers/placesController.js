const DUMMY_PLACES=[
    {
      id: 'p1',
      title:'NS Bulding',
      description: "Govt of WB",
      address: '1, Kiran Shankar Ray Rd, B.B.D. Bagh, Kolkata, West Bengal 700001',
      coordinates:{
        lat: 22.5696536,
        lng: 88.3406204
      },
      creator: 'u1'
    },
    {
      id: 'p2',
      title:'Empire State Bulding',
      description: "One of the most famous sky scrapers in the world",
      address: '20 W 34th St., New York, NY 10001, United States',
      coordinates:{
        lat: 40.7484445,
        lng: -73.9882393
      },
      creator: 'u1'
    }
  ]
const HttpError= require('../models/error')
const { v4: uuidv4 } = require('uuid');
const {validationResult}= require('express-validator')
const Place= require('../models/place');
const mongoose= require('mongoose')
const User = require('../models/user');



const getPlaceByUserId= async (req,res,next)=>{
    const userId= req.params.uid
    let place
    try {
      place= await Place.find({creator: userId})
    } catch (err) {
      const error= new HttpError('Error', 500)
      return next(error)
      
    }  
    if (!place || place.length===0) {
        // console.log(place);
        next(new HttpError("This user have no place :( ", 404))
    }
    return res.status(200).json({place})
    
    
}
const getPlaceById= async (req,res,next)=>{
    const placeId= req.params.pid
    let place
    try {
      place= await Place.findById(placeId)
    } catch (err) {
      const error= new HttpError('Error', 500)
      return next(error)   
    }    
    if (place) {
        console.log(place);
        return res.status(200).json({place: place.toObject( {getters: true} )})
    }
    const error = new HttpError('No place found', 404)
    throw error
}

const createPlace= async (req,res,next)=>{
  console.log(req.body);
    const errors= validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors);
      // throw new HttpError('Please check your data', 422)
      const error= new HttpError('Please check your data', 422)
      return next(error)   
    }
    
    const {title, description, address, image, coordinates, creator}= req.body
    const createdPlace= new Place({
      title,
      description,
      image: 'https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg',   
      address,
      location: coordinates,
      image,
      creator
  })

  let user

  try {
    user= await User.findById(creator)
  } catch (err) {
    const error= new HttpError('Error', 500)
    return next(error)   
  } 
  try {
    const sess= await mongoose.startSession()
    sess.startTransaction()
    await createdPlace.save({ session: sess})
    user.places.push(createdPlace)
    await user.save({ session: sess})
    await sess.commitTransaction()
  } catch (err) {
    const error= new HttpError('Creating place failed! Try again', 500)
    return next(error)
    
  }
    
    res.status(201).json({places: createdPlace})
    // console.log(DUMMY_PLACES);
}

const updatePlaceById= async (req,res,next)=>{
    const errors= validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError('Please check your data', 422)
    }
    const placeId= req.params.pid
    const {title, description} = req.body
    let place
    try {
      place= await Place.findById(placeId)
    } catch (err) {
      const error= new HttpError('Error in fetching', 500)
      return next(error)
      
    }  

    // const updatePlace= { ...DUMMY_PLACES.find(p =>p.id === placeId)}
    // const placeIndex= DUMMY_PLACES.findIndex(p =>p.id === placeId)
    place.title= title
    place.description= description
    try {
      await place.save()
    } catch (err) {
      const error= new HttpError('Error is storing', 500)
      return next(error)
      
    }  
    // DUMMY_PLACES[placeIndex]= updatePlace

    res.status(200).json({place: place.toObject( {getters: true} )})

}

const deletePlaceById=async (req,res,next)=>{

  const placeId= req.params.pid
  
  let place
  let userId
  try {
    place= await Place.findById(placeId)
    userId= place.creator
    console.log(userId);
    console.log(place);
  } catch (err) {
      const error= new HttpError('Error in finding', 404)
      return next(error)
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Find and delete the place document.
    const deletedPlace = await Place.findByIdAndDelete(placeId).session(session);
  
    if (!deletedPlace) {
      const error= new HttpError('Place Not found!!!', 401)
        return next(error)
    }
  
    // 2. Remove the place's ID from the `places` array in the `user` document.
    const user = await User.findById(userId).session(session);
  
    if (!user) {
      const error= new HttpError('User Not Found!!!', 401)
        return next(error)
    }
  
    user.places.pull(placeId);
  
    // 3. Save the updated `user` document.
    await user.save();
  
    // Commit the transaction.
    await session.commitTransaction();
  
    console.log('Place deleted and removed from user\'s places array.');
  } catch (error) {
    // If an error occurs, abort the transaction.
    await session.abortTransaction();
    console.error('Error:', error.message);
  } finally {
    // End the session.
    session.endSession();
  }
  
    

  res.status(200).json({message: "Delete Done........"})

}

exports.getPlaceByUserId = getPlaceByUserId
exports.getPlaceById = getPlaceById
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById