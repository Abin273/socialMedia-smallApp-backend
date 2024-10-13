import mongoose from "mongoose";
import validator from "validator";
import { isPasswordStrong } from "../util/validation.js";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxlength: 50,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            min: 4,
            validate(value) {
                if (!isPasswordStrong(value)) {
                    throw new Error(
                        "Password must contain atleast 1 uppercase, 1 lowercase, 1 number, 1 symbol"
                    );
                }
            },
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message: "{VALUE} is not a valid gender type",
            },
        },
        profileUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validae(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid photo url: " + value);
                }
            },
        },
        about: {
            type: String,
            default: "This is a default about of the user!",
        },
        skills: {
            type: [String],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
