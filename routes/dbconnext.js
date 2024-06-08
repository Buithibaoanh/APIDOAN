const mysql2 = require('mysql2')
const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password:'12345678',
    database: 'bantivi',
  });
  
module.exports = connection;