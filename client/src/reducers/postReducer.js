import { 
  ADD_POST, 
  GET_POSTS, 
  POST_LOADING,
  DELETE_POST,
  LIKE_POST,
} from '../actions/types';

const initialState = {
  posts: [],
  post: {},
  loading: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      }
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      }

    case LIKE_POST:
      return {
        ...state,
        // maps through the posts array and returns updated array
        // only updates the post object with id that matches payload id
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) {
            return {
              ...action.payload
            };
          } else {
            return post;
          }
        })
      };

    default:
      return state;
  }
}