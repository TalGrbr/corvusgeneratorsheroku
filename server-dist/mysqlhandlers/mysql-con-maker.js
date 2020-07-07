"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql');
const config = require('../config');
const con = mysql.createPool({
    connectionLimit: config.maxCon,
    waitForConnections: true,
    host: config.dbHost,
    user: config.dbUserName,
    password: config.dbPassword,
    database: config.dbName
});
module.exports = con;
//# sourceMappingURL=mysql-con-maker.js.map