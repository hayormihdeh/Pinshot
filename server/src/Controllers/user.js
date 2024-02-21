import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { isValidObjectId } from 'mongoose';
import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import generateToken from '../config/generateToken.js';
import env from '../utils/validateEnv.js';
import sendEmail from '../config/sendMail.js';

// Generate the link that will be sent as part of the mail
const createToken = async (userId, token) => {
  const createToken = new Token(userId, token);
  return createToken.save();
};

const verifyToken = async (userId, token) => {
  return await Token.findOne(userId, token);
};

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return next(createHttpError(400, 'Form field missing'));
    }
    const currentUserName = await User.findOne({ userName });
    if (currentUserName) {
      return next(
        createHttpError(409, 'UserName already exists, choose another')
      );
    }
    const currentEmail = await User.findOne({ email });
    if (currentEmail) {
      return next(createHttpError(409, 'Email already exists, choose another'));
    }

    if (!currentUserName || !currentEmail) {
      const salt = await bcrypt.genSalt(10); //ENcrypting the user password(Note: its a crime to see user password )
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        userName: userName,
        email: email,
        password: hashedPassword,
      });

      //vaidating the user i.e the user has the right to make use of our application
      //the token is an identifier for the user, the token is like a validator and if there is no token it means the user is not in your database

      const access_token = generateToken(user._id, user.role);
      // generating random characters or
      //verifying the Email
      let setToken = await createToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      });

      if (!setToken) return next(createHttpError(400, 'Error creating token'));

      const messageLink = `${env.BASE_URL}/verify-email/${user._id}/${setToken.token}`;

      if (!messageLink)
        return next(createHttpError(400, 'Verification message not sent'));
      const sendMail = await sendEmail({
        userName: userName,
        from: env.USER_MAIL_LOGIN,
        to: user.email,
        subject: 'Email verification link',
        text: `Hello, ${userName}, please verify your email by clicking on this link : ${messageLink}. LInk expires  in 30 minutes`,
      });
      if(!sendMail){
        return next(createHttpError(404, "Verification message could not be sent"))
      }
      res
        .status(201)
        .json({ sendMail, access_token, msg: 'User registration successful' });
    }
  } catch (error) {
    next(error);
  }
};

// _id: this is mongodb id

export const sendEmailVerificationLink = async (req, res, next) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, `Invalid userId: ${userId}`));
  }
  try {
    if (!userId) return next(createHttpError(400, 'Invalid userId'));
    const user = await User.findOne({ _id: userId });
    if (!user) return next(createHttpError(400, 'User does not exist'));

    let setToken = await createToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });

    if (!setToken) return next(createHttpError(400, 'Error creating token'));
    const messageLink = `${env.BASE_URL}/verify-email/${user._id}/${setToken.token}`;

    if (!messageLink)
      return next(createHttpError(400, 'Verification message not sent'));
   const sendMail =  await sendEmail({
      userName: user.userName,
      from: env.USER_MAIL_LOGIN,
      to: user.email,
      subject: 'Email verification link',
      text: `Hello, ${user.userName}, please verify your email by clicking on this link : ${messageLink}. LInk expires  in 30 minutes`,
    });
    if(!sendMail){
      return next(createHttpError(404, "Verification message could not be sent"))
    }
    res.status(200).json({ sendMail });
  } catch (error) {
    next(error);
  }
};

//changing the isVerified in our models to verified
//Verifying the user id
export const verifyAccount = async (req, res, next) => {
  const { id: userId, token: token } = req.params;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, `Invalid userId: ${userId}`));
    }
    if (!userId || !token) {
      return next(createHttpError(401, `Invalid params token maybe broken`));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404), 'user not found');
    }

    if (user.isVerified) {
      return res.status(401).send('User has already been verified');
    }

    const getToken = await verifyToken({ userId, token });
    if (!getToken) {
      return next(createHttpError(401, 'Invalid or expired token'));
    } else {
      await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
      res.status(200).send('Email account verified successfully');
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    if (!userName || !password) {
      return next(createHttpError(400, 'Form field missing'));
    }
    const user = await User.findOne({ userName: userName }).select('+password');

    if (!user) {
      return next(createHttpError(401, 'Username or password is incorrect'));
    }
    //checking the passaword if it match the one in our database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(createHttpError(401, 'Username or password is incorrect'));
    }
    // Generating token for our logged in User
    const access_token = generateToken(user._id, user.role);
    res.status(200).json({ access_token, msg: 'Login successful' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//APi to authenticate our user
export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, `Invalid userId: ${userId}`));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(400, `Invalid userId: ${userId}`));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//getting the individual user Name
//This endpoint is responsible for retrieving the user profile based on the provided userName parameter.
export const getUserProfile = async (req, res, next) => {
  const { userName } = req.params;
  try {
    if (!userName) {
      return next(createHttpError(400, 'No params requested'));
    }
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return next(createHttpError(404, ` User not found ${userName}`));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Updating the information of an existing user in our database
export const updateUserProfile = async (req, res, next) => {
  const { id: userId } = req.user;
  const { userName, email, password, profilePhoto, bio } = req.body;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, `Invalid userId: ${userId}`));
    }
    if (!userId) {
      return next(createHttpError(404, 'User not found'));
    }
    const updatedFields = {
      userName,
      email,
      password: password && (await bcrypt.hash(password, 10)),
      profilePhoto,
      bio,
    };

    Object.keys(updatedFields).forEach(
      key =>
        (updatedFields[key] === ' ' || undefined) && delete updatedFields[key]
    );
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });
    if (!updatedUser) {
      return next(createHttpError(404, 'User not found'));
    }

    if (!updatedUser._id.equals(userId)) {
      return next(createHttpError(404, 'You cannot access this user'));
    }
    res
      .status(200)
      .json({ user: updatedUser, msg: 'User info updated successfully' });
  } catch (error) {
    next(error);
  }
};

