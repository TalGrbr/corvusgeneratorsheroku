export {}
const sqlHandlers = require('./mysqlhandlers');
const config = require('../config');
const DB_NAME = config.dbName;
const ADMINS_TABLE_NAME = 'admins';
const mysql = require('mysql');

let con = null;
require('../server').con.then(pool => {
  con = pool;
});

exports.createAdminDB = function () {
    const conNoDb = mysql.createPool({
      connectionLimit: config.maxCon,
      host: config.dbHost,
      user: config.dbUserName,
      password: config.dbPassword
    });
    return sqlHandlers.createNewDataBase(conNoDb, DB_NAME);
}

exports.createNewAdminsTable = function () {
    const query =
        "CREATE TABLE IF NOT EXISTS " +
        ADMINS_TABLE_NAME +
        " (id INT PRIMARY KEY, date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
    return sqlHandlers.createNewTable(con, DB_NAME, ADMINS_TABLE_NAME, query);
}

exports.insertAdmin = function (id) {
    let query = "INSERT IGNORE INTO " + ADMINS_TABLE_NAME +
        " (id) VALUES (" + id + ")";
    return sqlHandlers.insertValueToDB(con, DB_NAME, query);
}

exports.getAllAdmins = function (orderBy ?: string) {
    return sqlHandlers.getAllFromDB(con, DB_NAME, ADMINS_TABLE_NAME, orderBy);
}

exports.getById = function (id, orderBy ?: string) {
    return sqlHandlers.getById(con, DB_NAME, ADMINS_TABLE_NAME, id, orderBy);
}

exports.deleteAdminById = function (id) {
    return sqlHandlers.deleteRecordById(con, DB_NAME, ADMINS_TABLE_NAME, id);
}

exports.isAdmin = async function (id) {
    try {
        let results = await sqlHandlers.getByFieldNotString(con, DB_NAME, ADMINS_TABLE_NAME, 'id', id);
        return results !== undefined && results.length > 0
    } catch (e) {
        return false;
    }
}
