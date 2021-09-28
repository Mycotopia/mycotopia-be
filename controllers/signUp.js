'use-strict'
const { prisma } = require("../services/db");

module.exports = exports = {};

exports.signUp = async (req, res) => {
    let { } = req.body;
    let user = await prisma.user.findMany();
    res.status(200).json([...user]);
}