//forgot Password

export const recoverPasswordLink = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return next(createHttpError(404, 'Email field is missing'));
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(createHttpError(404, 'Email not found'));
    }
    let setToken = await createToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
    if (!setToken) return next(createHttpError(400, 'Error creating token'));
    const messageLink = `${env.BASE_URL}/reset-password/${user._id}/${setToken.token}`;

    if (!messageLink)
      return next(createHttpError(400, 'Verification message not sent'));
    await sendEmail({
      userName: user.userName,
      from: env.USER_MAIL_LOGIN,
      to: user.email,
      subject: 'Password Recovery link',
      text: `Hello, ${user.userName}, please click the link: to reset your password ${messageLink}. LInk expires  in 30 minutes`,
    });
  } catch (error) {
    next(error);
  }
};

//Resetting the user Password
export const resetUserPassword = async (req, res, next) => {
  const { id: userId, token: token } = req.params;
  const { password } = req.body;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, `Invalid userId`));
    }
    if (!password || !token) {
      return next(createHttpError(401, `Invalid params, token maybe broken`));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    const getToken = await verifyToken({ userId, token });
    if (!getToken) {
      return next(createHttpError(401, 'Invalid or expired token'));
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.updateOne({ _id: user._id }, { password: hashedPassword  });
      res.status(200).send('Password updated');
    }
  } catch (error) {
    next(error);
  }
};

//follow a user
export const followAUser = async(req, res, next) => {
  const { id:userId } = req.user
  const { id:followId } = req.params
  try {
    if(!isValidObjectId(userId) || !isValidObjectId(followId)){
      return next(createHttpError(401, "Invalid id"))
    }

    if(!userId || !followId){
      return next(createHttpError(401, "User Parameters missing"))
    }

    if(userId === followId) {
      return next(createHttpError(401, 'You cannot follow yourself'))
    }

    await User.findByIdAndUpdate(userId, {
      $push: { following: followId }
    })
    await User.findByIdAndUpdate(followId, {
      $push: { followers: userId }
    })
    res.status(200).send("Following user successful")
  } catch(error){
    next(error)
  }
}

//Unfollow a user
export const unfollowAUser = async(req, res, next) => {
  const { id:userId } = req.user
  const { id:followId } = req.params
  try {
    if(!isValidObjectId(userId) || !isValidObjectId(followId)){
      return next(createHttpError(401, "Invalid id"))
    }

    if(!userId || !followId){
      return next(createHttpError(401, "User Parameters missing"))
    }

    if(userId === followId) {
      return next(createHttpError(401, 'You cannot unfollow yourself'))
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { following: followId }
    })
    await User.findByIdAndUpdate(followId, {
      $pull: { followers: userId }
    })
    res.status(200).send("Unfollowed user successful")
  } catch(error){
    next(error)
  }
}

//getting the people who are following us
export const getFollowedUsers = async(req,res,next) => {
  const {id: userId} = req.params
  try{
    if(!isValidObjectId(userId)) {
      return next(createHttpError(401, "Invalid userId"))
    }
  const findUser = await User.findById(userId)
  if(!findUser){
    return next(createHttpError(404, 'User not found'))
  }
  const getFollowedIds = findUser.following.map((user) => user)
  const user = await User.find({ _id: getFollowedIds })
  res.status(200).json(user)

  }catch(error){
    console.log(error)
    next(error)
  }
}

//getting the followers
export const getFollowers = async(req,res,next) => {
  const {id: userId} = req.params
  try{
    if(!isValidObjectId(userId)) {
      return next(createHttpError(401, "Invalid userId"))
    }
  const findUser = await User.findById(userId)
  if(!findUser){
    return next(createHttpError(404, 'User not found'))
  }
  const getFollowedIds = findUser.followers.map((user) => user)
  const user = await User.find({ _id: getFollowedIds })
  res.status(200).json(user)

  }catch(error){
    console.log(error)
    next(error)
  }
}