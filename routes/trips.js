const express = require('express');
const router = express.Router();

const { createTrip, getAllTrips, getTrip, updateTrip, copyTrip, deleteTrip } = require('../controllers/trips');

//get >> /trips >> all trips by user
//post >> /trips  >> create trip
//get >> /trips/:id >> get trip details by id
//post >> /trips/update/:id  >> update trip
//post >> /trips/copy/:id  >> copy trip
//post >> /trips/delete/:id  >> delete trip
router.route('/').post(createTrip).get(getAllTrips);
router.route('/:id').get(getTrip);
router.route('/update/:id').post(updateTrip);
router.route('/copy/:id').post(copyTrip);
router.route('/delete/:id').post(deleteTrip);

module.exports = router;