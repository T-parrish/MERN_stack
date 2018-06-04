const Validator = require('validator');
const isEmpty = require('./is-empty');

// Validates the input for the registration form
module.exports = function validateProfileInput(data) {
    let errors = {}

    // Checks the inputs to see if they're empty or not
    // if not empty return the input otherwise return empty string
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
    data.status = !isEmpty(data.status) ? data.status : '';

    if(!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Handle must be at least 2 characters'
    };

    if(Validator.isEmpty(data.handle)) {
        errors.handle = 'Handle is required';
    };

    if(Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    };

    if(Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills are required';
    };

    if(!isEmpty(data.website)) {
        if(!Validator.isURL(data.website)) {
            errors.website = 'Not a valid url'
        }
    };

    if(!isEmpty(data.youtube)) {
        if(!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid url'
        }
    };
    
    if(!isEmpty(data.twitter)) {
        if(!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid url'
        }
    };
    
    if(!isEmpty(data.facebook)) {
        if(!Validator.isURL(data.facebook)) {
            errors.website = 'Not a valid url'
        }
    };

    if(!isEmpty(data.linkedin)) {
        if(!Validator.isURL(data.linkedin)) {
            errors.website = 'Not a valid url'
        }
    };

    if(!isEmpty(data.instagram)) {
        if(!Validator.isURL(data.instagram)) {
            errors.website = 'Not a valid url'
        }
    };


    return {
        errors,
        // if no errors, means that the input is valid
        // use custom isEmpty function to minimize dependencies
        // returns true if null / undefined / empty object / '' string
        isValid: isEmpty(errors)
    };
};
