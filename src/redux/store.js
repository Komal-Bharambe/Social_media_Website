import {configureStore} from '@reduxjs/toolkit' 
import appConfigReducer from './slices/appConfigSlice'
import postsReducer from './slices/postsSlices'
import feedDataReducer from './slices/feedSlice'
export default configureStore({
    reducer:{
        appConfigReducer,
        postsReducer,
        feedDataReducer
    }
})
