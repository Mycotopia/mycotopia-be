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
                    description: true,
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
    user.user_name = user.user_id;
    delete user["user_id"];
    user.profile_picture = user.profile.profile_picture;
    user.description = user.profile.description;
    delete user["profile"];
    user.following_count = user._count.following;
    user.followers_count = user._count.followers;
    delete user["_count"];


    // Return empty object when a user is banned.
    if (user.is_banned) {
        return res.status(269).json({ "status": "User Banned." });
    }

    res.status(200).json({ ...user });
};


export const getUserFollowing = async (req, res) => {
    const user_name = req.params.user_name;

    if (!user_name) {
        return res.status(400).json({ "status": "Bad Request." })
    }

    const following_data = await prisma.user.findFirst({
        where: {
            user_id: user_name,
            is_banned: false
        },
        select: {
            _count: {
                select: {
                    following: true
                }
            },
            following: {
                select: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    profile: {
                        select: {
                            description: true,
                            profile_picture: true
                        }
                    }
                }
            }
        }
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ "status": "Internal Server Error." });
    });

    if (!following_data) {
        // If user is not found in the database.

        return res.status(404).json({ "status": "User Not Found." });
    } else if (following_data) {
        // Repacking the data
        following_data.following.map(user => {
            user.user_name = user.user_id;
            delete user["user_id"];
            user.profile_picture = user.profile.profile_picture;
            user.description = user.profile.description;
            delete user["profile"];

            return user;
        })

        return res.status(200).json({ ...following_data });
    }
};

export const getUserFollowers = async (req, res) => {
    const user_name = req.params.user_name;

    if (!user_name) {
        return res.status(400).json({ "status": "Bad Request." })
    }


};