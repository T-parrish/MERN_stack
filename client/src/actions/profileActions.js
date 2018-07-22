import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS } from './types';

import { logoutUser } from '../actions/authActions';

//Get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios.get('/api/profile')
    .then(res => 
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    )
}

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}

// Create profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete account and profile
export const deleteProfile = () => dispatch => {
  if(window.confirm('Are you sure? This cannot be undone.')) {
    axios
      .delete('/api/profile')
      .then(res => {
        dispatch(logoutUser());
      })
      .catch(err => 
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
}

// Add experience to profile
export const addExperience = (experienceData, history) => dispatch => {
  axios
    .post('/api/experience', experienceData)
    .then(res => history.push('/dashboard'))
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};