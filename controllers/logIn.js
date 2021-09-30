'use-strict'

const { prisma } = require("../services/db");
const auth = require("../helpers/auth");

module.exports = exports = {};

exports.logIn = async (req, res) => {

    let session = req.session;
    console.log(session)
    if (session.user_id) {
        return res.status(250).json({ "message": "user already logged in" });
    } else {
        // If user is not authenticated.
        let { username, "password": userPassword } = req.body;

        // Request IP address
        const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // Request User-Agent.
        const userAgent = req.headers['user-agent'] || 'none'


        const { id, "password": dbPasswordHash } = await prisma.user.findUnique({
            where: {
                user_id: username
            }
        }).catch(err => { console.error(err); return res.status(500); });


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
    }
}