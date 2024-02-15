import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import NodeCache from 'node-cache';
import Pin from '../models/pin.model.js';
import User from '../models/user.model.js';

const cache = new NodeCache( {stdTTL:600} )
//gettting all the tags
export const getTags = async (req, res, next) => {
    const cacheTags = cache.get("tags")
  try {
    if(cacheTags){
        return res.status(200).json(cacheTags)
    }
    const getPins = await Pin.find();
    const filterTags = getPins.flatMap((pin) => pin.tags);
    const removeTagsDuplicate = [...filterTags.filter((tag, i) => {
        return filterTags.indexOf(tag) === i
    }),
] 
    console.log(filterTags);
    cache.set("tags", removeTagsDuplicate)
    res.status(200).json(removeTagsDuplicate);
  } catch (error) {
    next(error);
  }
};

export const deleteATag = async(req,res,next) => {
    const {id : pinId} = req.params
    try {
        if (!isValidObjectId(pinId)) {
            return next(createHttpError(400, 'invalid pin id'));
          }
        const pin = await Pin.findById(pinId)
        if(!pin){
            return next(createHttpError(404, "Pin not found"))
        }
        const getTags = {...pin.tags}
        const editTags = getTags.splice(index, 1)
        await Pin .findByIdAndUpdate(pinId, {tags:editTags})
        res.status(200).send("Tag deleted")
    } catch (error) {
        next(error)
    }
} 


export const searchDb = async(req,res,next) => {
    const query = req.query.q
    if(!query) {
        return next(createHttpError(400, "Search parameter is missing"))
    }
    try {
        const searchQuery = query.trim() || req.query.split(" , ").map((tag) => tag.trim())
        const userResult = await User.find({
            userName: {$regex:query, $options: "i"}
        })
        const pinResult = await Pin.find({
            $or: [
                { title: {$regex: searchQuery, $options:"i"}},
                { description: {$regex: searchQuery, $options:"i"}},
                { tags: {$regex: searchQuery, $options:"i"}}
            ]
        })
        const searchResult = userResult.concat(pinResult)
        res.status(200).json(searchResult)
    } catch (error) {
        next(error)
    }
}