import { createSlice } from "@reduxjs/toolkit";
import appwriteService from '../appwrite/config'
const initialState = {
    posts : [],
    loading: false,
    error: null
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true
        },
        setPosts: (state,action) => {
            state.loading = false
            state.posts = action.payload
        },
        addPosts: (state,action) => {
            state.posts.push(action.payload)
        },
        setError: (state,action) => {
            state.error = action.payload
            state.loading=false
        },
        deletePost: (state,action) => {
            state.posts = state.posts.filter(post => post.$id !== action.payload)
        },
        updatePost: (state,action) => {
            const index = state.posts.findIndex(post => post.$id === action.payload.$id)

            if(index >=0 ){
                state.posts[index] = action.payload
            }
        },
        stopLoading: (state) => {
            state.loading=false
        }
    }
})

export const {startLoading,setError,setPosts,addPosts,deletePost, updatePost,stopLoading} = postSlice.actions

export const fetchPosts = () => async (dispatch) => {
    // Start loading before fetching
    dispatch(startLoading()); 
  
    try {
      // Fetch posts from the appwrite service
      const response = await appwriteService.getPosts();
      
      if (response) {
        // If the fetch is successful, dispatch setPosts with the fetched data
        dispatch(setPosts(response.documents)); 
      }
    } catch (error) {
      // If the fetch fails, dispatch setError with the error message
      dispatch(setError(error.message)); 
    } finally {
      // Stop loading once the fetch operation is complete
      dispatch(stopLoading(false)); 
    }
}



export default postSlice.reducer