const db = require('./db');
const fs = require('fs');
const path = require('path');

const init = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        await db.query(sql);
        console.log('Database initialized successfully');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
};

init();
