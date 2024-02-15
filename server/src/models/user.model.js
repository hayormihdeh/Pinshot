import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false, //Select is used to remove things when its been send as part of the data
    },

    profilePhoto: {
      type: String,
      default:
        'https://res.cloudinary.com/ceenobi/image/upload/v1698666381/icons/user-avatar-profile-icon-black-vector-illustration_mpn3ef.jpg',
    },

    bio: {
      type: String,
      default: 'Nothing to say yet ',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: 'user',
    },

    followers: {
      type: [String],
    },

    following: {
      type: [String],
    },
  },

  {
    timestamps: true,
  }
);
export default model("User", userSchema) //you need to give the function a name so you can be able to call it
