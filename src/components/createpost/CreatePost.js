import React, { useState } from 'react'
import Avatar from '../avatar/Avatar'
import './CreatePost.scss'
import backgrounddummyImg from '../../assets/backgroundImg.jpg'
import {BsCardImage} from 'react-icons/bs'
import { axiosClient } from '../../utils/axiosClient'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/slices/appConfigSlice'
import { getUserProfile } from '../../redux/slices/postsSlices'


function CreatePost() {

    const [postImg, setPostImg] = useState('');
    const[caption, setcaption] = useState('');

    const dispatch = useDispatch();

    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const handleImgeChange=(e) =>{
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () =>{
            if(fileReader.readyState === fileReader.DONE){
                setPostImg(fileReader.result)
                console.log('img data', fileReader.result);
            }
        }
    }
    
    const handlePostSubmit = async() =>{
        try{
        dispatch(setLoading(true))
        const result = await axiosClient.post('/posts', {
            caption,
            postImg 
        });
        console.log('post done', result)
        dispatch(getUserProfile({
            userId: myProfile?._id
        }));
    }
    catch(error){
        console.log('what is error', error)
    }
    finally{
        dispatch(setLoading(false))
        setcaption('');
        setPostImg('');
    }
    }
  return (
    <div className='CreatePost'>
        <div className='left-part'>
           <Avatar src={myProfile?.avatar?.url}/>
        </div>
        <div className='right-part'>
            <input
            value={caption}
                className='captionInput'
                type="text" placeholder='What on your mind' onChange={(e) => setcaption(e.target.value)}/>
            {postImg && (

                <div className='img-container'>
                <img className='post-img' src={postImg} alt="post-img"/>
            </div>
            )}
         
            <div className='bottom-part'>
                <div className='input-post-img'>
                    <label htmlFor='inputImg' className='labelImg'>
                       <BsCardImage/>
                    </label>

                    <input className='inputImg' id="inputImg" type="file" accept="image/*" onChange={handleImgeChange}/>
                </div>
                <button className='post-btn btn-primary' onClick={handlePostSubmit}>Post</button>
            </div>

        </div>
    </div>
  )
}

export default CreatePost