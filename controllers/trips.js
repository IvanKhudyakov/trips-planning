const Trip = require('../models/Trip');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { getWeatherData } = require('../utils/weather');
const { getLuggageChecklist, getPreparationChecklist } = require('../utils/checklists');

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
    const user = await User.findOne({ _id: req.user.userId });
    if (!trip) {
        throw new NotFoundError(`The trip with id ${tripId} was not found`);
    }
    
    let weatherForecast = await getWeatherData(trip.destination, trip.duration);
    let luggage = getLuggageChecklist(weatherForecast, trip.duration, trip.reason);
    let prepCheckList = getPreparationChecklist(user, trip, luggage);

    res.status(StatusCodes.OK).json({ trip: trip, forecast: weatherForecast, checklist: prepCheckList});
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
        throw new NotFoundError(`The trip with id ${tripId} was not found`);
    }
    res.status(StatusCodes.OK).json({ trip });

}
const copyTrip = async (req, res) => {
    const { destination, startDate, duration, reason, createdBy } = await Trip.findOne({ createdBy: req.user.userId, _id: req.params.id });
    if (!trip) {
        throw new NotFoundError(`The trip with id ${tripId} was not found`);
    }
    const trip = await Trip.create({ destination, startDate, duration, reason, createdBy });
    res.status(StatusCodes.CREATED).json({ trip });

}
const deleteTrip = async (req, res) => {
    const trip = await Trip.findOneAndDelete({ createdBy: req.user.userId, _id: req.params.id });
    if (!trip) {
        throw new NotFoundError(`The trip with id ${tripId} was not found`);
    }
    res.status(StatusCodes.OK).json({ msg: `The trip to ${trip.destination} has been successfully deleted.` });

}


module.exports = {
    createTrip,
    getAllTrips,
    getTrip,
    updateTrip,
    copyTrip,
    deleteTrip,
}