const mysql = require('mysql');
const db_config = {
    host: 'iwqrvsv8e5fz4uni.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'nbfomxkxx6gaetxg',
    password: 'muouz9n5ccqp29r3',
    database: 'oqew7c94lsan66uv'
};

const db_local = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'studentdash'
};

const connection = mysql.createConnection(db_config);

connection.connect((err) => {
  if(err) {
    console.log("Error connecting to database");
    throw err;
  }
  else {
    console.log("Database connection established !!");
  }
});

module.exports = connection;

