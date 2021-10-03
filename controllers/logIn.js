'use-strict'

const { prisma } = require("../services/db");
const auth = require("../helpers/auth");

module.exports = exports = {};

exports.logIn = async (req, res) => {

    let session = req.session;
    if (session.user_id) {
        return res.status(250).json({ "message": "user already logged in" });
    } else {
        // If user is not authenticated.
        let { username, "password": userPassword } = req.body;

        // Request IP address
        const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // Request User-Agent.
        const userAgent = req.headers['user-agent'] || 'none'

        let user = await prisma.user.findUnique({
            where: {
                user_id: username
            }
        }).then(async user => {
            if (user === null) {
                throw new Error("user does not exist");
            }

            const { id, "password": dbPasswordHash } = user;

            if (auth.comparePassword(userPassword, dbPasswordHash) === true) {

                const { "id": userSessionsId } = await prisma.userSessions.create({
                    data: {
                        token: req.session.id,
                        ip_address: ip_address,
                        user_agent: userAgent,
                        user_id: id
                    }
                })


                // Setting session with the user id.
                req.session.user_id = id;
                req.session.user_session_id = userSessionsId;


                return res.status(200).json({ "message": "success" });
            } else {
                return res.status(401).json({ "message": "Wrong username or password." })
            }
        }).catch(err => {
            console.error(err);
            res.status(404).json({ "message": "User does not exist." });
            return
        });
    }
}