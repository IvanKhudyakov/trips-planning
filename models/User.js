const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name'],
        minLength: 3,
        maxLength: 30,
    },
    lastname: {
        type: String,
        required: [true, 'Please provide the last name'],
        minLength: 3,
        maxLength: 30,
    },
    homecity: {
        type: String,
        required: [true, 'Please provide the last name'],
        match: [
            /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/, 'Please provide the valid city name'
        ],
        minLength: 3,
        maxLength: 30,
    },
    email: {
        type: String,
        required: [true, 'Please provide the email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide the email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide the password'],
        minLength: 6,
    }
})

UserSchema.pre('save', async function () {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.getFullName = function () {
    const fullname = this.name + " " + this.lastname;
    return fullname;
}

UserSchema.methods.generateJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
}

UserSchema.methods.comparePasswords = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);