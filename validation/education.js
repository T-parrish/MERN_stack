const Validator = require('validator');
const isEmpty = require('./is-empty');

// Validates the input for the registration form
module.exports = function validateEducationInput(data) {
    let errors = {}

    // Checks the inputs to see if they're empty or not
    // if not empty return the input otherwise return empty string
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    // Checks to make sure that the field isn't empty
    if(Validator.isEmpty(data.school)) {
        errors.school = 'School field is required';
    }

    if(Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required';
    }

    if(Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Field of study is required';
    }

    if(Validator.isEmpty(data.from)) {
        errors.fieldofstudy = 'From date field is required';
    }

    return {
        errors,
        // if no errors, means that the input is valid
        // use custom isEmpty function to minimize dependencies
        // returns true if null / undefined / empty object / '' string
        isValid: isEmpty(errors)
    };
};
