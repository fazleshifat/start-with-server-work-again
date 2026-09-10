import dotenv from 'dotenv';
// Load environment variables immediately before importing modules that rely on them
dotenv.config();

import express, { type Express, type Request, type Response } from 'express';
import { Pool } from "pg";

const app: Express = express();

app.use(express.json());

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

const resetDB = async () => {
    try {
        await pool.query(`
            TRUNCATE TABLE users, todos
            RESTART IDENTITY CASCADE
        `);

        console.log("Database reset successfully!");
    } catch (error) {
        console.error("Database reset failed:", error);
    }
};

initDB();

// to delete all Databse
// resetDB();

// pushing code into branch shifat
// pushing code into branch dev

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! This is shifat');
});

app.post('/users', async (req: Request, res: Response) => {
    const { name, email, age, phone, address } = req.body;

    try {
        // 1. Check if email already exists
        const existingUser = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists!"
            });
        }

        // 2. Insert only if email does not exist
        const result = await pool.query(
            `INSERT INTO users(name, email, age, phone, address)
              VALUES($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, email, age, phone, address]
        );

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);

        res.status(200).json({
            success: true,
            message: "Users retrived successfully!",
            data: result.rows,
        })
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
})

app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])

        if (result?.rows?.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Users fetched successfully!",
                data: result?.rows[0],
            })
        }

        console.log(result.rows)
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});