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
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

        console.log("Shifat Tomar Database initialized successfully");
    } catch (error) {
        console.error("Shifat Tomar Database initialization failed:", error);
    }
};

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