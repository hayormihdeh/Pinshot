import { Schema, model } from 'mongoose';

const commentSchema = new Schema ({
    userId: {
        type : Schema.Types.ObjectId, //used to reference a document
        ref : "User",
        required : true
      },
      pinId : {
        type :String,
        require : true
      },
      comment : {
        type : String,
        require :true
      },
      likes : {
        type : [String],
        default : []
      },
      likeCount : {
        type : Number,
        default : 0
      }

},
{
    timestamps: true
}
)
export default model ("Comment", commentSchema)