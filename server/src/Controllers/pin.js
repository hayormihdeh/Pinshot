import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import NodeCache from 'node-cache';
import Pin from '../models/pin.model.js';
import User from '../models/user.model.js';
import Comment from "../models/comment.model.js"

const cache = new NodeCache({ stdTTL: 300 });

export const createAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const pinParams = req.body;

  try {
    if (!userId || !pinParams) {
      return next(createHttpError(400, 'Invalid userId or parameters missing'));
    }
    const user = await User.findById(userId);
    const pinData = {
      userId: user._id,
      title: pinParams.title,
      description: pinParams.description,
      image: pinParams.image,
      tags: pinParams.tags,
    };

    const pin = await Pin.create(pinData);
    res.status(201).json(pin);
  } catch (error) {
    next(error);
  }
};

//getting all the post/ adding pagination
export const getAllPins = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; ///for the note task you need only this line after that just pass in your res.status
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  try {
    const count = await Pin.countDocuments();
    const pins = await Pin.find()
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);
    if (!pins) {
      return next(createHttpError('404', 'Pins not found'));
    }
    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalpages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

//Api to generate random posts
export const getRandomPins = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const cacheKey = `randomPins_${page}_${limit}`; 

  try {
    const cachedPins = cache.get(cacheKey);
    if (cachedPins) {
      res.status(200).json(cachedPins);
    }
    const count = await Pin.countDocuments();
    const pins = await Pin.aggregate([{ $sample: { size: 2 } }])
      .skip(skipCount)
      .limit(limit);

    if (!pins) {
      return next(createHttpError('404', 'Pins not found'));
    }
    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalpages: totalPages,
      pins: pins,
    };
    cache.set(cacheKey, allPins);
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

//getting the pins of the people i followed or following me
export const getFollowedPins = async (req, res, next) => {
  const { id: userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, 'invalid user'));
    }
    const count = await Pin.countDocuments();
    const subscribedPins = user.following;
    const pins = await Pin.find({
      $or: [{ userId: { $in: subscribedPins } }, { userId: userId }],
    })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);

    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalpages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

//Pins by the user
export const getPinsByUser = async (req, res, next) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, 'invalid user id'));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    const count = await Pin.countDocuments();
    const pins = await Pin.find({ userId: user._id })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);
    const totalPages = Math.ceil(count / limit);
    if (!pins) {
      return next(createHttpError(404, 'Pins not found'));
    }
    const allPins = {
      currentPage: page,
      totalpages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

//Getting a single pin
export const getASinglePin = async (req, res, next) => {
  const { id: pinId } = req.params;
  if (!isValidObjectId(pinId)) {
    return next(createHttpError(400, 'invalid pin id'));
  }
  try {
    const pin = await Pin.findById(pinId).populate("userId", "userName profilePhoto followers");
    if (!pin) {
      return next(createHttpError(400, 'Pin not found'));
    }
    res.status(200).json(pin);
  } catch (error) {
    next(error)
  }
};

export const likeAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, 'invalid user or pin id'));
  }
  try {
    const pin = await Pin.findByIdAndUpdate(pinId, {
      $addToSet: { likes: userId },
    });
    if (!pin) {
      return next(createHttpError(400, 'invalid user or pin id'));
    }
    if (pin.likes.includes(userId)) {
      res.status(400).send('You already liked this pin');
    }
    res.status(200).json('Pin liked');
  } catch (error) {
    next(error);
  }
};

export const disLikeAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, 'invalid user or pin id'));
  }
  try {
    const pin = await Pin.findByIdAndUpdate(pinId, {
      $pull: { likes: userId },
    });
    if (!pin) {
      return next(createHttpError(400, 'invalid user or pin id'));
    }
    res.status(200).json('Pin disliked');
  } catch (error) {
    next(error);
  }
};

//getting all the liked pins
export const getPinsLikedByUser = async (req, res, next) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, 'invalid user or pin id'));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  try {
    const pins = await Pin.find({ likes: userId })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);
    const count = await Pin.countDocuments();
    const totalPages = Math.ceil(count / limit);
    if (!pins) {
      return next(createHttpError(404, 'Pins not found'));
    }
    const allPins = {
      currentPage: page,
      totalpages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

// updating a pin
export const updateAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  const pinParams = req.body;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, 'invalid user or pin id'));
  }
  if (!pinParams) {
    return next(createHttpError(400, 'Parameters missing'));
  }
  try {
    const updatedFields = {
      title: pinParams.title,
      description: pinParams.description,
      image: pinParams.image,
      tags: pinParams.tags,
    };

    Object.keys(updatedFields).forEach(
      key =>
        (updatedFields[key] === ' ' || undefined) && delete updatedFields[key]
    );

    const updatedPin = await Pin.findByIdAndUpdate(pinId, updatedFields, {
      new: true,
    });
    if (!updatedPin) {
      return next(createHttpError(404, 'Pin could not be updated'));
    }

    if (!updatedPin.userId.equals(userId)) {
      return next(createHttpError(404, 'You can only update your pin'));
    }
    res
      .status(200)
      .json({ pin: updatedPin, msg: 'Pin updated successfully'})
  } catch (error) {
    next(error)
  }
};

//Deleting a pin 
export const deleteAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, 'invalid user or pin id'));
  }
  try {
    const pin = await Pin.findById(pinId)
    if(!pin ){
      return next (createHttpError(404, "Pin not found"))
    }
    if (!pin.userId.equals(userId)) {
      return next(createHttpError(401, 'You can only delete your pin'));
    }
    await Comment .deleteMany({ pinId: pinId })
    await pin.deleteOne()
    res.status(200).send("Pin deleted")
  }catch(error) {
    next(error)
  }
}

//Getting related Pins
export const getRelatedPins = async (req, res, next) => {
  const {id: pinId} = req.params
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, 'invalid user or pin id'));
  }
  try {
    const pin = await Pin.findById(pinId)
    if (!pin) {
      return next(createHttpError(404, 'Pin not found'))
    }
    const getTags = pin.tags
    const getRelatedTags = await Pin.find({tags: {$in: getTags}})
    const filterRelatedPins = getRelatedTags.filter((allPins) => allPins.id !== pinId)
    res.status(200).json(filterRelatedPins)
  } catch (error) {
    next(error)

  }
}