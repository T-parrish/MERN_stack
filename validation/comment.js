const Validator = require('validator');
const isEmpty = require('./is-empty');

// Validates the input for the registration form
module.exports = function validateCommentInput(data) {
    let errors = {}

    // Checks the inputs to see if they're empty or not
    // if not empty return the input otherwise return empty string
    data.text = !isEmpty(data.text) ? data.text : '';
    data.name = !isEmpty(data.name) ? data.name : '';
    data.avatar = !isEmpty(data.avatar) ? data.avatar : '';

    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.text)) {
        errors.text = 'text field is required';
    }

    // Checks to make sure that the password is at least 6 chars
    if(!Validator.isLength(data.text, {min: 10, max: 300})) {
        errors.text = 'text must be between 10 - 300 characters'
    }

    return {
        errors,
        // if no errors, means that the input is valid
        // use custom isEmpty function to minimize dependencies
        // returns true if null / undefined / empty object / '' string
        isValid: isEmpty(errors)
    };
};
