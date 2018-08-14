import axios from 'axios';
import {
  ADD_POST, 
  GET_ERRORS, 
  CLEAR_ERRORS,
  GET_POSTS, 
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  LIKE_POST,

} from './types'; 

// add post
export const addPost = (postData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts`, postData)
    .then(res => 
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// add comment
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(res => 
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(res => 
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading);
  axios
    .get('/api/posts')
    .then(res => 
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
}

// Get post
export const getPost = (id) => dispatch => {
  dispatch(setPostLoading);
  axios
    .get(`/api/posts/${id}`)
    .then(res => 
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
}

// Delete posts
export const deletePost = (id) => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res => 
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// Trigger likePost
export const likePost = (id) => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => 
      dispatch({
        type: LIKE_POST,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// Set to loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}

// Clear Errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}