const User = require('../models/User');
const Trip = require('../models/Trip');
const { StatusCodes } = require('http-status-codes');
// const { BadRequestError, UnauthenticatedError } = require('../errors');

const createTrip = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const trip = await Trip.create(req.body);
    res.status(StatusCodes.CREATED).json({ trip });

}
const getAllTrips = async (req, res) => {
    const trips = await Trip.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ "trips": trips, "count": trips.length });

}
const getTrip = async (req, res) => {
    const trip = await Trip.findOne({ createdBy: req.user.userId, _id: req.params.id });
    res.status(StatusCodes.OK).json({ trip });
}
const updateTrip = async (req, res) => {

    const { body: { destination, duration, startDate, reason }, user: { userId }, params: { id: tripId } } = req;
    let update = {};
    if (destination === '' || duration === '') {
        throw new BadRequestError('Destination or duration is missing');
    } else {
        update = {
            "destination": destination,
            "duration": duration
        }
    }
    //ByDesign: ignore startDate and reason if empty
    if (startDate && startDate !== '') {
        update.startDate = startDate;
    }
    if (reason && reason !== '') {
        update.reason = reason;
    }

    const trip = await Trip.findOneAndUpdate({ _id: tripId, createdBy: userId }, update, { new: true, runValidators: true });
    if (!trip) {
        throw new Error(`The trip with id ${tripId} was not found`);
    }
    res.status(StatusCodes.OK).json({ trip });

}
const copyTrip = async (req, res) => {
    const { destination, startDate, duration, reason, createdBy } = await Trip.findOne({ createdBy: req.user.userId, _id: req.params.id });
    //TODO: add error handling in case some data is missing (no trip found or something like that)
    if ((!destination) || (!startDate) || (!duration) || (!reason) || (!createdBy)) {
        throw new Error(`The trip with id ${tripId} was not found`);
    }
    const trip = await Trip.create({ destination, startDate, duration, reason, createdBy });
    res.status(StatusCodes.CREATED).json({ trip });

}
const deleteTrip = async (req, res) => {
    const trip = await Trip.findOneAndDelete({ createdBy: req.user.userId, _id: req.params.id });
    if (!trip) {
        throw new Error(`The trip with id ${tripId} was not found`);
    }
    res.status(StatusCodes.OK).send(`The trip with id ${req.params.id} has been successfully deleted.`);
}


module.exports = {
    createTrip,
    getAllTrips,
    getTrip,
    updateTrip,
    copyTrip,
    deleteTrip,
}