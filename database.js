const mysql = require('mysql2');
const config = require('./config');

const pool = mysql.createPool({
    host: config.database.host,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    getConnection: (callback) => {
        return pool.getConnection(callback);
    }
}