import { Client } from "pg";
import express from "express";

const app = express()
const pgClient = new Client('postgresql://neondb_owner:npg_DmQsHqzfbg19@ep-falling-waterfall-a67th99d.us-west-2.aws.neon.tech/neondb?sslmode=require');
await pgClient.connect();

app.use(express.json());

app.post('/signup', async (req, res) => {
    const { username } = req.body;
    const { email } = req.body;
    const { password } = req.body;

    const insertOuery = `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING username;`;
    const response = await pgClient.query(insertOuery, [username, email, password]);

    if(response){
        console.log(response);
    }

});

app.listen(3000);


