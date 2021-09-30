'use-strict'

const { prisma } = require("../services/db");

module.exports = exports = {};

exports.logOut = (req, res) => {
    const body = req.body;
    const session = req.session;
    console.log(session);

    if (session.user_id) {
        req.session.destroy(async err => {
            await prisma.userSessions.update({
                where: {
                    id: session.user_session_id
                },
                data: {
                    is_valid: false
                }
            }).then(sessionRecord => {
                console.log(sessionRecord);
                res.status(200).json({});
            }).catch(err => {
                console.error(err);
            });
        })
    } else {
        session.destroy(err => {
            res.status(400).json({ "message": "Invalid request. User not logged in." })
        })
    }
}