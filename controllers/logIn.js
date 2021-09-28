'use-strict'

const { prisma } = require("../services/db");
const auth = require("../helpers/auth");

module.exports = exports = {};

exports.logIn = async (req, res) => {
    let { username, "password": userPassword } = req.body;

    const { id, "password": dbPasswordHash } = await prisma.user.findUnique({
        where: {
            user_id: username
        }
    }).catch(err => { console.error(err); return res.status(500); });


    if (auth.comparePassword(userPassword, dbPasswordHash) === true) {
        // Set cookie here once session is implemented.
        res.cookie('test', 'value', { httpOnly: true });

        return res.status(200).json({ "message": "success" });
    } else {
        return res.status(401).json({ "message": "Wrong username or password." })
    }
}