import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password, username } = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      })
    }
    
    // Check for existing username if provided
    if (username) {
      const existingUsername = await User.findOne({ username })
      if (existingUsername) {
        return res.status(400).json({
          message: "User with this username already exists",
        })
      }
    }

    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      username, // Include username if provided
      password: hashPassword,
    })

    await newUser.save()

    generateToken(newUser._id, res)

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
      profilePic: newUser.profilePic,
    })
  } catch (error) {
    console.error("Error in signup controller:", error)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      })
    }
    res.status(500).json({
      message: "Server error",
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        message: "User does not exist"
      });
    }
    
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }
    
    // Generate and set token
    const token = generateToken(user._id, res);
    console.log("Generated token:", token);
    
    // Log the user ID for debugging
    console.log('User logged in with ID:', user._id.toString());
    
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token // Include token in response
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({
      message: "Internal Server error"
    });
  }
};

export const logout = (req, res) => {    
    try{
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({
            message: "Logout successful"
        })
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            message: "Internal Server error"
        })

    }
}

export const updateProfile = async (req, res) => {
     try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message: "Profile pic is required"
            });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
        res.status(200).json(updatedUser);
     }
     catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({
            message: "Internal Server error"
        })
     }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({
            message: "Internal Server error"
        })
    } 
}