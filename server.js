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
    const { city }   = req.body;
    const { country } = req.body;
    const { street } = req.body;
    const { pincode }  = req.body;

    const insertOuery = `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
    const response = await pgClient.query(insertOuery, [username, email, password]);


    const addressQuery =
     `INSERT INTO addresses(user_id, city, country, street, pincode)
     VALUES ($1, $2, $3, $4, $5);`;

     const user_id = response.rows[0].id;

     const response2 = await pgClient.query(addressQuery,[user_id, city, country, street, pincode]);

    if(response2){
        console.log(response2.rows);
    }
});

app.listen(3000);


