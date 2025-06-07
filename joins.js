import { Client } from "pg";
import express from 'express';
const app = express();

app.use(express.json());

const pgClient = new Client({
    user: 'neondb_owner',
    host: 'ep-falling-waterfall-a67th99d.us-west-2.aws.neon.tech',
    database: 'neondb',
    password: 'npg_DmQsHqzfbg19',
    port: '5432',
    ssl: true
});

async function connectionDb(){
    try{
        await pgClient.connect();
    console.log('connection with db is estabished');

    }
    catch(e){
        res.status(404).json({
            message: "error in connection",
            error: e.message
        })

}
}
connectionDb();

app.post('/signup/user', async (req,res) => {
    const { name } = req.body;
    const { course } = req.body;
  
     try{
        const insertQuery = `INSERT INTO students(name) VALUES($1) RETURNING id;`;
        const insertCourse = `INSERT INTO enrollments(student_id, course) VALUES($1, $2);`;

        await pgClient.query('BEGIN')
        const response = await pgClient.query(insertQuery, [name]);
        const student_id = response.rows[0].id;
        const response2 = await pgClient.query(insertCourse, [student_id, course]);
        await pgClient.query('COMMIT');
        
        res.status(200).json({
            message: 'user signup successfully'
        })
        
     }
     catch(e){
        res.status(404).json({
            message: 'error in user creation',
            error: e.message
        })
     }
});


app.get("/inner_join", async (req, res) => {

  const inner_join_query  = `SELECT students.name, 
  enrollments.course FROM students INNER JOIN
  enrollments ON students.id = enrollments.student_id;`; 

  const response = await pgClient.query(inner_join_query);

  res.status(200).json({
    data: response.rows[0]
  })
})

app.get('/left_join', async (req, res) => {
    const left_join_query = `SELECT students.name,
    enrollments.course FROM students LEFT JOIN
    enrollments ON students.id = enrollments.student_id;`;

    const response  = await pgClient.query(left_join_query);

     res.status(200).json({
        data: response.rows[0]
     })
});

app.get('/right_join', async (req, res) => {
    const left_join_query = `SELECT students.name,
    enrollments.course FROM students RIGHT JOIN
    enrollments ON students.id = enrollments.student_id;`;

    const response  = await pgClient.query(left_join_query);

     res.status(200).json({
        data: response.rows[0]
     })
});


app.get('/full_join', async (req, res) => {
    const full_join_query = `SELECT students.name,
    enrollments.course FROM students FULL JOIN
    enrollments ON students.id = enrollments.student_id;`;

    const response = await pgClient.query(full_join_query);

     res.status(200).json({
         data: response.rows[0]
     })
})
app.listen(3000);