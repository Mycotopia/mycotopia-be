'use-strict'

import { prisma } from "../../services/db.js";
import { comparePassword, hashPassword } from "../../helpers/auth.js";


// User SignUp
export const signUp = async (req, res) => {
    let { fullName, username, emailAddress, password } = req.body;

    // Repacking user name.
    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');

    // Hashing Password. TODO Move this to a middleware function.
    password = hashPassword(password);

    // Request IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Request User-Agent.
    const userAgent = req.headers['user-agent'] || 'none'

    // Only get email address. Query contains sensitive data.
    const { email } = await prisma.user.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email: emailAddress,
            user_id: username,
            password,
            profile: {
                create: {}
            },
            sign_up_metadata: {
                create: {
                    ip_address: ip,
                    user_agent: userAgent,
                }
            }
        }
    }).catch(err => {
        console.error(err);
        return res.status(409).json({ "message": "email or username already exists." })
    })
    return res.status(201).json({ email });
}


// User LogIn.
export const logIn = async (req, res) => {

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

            if (comparePassword(userPassword, dbPasswordHash) === true) {

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
                return res.status(404).json({ "message": "Wrong username or password." })
            }
        }).catch(err => {
            console.error(err);
            res.status(404).json({ "message": "Wrong username or password." });
            return
        });
    }
}


// User LogOut.
export const logOut = (req, res) => {
    const body = req.body;
    const session = req.session;

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