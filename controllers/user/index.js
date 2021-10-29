'use-strict'

import { prisma } from "../../services/db.js";

export const getUserProfile = async (req, res) => {
    const user_name = req.params.user_name;

    if (!user_name) {
        return res.status(400).json({ "status": "Bad Request." })
    }

    // Never select user password or other sensitive data. Response sent to the public.
    const user = await prisma.user.findUnique({
        where: {
            user_id: user_name
        },
        select: {
            user_id: true,
            first_name: true,
            last_name: true,
            is_banned: true,
            is_verified_user: true,
            profile: {
                select: {
                    desctiption: true,
                    profile_picture: true
                }
            },
            _count: {
                select: {
                    following: true,
                    followers: true
                }
            }
        }
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ "status": "Internal Server Error." });
    })

    // Repacking the data
    user.profile_picture = user.profile.profile_picture;
    user.description = user.profile.description || "";
    delete user["profile"];
    user.following_count = user._count.following;
    user.followers_count = user._count.followers;
    delete user["_count"];


    // Return empty object when a user is banned.
    if (user.is_banned) {
        return res.status(269).json({ "status": "User Banned." });
    }

    res.status(200).json({ ...user });
}

