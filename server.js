const express = require('express');

const app = express();

const mysql = require('mysql2');

const Ajv = require('ajv');

const ajv = new Ajv();

const jwt  = require('jsonwebtoken');

const isAuthenticated = require('./auth');
const registerSchema = require('./register');


const pool = mysql.createPool({
    host : 'localhost',
    user : 'umesh',
    password : 'umesh@dell',
    database : 'learn',
})

app.use(express.json({
    limit:"20mb"
}));
app.post('/login',(req,res)=>{
    console.log(req.body);
    return res.status(200).json({
        message : "Successfully Logged In",
        status : "success"
    });
});

app.post('/register',(req,res)=>{
    const { name, username, password } = req.body;
    const validate = ajv.compile(registerSchema);
    const checkValidation = validate({name, username, password });
    if(!checkValidation){
        return res.status(400).json(validate.errors);
    }
    pool.query('INSERT into users (`name`, `username`, `password`) VALUES (?,?,?)',[name, username, password],(error,results)=>{
        if(error){
            return res.status(500).json({
                message : "internal server error",
                status : "failed"
            });
        }
        const token = jwt.sign({ id : results.id , name, username }, 'thisisseccrestkey', { expiresIn: '1h'});
        return res.status(200).json({
            message : "Successfully Registered",
            status : "success",
            token
        });
    })
});

app.get('/profile', isAuthenticated, (req,res)=>{
    try {
        const { user : [ { username } ] } = req;
        pool.query(`SELECT * FROM users where username = '${username}'`,(error,results)=>{
            if(error){
                return res.status(500).json({
                    message : "internal server error",
                    status : "failed"
                });
            }
            return res.status(200).json({
                message : "data retrieved",
                status : "success",
                user : results
            });
        })
    } catch (error) {
        res.status(400).json({ error: 'Invalid user' });
    }
})
app.get('/',(req,res)=>{
    return res.status(200).json({
        message : "API working",
        status : "success"
    });
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});