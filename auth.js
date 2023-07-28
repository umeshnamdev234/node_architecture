const jwt  = require('jsonwebtoken');
const mysql = require('mysql2');
const pool = mysql.createPool({
    host : 'localhost',
    user : 'umesh',
    password : 'umesh@dell',
    database : 'learn',
})

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
   
    try {
        const user = jwt.verify(token,'thisisseccrestkey');
        const username =  user.username;
        pool.query(`SELECT * FROM users where username = '${username}' limit 1`,(error,results)=>{
            if(error){
                return res.status(500).json({
                    message : "internal server error",
                    status : "failed"
                });
            }
            req.user = results;
            next();
        })
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

