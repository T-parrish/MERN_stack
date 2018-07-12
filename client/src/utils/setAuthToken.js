// Axios defaults settings
// utility function that will set the auth header
// automatically for every request 
import axios from 'axios';

const setAuthToken = token => {
  if(token) {
    // apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  }
  else {
    // Delete auth header 
    delete axios.defaults.headers.common['Authorization']
  }
}

export default setAuthToken;