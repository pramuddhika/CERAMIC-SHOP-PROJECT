import mysql from 'mysql2';
import 'dotenv/config.js';

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
    connectionLimit: process.env.DB_CONNECTION_LIMIT
});

export const PORT = process.env.PORT || 8000;
