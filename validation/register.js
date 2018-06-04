const Validator = require('validator');
const isEmpty = require('./is-empty');

// Validates the input for the registration form
module.exports = function validateRegisterInput(data) {
    let errors = {}

    // Checks the inputs to see if they're empty or not
    // if not empty return the input otherwise return empty string
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';


    // if the name from the data object is not between 2 - 30 char
    // sets an error name on the errors object
    if(!Validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters'
    }

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    // Checks to see if the entered email is a real email
    if(!Validator.isEmail(data.email)) {
        errors.email = 'Valid Email required';
    }

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    // Checks to make sure that the password is at least 6 chars
    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters'
    }

    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match'
    }

    return {
        errors,
        // if no errors, means that the input is valid
        // use custom isEmpty function to minimize dependencies
        // returns true if null / undefined / empty object / '' string
        isValid: isEmpty(errors)
    };
};
