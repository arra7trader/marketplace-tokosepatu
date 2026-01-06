const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env specific to backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    console.error('TURSO_DATABASE_URL not found');
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

async function main() {
    const sqlPath = path.join(__dirname, '../migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split commands by semicolon (basic split, might need refinement for complex SQL but sufficient for Prisma generated schema)
    // Prisma generate script usually outputs individual statements.
    // Actually, executeMultiple might differ by client. LibSQL client supports execute/batch.
    // The migration.sql might be one large string. createClient().executeMultiple(sql) is supported in some versions?
    // Let's try splitting.

    console.log('Deploying to Turso...');

    // Use executeMultiple if available or split
    try {
        await client.executeMultiple(sql);
        console.log('Migration successful!');
    } catch (e) {
        console.error('Migration failed', e);
        // Fallback if executeMultiple is not found (it is standard in recent libsql client)
        const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
        for (const stmt of statements) {
            try {
                await client.execute(stmt);
            } catch (err) {
                console.log('Error executing stmt:', stmt.substring(0, 50), err.message);
            }
        }
    }
}

main();
