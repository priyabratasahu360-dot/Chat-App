import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';

import { generateToken } from '../lib/utils.js';

export const signup = async(req, res) => {
    const {email, fullname, password} = req.body;
    try{
        if(!fullname || !email || !password){
            return res.status(400).json({message: "All fields are reequired"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 character"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "Email already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            });
        }
        else{
            return res.status(400).json({message: "Invalid user data"});
        }
    }
    catch(error){
        console.log("error in signup", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
export const login = async(req, res) => {
    const {email, password} = req.body;
    try{
        if(!email || !password){
            res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Incorrect email or password"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Incorrect email or password"});
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePicture: user.profilePicture
        });
    }
    catch(error){
        console.log("error in login", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}
export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out succesfully"});
    }
    catch(error){
        console.log("error in logout", error.message);
        res.status(500).json({message: "Internal Servor error"});
    }
}

export const updateProfile = async(req, res) => {
    try{
        const {profilePicture} = req.body;
        const userId = req.user._id;
        if(!profilePicture){
            return res.status(400).json({message: "Profile picture is required"});
        }

        const uploadRes = await cloudinary.uploader.upload(profilePicture); // gives a response
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture: uploadRes.secure_url}, {returnDocument: 'after'});

        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log("error in update profile", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("error in checkauth", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}