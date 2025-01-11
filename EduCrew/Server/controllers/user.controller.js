import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// update user

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


// delete user


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }

}

export const getUserDetailsById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password'); // Don't include password in the response

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    // Access the user ID from the token
    const userId = req.user.id;

    // Retrieve the user details using the user ID
    const user = await User.findById(userId).select('-password'); // Don't include password in the response

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json(user); // Send the user details as a response
  } catch (error) {
    next(error);
  }
};
