const Validator = require('validator');
const isEmpty = require('./is-empty');

// Validates the input for the registration form
module.exports = function validateExperienceInput(data) {
    let errors = {}

    // Checks the inputs to see if they're empty or not
    // if not empty return the input otherwise return empty string
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.title)) {
        errors.password = 'Job title is required';
    }

    if(Validator.isEmpty(data.company)) {
        errors.company = 'Company field is required';
    }

    if(Validator.isEmpty(data.from)) {
        errors.from = 'From date field is required';
    }


    return {
        errors,
        // if no errors, means that the input is valid
        // use custom isEmpty function to minimize dependencies
        // returns true if null / undefined / empty object / '' string
        isValid: isEmpty(errors)
    };
};
