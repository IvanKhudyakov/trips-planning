const User = require('../models/User');
const Trip = require('../models/Trip');
const { StatusCodes } = require('http-status-codes');
// const { BadRequestError, UnauthenticatedError } = require('../errors');

const createTrip = async (req, res) => {
    console.log("createTrip");
    res.send("createTrip");

}
const getAllTrips = async (req, res) => {
    console.log("getAllTrips");
    res.send("getAllTrips");

}
const getTrip = async (req, res) => {
    console.log("getTrip");
    res.send("getTrip");

}
const updateTrip = async (req, res) => {
    console.log("updateTrip");
    res.send("updateTrip");

}
const copyTrip = async (req, res) => {
    console.log("copyTrip");
    res.send("copyTrip");

}
const deleteTrip = async (req, res) => {
    console.log("deleteTrip");
    res.send("deleteTrip");

}


module.exports = {
    createTrip,
    getAllTrips,
    getTrip,
    updateTrip,
    copyTrip,
    deleteTrip,
}