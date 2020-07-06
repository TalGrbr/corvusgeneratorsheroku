export {}
const sqlHandlers = require('./mysqlhandlers');
const DB_NAME = 'usersdatabase';
const USERS_TABLE_NAME = 'users';
const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit: 70,
    host: 'localhost',
    user: 'root',
    password: 'Tctctncrzhk1!',
    database: DB_NAME
});

exports.createUsersDB = function () {
    const conNoDb = mysql.createPool({
        connectionLimit: 40,
        host: 'localhost',
        user: 'root',
        password: 'Tctctncrzhk1!',
    });
    return sqlHandlers.createNewDataBase(conNoDb, DB_NAME);
}

exports.createNewUsersTable = function () {
    const query =
        "CREATE TABLE IF NOT EXISTS " +
        USERS_TABLE_NAME +
        " (id INT AUTO_INCREMENT PRIMARY KEY UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(255), init_pass BOOL," +
        " date_of_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
    return sqlHandlers.createNewTable(con, DB_NAME, USERS_TABLE_NAME, query);
}

exports.insertUser = function (user) {
    let query = "INSERT IGNORE  INTO " + USERS_TABLE_NAME +
        " (username, password, init_pass) VALUES ('" +
        user.username + "', '" +
        user.password + "', " +
        "TRUE" +
        ")";
    return sqlHandlers.insertValueToDB(con, DB_NAME, query);
}

exports.getAllUsers = function (orderBy ?: string) {
    return sqlHandlers.getAllFromDB(con, DB_NAME, USERS_TABLE_NAME, orderBy);
}

exports.getAllAvailableUsers = function (orderBy ?: string) {
    return sqlHandlers.getByFieldNotString(con, DB_NAME, USERS_TABLE_NAME, 'init_pass', false, orderBy);
}

exports.isUserAvailable = async function (username ?: string, id ?: number) {
    try {
        if (username) {
            let query = "SELECT * FROM " + USERS_TABLE_NAME + " WHERE username='" + username + "' AND init_pass=FALSE";
            return (await sqlHandlers.executeQuery(con, DB_NAME, query)).length > 0;
        } else if (id) {
            let query = "SELECT * FROM " + USERS_TABLE_NAME + " WHERE id=" + id + " AND init_pass=FALSE";
            //let result = await sqlHandlers.executeQuery(DB_NAME, query);
            return (await sqlHandlers.executeQuery(con, DB_NAME, query)).length > 0;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

exports.getById = function (id, orderBy ?: string) {
    return sqlHandlers.getById(con, DB_NAME, USERS_TABLE_NAME, id, orderBy);
}

exports.getByUsername = function (username, orderBy ?: string) {
    return sqlHandlers.getByField(con, DB_NAME, USERS_TABLE_NAME, 'username', username, orderBy);
}

exports.getIdByName = async function (username) {
    try {
        let results = await sqlHandlers.getByField(con, DB_NAME, USERS_TABLE_NAME, 'username', username);
        return results[0].id;
    } catch (e) {
        return -1
    }
}

exports.getByWildCardName = function (partOfUsername, orderBy ?: string) {
    return sqlHandlers.getWithWildCard(con, DB_NAME, USERS_TABLE_NAME, 'username', partOfUsername, orderBy);
}

exports.deleteUserById = function (id) {
    return sqlHandlers.deleteRecordById(con, DB_NAME, USERS_TABLE_NAME, id);
}

exports.updateUserById = function (fieldValueDict, id) {
    return sqlHandlers.updateValuesById(con, DB_NAME, USERS_TABLE_NAME, fieldValueDict, id);
}

exports.doesUserExist = async function (username, password) {
    try {
        let results = await sqlHandlers.getByFields(
            con,
            DB_NAME,
            USERS_TABLE_NAME,
            ['username', 'password'],
            [username, password]
        );
        if (results !== undefined && results.length > 0) {
            return results[0].id;
        } else {
            return -1;
        }
    } catch (e) {
        return -1;
    }
}

exports.isUser = async function (userId) {
    try {
        let results = await sqlHandlers.getById(con, DB_NAME, USERS_TABLE_NAME, userId);
        if (results !== undefined && results.length > 0) {
            return true
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

exports.updatePassword = async function (userId, newPassword, initPass) {
    return sqlHandlers.updateValuesByIdSpecial(
        con,
        DB_NAME,
        USERS_TABLE_NAME,
        {'password': newPassword},
        {'init_pass': initPass},
        userId
    );
}
