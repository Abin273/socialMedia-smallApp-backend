import bcrypt from 'bcrypt';

export const generateHashedPassword = async (password) => {
    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
};

export const comparePassword = async (stringPassword, hashedPassword) => {
    const result = await bcrypt.compare(stringPassword, hashedPassword);
    return result;
};