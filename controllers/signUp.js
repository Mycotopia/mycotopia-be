'use-strict'
const { prisma } = require("../services/db");
const auth = require("../helpers/auth");

module.exports = exports = {};

exports.signUp = async (req, res) => {
    let { fullName, username, emailAddress, password } = req.body;

    // Repacking user name.
    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');

    // Hashing Password. TODO Move this to a middleware function.
    password = auth.hashPassword(password);

    // Request IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Request User-Agent.
    const userAgent = req.headers['user-agent'] || 'none'

    // Only get email address. Query contains sensitive data.
    const { email } = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email: emailAddress,
            userId: username,
            password,
            profile: {
                create: {}
            },
            signUpMetadata: {
                create: {
                    ipAddress: ip,
                    userAgent: userAgent
                }
            }
        }
    }).catch(err => {
        console.error(err);
        return res.status(409).json({ "message": "Duplicate username or email." })
    })
    return res.status(201).json({ email });
}