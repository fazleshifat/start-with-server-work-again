import express, { type Express, type Request, type Response } from 'express';
import { Pool } from "pg";

const app: Express = express();
const port = 5000;



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! This is shifat');
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});