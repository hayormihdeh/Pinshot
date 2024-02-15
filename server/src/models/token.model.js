import { Schema, model } from 'mongoose';

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, //used to reference a document
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: { type: Date, default: Date.now, expires: 1800 },
  },
  {
    timestamps: true,
  }
);

export default model("Token", tokenSchema)