import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    minLength: 6,
    maxLength: 6,
  },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin:{
      type:Boolean,
      default:false,
    },
    shipping_addresses: [addressSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
