export {}
const sqlHandlers = require('./mysqlhandlers');
const DB_NAME = 'usersdatabase';
const MASTERS_TABLE_NAME = 'masters';
const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit: 70,
    host: 'localhost',
    user: 'root',
    password: 'Tctctncrzhk1!',
    database: DB_NAME
});

exports.createMasterDB = function () {
    const conNoDb = mysql.createPool({
        connectionLimit: 40,
        host: 'localhost',
        user: 'root',
        password: 'Tctctncrzhk1!',
    });
    return sqlHandlers.createNewDataBase(conNoDb, DB_NAME);
}

exports.createNewMastersTable = function () {
    const query =
        "CREATE TABLE IF NOT EXISTS " +
        MASTERS_TABLE_NAME +
        " (id INT PRIMARY KEY, date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
    return sqlHandlers.createNewTable(con, DB_NAME, MASTERS_TABLE_NAME, query);
}

exports.insertMaster = function (id) {
    let query = "INSERT IGNORE INTO " + MASTERS_TABLE_NAME +
        " (id) VALUES (" + id + ")";
    return sqlHandlers.insertValueToDB(con, DB_NAME, query);
}

exports.getAllMasters = function (orderBy ?: string) {
    return sqlHandlers.getAllFromDB(con, DB_NAME, MASTERS_TABLE_NAME, orderBy);
}

exports.getById = function (id, orderBy ?: string) {
    return sqlHandlers.getById(con, DB_NAME, MASTERS_TABLE_NAME, id, orderBy);
}

exports.deleteMasterById = function (id) {
    return sqlHandlers.deleteRecordById(con, DB_NAME, MASTERS_TABLE_NAME, id);
}

exports.isMaster = async function (id) {
    try {
        let results = await sqlHandlers.getByFieldNotString(con, DB_NAME, MASTERS_TABLE_NAME, 'id', id);
        return results !== undefined && results.length > 0
    } catch (e) {
        return false;
    }
}
