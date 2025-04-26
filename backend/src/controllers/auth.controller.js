import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {

        if(!fullname || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields"})
        }
        if(password.length<6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters"})
        }

        const user = await User.findOne({email})

        if(user) return res.statust(400).json({ message: "email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        })

        if(newUser){
            //generate jwt token
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }else{
            res.status(400).json({message:"invalid user data"})
        }
    }catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Signup successful' });
  }

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields"})
        }

        const user = await User.findOne({email})

        if(!user) return res.status(400).json({ message: "Invalid credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials"});

        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic
        })
    }catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const logout = (req, res) => {
try {
    res.cookie("jwt", "", {maxAge:0})
    return res.status(200).json({ message: "Logged out successfully"})
} catch (error) {
    console.log("Error in logout controller", error.message)
    return res.status(500).json({ message: 'Internal Server Error' });
}
}

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({ message: "Profile pic is required"})
        }
       const uploadResponse = await cloudinary.uploader.upload(profilePic);
       const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {new: true})

        if(!updatedUser) return res.status(400).json({ message: "User not found"});

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in updateProfile controller", error.message)
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({ message: 'Internal Server Error' });
    }

}