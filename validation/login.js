const Validator = require('validator');
const isEmpty = require('./is-empty');

// Validates the input for the registration form
module.exports = function validateLoginInput(data) {
    let errors = {}

    // Checks the inputs to see if they're empty or not
    // if not empty return the input otherwise return empty string
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // Checks to see if the entered email is a real email
    if(!Validator.isEmail(data.email)) {
        errors.email = 'Valid Email required';
    }

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    // Checks to make sure that the password is at least 6 chars
    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password is at least 6 characters'
    }

    return {
        errors,
        // if no errors, means that the input is valid
        // use custom isEmpty function to minimize dependencies
        // returns true if null / undefined / empty object / '' string
        isValid: isEmpty(errors)
    };
};
