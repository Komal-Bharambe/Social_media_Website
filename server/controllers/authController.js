const User = require('../models/User')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require('../utils/responseWrapper');
const signupController = async(req, res) =>{
    try{
        const {name, email, password} = req.body; // morgan ch kam

        if(!email || !password|| !name){
            // return res.status(400).send('All field are required')
            return res.send(error(400, 'All fields are required'))
        }

        const oldUser = await User.findOne({email})
        if(oldUser){
            // return res.status(409).send('User is already registred');
            return res.send(error(409, 'User is already registred'))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        

        // return res.status(201).json({
        //     user,
        // });
        return res.send(
            success(201, 'user created successfully')
        );
    }catch(e){
        return res.send(error(500, e.message));
    }
}

const loginController = async(req,res) =>{
    try{
        const {email, password} = req.body; // morgan ch kam

        if(!email || !password ){
            // return res.status(400).send('All field are required')
            return res.send(error(400, 'All fields are required'))
        }

        const user = await User.findOne({email}).select('+password'); // + means password pahije 
        if(!user){
            // return res.status(404).send('User is not registred');
            return res.send(error(409, 'User is not registred'))
        }

        const matched = await bcrypt.compare(password, user.password);
        if(!matched){
            // return res.status(403).send('Incorrect password');
            return res.send(error(403, 'Incorrect password'))
        }

        const accessToken = generateAccessToken({_id: user._id,});

        const refreshToken = generateRefreshToken({_id: user._id,});

        res.cookie('jwt', refreshToken, {
             httpOnly:true,
             secure: true  
        })

        // return res.json({ accessToken});
        return res.send(success(200,{accessToken}));
    }
    catch(error){
        console.log(error)
    }
};
//this api will cheack the refrash token validity and generate a new access Token
const refreshAccessTokenController = async(req,res) =>{
   const cookies = req.cookies;
    if(!cookies.jwt){
        // return res.status(401).send("Refresh token in cookie is required")
        return res.send(error(401, 'Refresh token in cookie is required'))
    }

    const refreshToken = cookies.jwt;

    console.log('refresh', refreshToken);
    try{
        const decoded = jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        );

        const _id = decoded._id;
        const accessToken = generateAccessToken({_id});

        // return res.status(201).json({accessToken})
        return res.send(success(201, {accessToken}));
       
    }catch(e){
        console.log(e);
        // return res.status(401).send('Invalid refrash token');
        return res.send(error(401, 'Invalid refresh token'))
    }
}

//interbnal function
const generateAccessToken = (data) =>{
    try{
    const token =  jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY,{
        expiresIn: "1d",
    });
    console.log(token);
    return token;
    }
    catch(error){
        console.log(error)
    }
}

const generateRefreshToken = (data) =>{
    try{
    const token =  jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY,{
        expiresIn: "1y",
    });
    console.log(token);
    return token;
    }
    catch(error){
        console.log(error)
    }
}

const logoutController = async(req, res) =>{
    try{
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        })
        return res.send(success(200, 'User logged out'))
    }
    catch(e){
        return res.send(error(500, e.message));
    }
}
module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
}