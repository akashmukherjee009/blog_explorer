const express= require('express')
const HttpError= require('../models/error')
const placesController = require('../controllers/placesController')
const {check} = require('express-validator')


const router= express.Router()
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
      creator: 'u2'
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


router.get('/:pid', placesController.getPlaceById)

router.get('/user/:uid',placesController.getPlaceByUserId)

router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty()
  ], 
  placesController.createPlace)

router.patch(
  '/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
  ]
  , placesController.updatePlaceById)

router.delete('/:pid', placesController.deletePlaceById)
module.exports= router