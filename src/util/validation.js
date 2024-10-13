import mongoose from "mongoose";
import validator from "validator";

export const isPasswordStrong = (password) => {
    const options = {
        minLength: 6, // Minimum length of the password
        minLowercase: 1, // Minimum number of lowercase letters
        minUppercase: 1, // Minimum number of uppercase letters
        minNumbers: 1, // Minimum number of numeric digits
        minSymbols: 1, // Minimum number of special characters (symbols)
    };

    return validator.isStrongPassword(password, options);
};

export const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid!");
    } else if (!isPasswordStrong(password)) {
        throw new Error(
            "Password must contain atleast 1 uppercase, 1 lowercase, 1 number, 1 symbol"
        );
    }
};

export const validateEditProfileData = (editData) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "profileUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isEditAllowed = Object.keys(editData).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
};

export const validateObjectId = (id)=> mongoose.isValidObjectId(id)