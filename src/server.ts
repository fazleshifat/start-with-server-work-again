import express, { type Express, type Request, type Response } from 'express';
import { Pool } from "pg";

const app: Express = express();
const port = 5000;



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