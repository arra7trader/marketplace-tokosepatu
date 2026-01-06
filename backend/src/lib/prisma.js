const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

const connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Initialize LibSQL client
const libsql = createClient({
    url: connectionString,
    authToken: authToken,
});

// Initialize Prisma Adapter
const adapter = new PrismaLibSQL(libsql);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({
    adapter,
});

module.exports = prisma;
