"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlHandlers = require('./mysqlhandlers');
const config = require('../config');
const DB_NAME = config.dbName;
const USERS_TABLE_NAME = 'users';
const mysql = require('mysql');
const con = mysql.createPool({
    connectionLimit: 20,
    host: config.dbHost,
    user: config.dbUserName,
    password: config.dbPassword,
    database: DB_NAME
});
exports.createUsersDB = function () {
    const conNoDb = mysql.createPool({
        connectionLimit: 20,
        host: config.dbHost,
        user: config.dbUserName,
        password: config.dbPassword
    });
    return sqlHandlers.createNewDataBase(conNoDb, DB_NAME);
};
exports.createNewUsersTable = function () {
    const query = 'CREATE TABLE IF NOT EXISTS ' +
        USERS_TABLE_NAME +
        ' (id INT AUTO_INCREMENT PRIMARY KEY UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(255), init_pass BOOL,' +
        ' date_of_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)';
    return sqlHandlers.createNewTable(con, DB_NAME, USERS_TABLE_NAME, query);
};
exports.insertUser = function (user) {
    let query = 'INSERT IGNORE  INTO ' + USERS_TABLE_NAME +
        ' (username, password, init_pass) VALUES (\'' +
        user.username + '\', \'' +
        user.password + '\', ' +
        'TRUE' +
        ')';
    return sqlHandlers.insertValueToDB(con, DB_NAME, query);
};
exports.getAllUsers = function (orderBy) {
    return sqlHandlers.getAllFromDB(con, DB_NAME, USERS_TABLE_NAME, orderBy);
};
exports.getAllAvailableUsers = function (orderBy) {
    return sqlHandlers.getByFieldNotString(con, DB_NAME, USERS_TABLE_NAME, 'init_pass', false, orderBy);
};
exports.isUserAvailable = function (username, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (username) {
                let query = 'SELECT * FROM ' + USERS_TABLE_NAME + ' WHERE username=\'' + username + '\' AND init_pass=FALSE';
                return (yield sqlHandlers.executeQuery(con, DB_NAME, query)).length > 0;
            }
            else if (id) {
                let query = 'SELECT * FROM ' + USERS_TABLE_NAME + ' WHERE id=' + id + ' AND init_pass=FALSE';
                //let result = await sqlHandlers.executeQuery(DB_NAME, query);
                return (yield sqlHandlers.executeQuery(con, DB_NAME, query)).length > 0;
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    });
};
exports.getById = function (id, orderBy) {
    return sqlHandlers.getById(con, DB_NAME, USERS_TABLE_NAME, id, orderBy);
};
exports.getByUsername = function (username, orderBy) {
    return sqlHandlers.getByField(con, DB_NAME, USERS_TABLE_NAME, 'username', username, orderBy);
};
exports.getIdByName = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let results = yield sqlHandlers.getByField(con, DB_NAME, USERS_TABLE_NAME, 'username', username);
            return results[0].id;
        }
        catch (e) {
            return -1;
        }
    });
};
exports.getByWildCardName = function (partOfUsername, orderBy) {
    return sqlHandlers.getWithWildCard(con, DB_NAME, USERS_TABLE_NAME, 'username', partOfUsername, orderBy);
};
exports.deleteUserById = function (id) {
    return sqlHandlers.deleteRecordById(con, DB_NAME, USERS_TABLE_NAME, id);
};
exports.updateUserById = function (fieldValueDict, id) {
    return sqlHandlers.updateValuesById(con, DB_NAME, USERS_TABLE_NAME, fieldValueDict, id);
};
exports.doesUserExist = function (username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let results = yield sqlHandlers.getByFields(con, DB_NAME, USERS_TABLE_NAME, ['username', 'password'], [username, password]);
            if (results !== undefined && results.length > 0) {
                return results[0].id;
            }
            else {
                return -1;
            }
        }
        catch (e) {
            return -1;
        }
    });
};
exports.isUser = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let results = yield sqlHandlers.getById(con, DB_NAME, USERS_TABLE_NAME, userId);
            if (results !== undefined && results.length > 0) {
                return true;
            }
            return false;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    });
};
exports.updatePassword = function (userId, newPassword, initPass) {
    return __awaiter(this, void 0, void 0, function* () {
        return sqlHandlers.updateValuesByIdSpecial(con, DB_NAME, USERS_TABLE_NAME, { 'password': newPassword }, { 'init_pass': initPass }, userId);
    });
};
//# sourceMappingURL=usersDBHandlers.js.map