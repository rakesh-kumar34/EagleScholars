var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b1815fb31e8ae5',
    password: '073c96f1',
    database: 'heroku_d64d553307ea5a4'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;