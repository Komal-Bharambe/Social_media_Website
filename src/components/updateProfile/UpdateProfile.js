import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import userImg from '../../assets/user.png' 
import { setLoading, updateMyProfile } from '../../redux/slices/appConfigSlice';
import Avatar from '../avatar/Avatar';
import './UpdateProfile.scss';
function UpdateProfile() {
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
    const [name, setName] = useState('');
    const[bio, setBio] = useState('');
    const[userImg, setUserImg] = useState('');
    const dispatch = useDispatch();
    useEffect(() =>{
        setName(myProfile?.name || '');
        setBio(myProfile?.bio || '');
        setUserImg(myProfile?.avatar?.url || '')
        
    }, [myProfile]) // data ala ki name and file ka change sathi

    function handleImageChange(e){
        // file reader
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () =>{
            if(fileReader.readyState === fileReader.DONE){
                setUserImg(fileReader.result)
                console.log('img data', fileReader.result) // ya data la pathavto ahe payload la
            }
        }
    }
    function handleSubmit(e){
        e.preventDefault();
        dispatch(updateMyProfile({
            name,
            bio,
            userImg 
        }))
    }
  return (
    <div className='UpdateProfile'>
        <div className='container'>
            <div className='left-part'>
               <div className='input-user-img'>
                    <label htmlFor='inputImg' className='labelImg'>
                        <img src={userImg} alt={name}/>
                    </label>
                    <input className='inputImg' id='inputImg' type="file" accept='image/*' onChange={handleImageChange}/>
               </div>
            </div>
            <div className='right-part'>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} placeholder='your Name' onChange={(e) => setName(e.target.value)
                    }/>
                    <input type="text" value={bio} placeholder='Your Bio'  onChange={(e) => setBio(e.target.value)}/>

                    <input type="submit" className='btn-primary' onClick={handleSubmit}/>
                </form>

                <button className='delete-account btn-primary'>Delete Account</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateProfile