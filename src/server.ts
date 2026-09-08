import dotenv from 'dotenv';
// Load environment variables immediately before importing modules that rely on them
dotenv.config();

import express, { type Express, type Request, type Response } from 'express';
import { Pool } from "pg";

const app: Express = express();
const port: number = parseInt(process.env.PORT || '5000', 10);
// Database
const pool = new Pool({
    connectionString: process.env.DATABASE_CONNECTIONSTRING
})

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        )
        `)
}

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! This is shifat');
});

app.post('/', (req: Request, res: Response) => {
    console.log(req);

    res.status(201).json({
        success: true,
        message: "API is working"
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});