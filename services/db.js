const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = { prisma, PrismaError: Prisma.PrismaClientKnownRequestError };