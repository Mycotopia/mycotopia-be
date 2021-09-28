'use-strict'

const bcrypt = require("bcryptjs");

module.exports = exports = {};

exports.hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
}

exports.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}