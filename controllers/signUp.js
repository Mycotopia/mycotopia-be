'use-strict'
import { prisma } from "../services/db.js";
import { hashPassword } from "../helpers/auth.js";


const signUp = async (req, res) => {
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

export { signUp };