'use-strict'

import bcrypt from "bcryptjs";


export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
}

export const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}