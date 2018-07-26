const Validator = require('validator');
const isEmpty = require('./is-empty');

// Validates the input for the registration form
module.exports = function validatePostInput(data) {
    let errors = {}

    // Checks the inputs to see if they're empty or not
    // if not empty return the input otherwise return empty string
    data.text = !isEmpty(data.text) ? data.text : '';

    if(!Validator.isLength(data.text, {min: 10, max: 300})) {
        errors.text = 'Post must be between 10 and 300 characters'
    };

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.text)) {
        errors.text = 'Text Field is Required';
    };

    return {
        errors,
        // if no errors, means that the input is valid
        // use custom isEmpty function to minimize dependencies
        // returns true if null / undefined / empty object / '' string
        isValid: isEmpty(errors)
    };
};
