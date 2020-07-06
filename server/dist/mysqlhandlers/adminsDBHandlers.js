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
const DB_NAME = 'usersdatabase';
const ADMINS_TABLE_NAME = 'admins';
const mysql = require('mysql');
const con = mysql.createPool({
    connectionLimit: 70,
    host: 'localhost',
    user: 'root',
    password: 'Tctctncrzhk1!',
    database: DB_NAME
});
exports.createAdminDB = function () {
    const conNoDb = mysql.createPool({
        connectionLimit: 40,
        host: 'localhost',
        user: 'root',
        password: 'Tctctncrzhk1!',
    });
    return sqlHandlers.createNewDataBase(conNoDb, DB_NAME);
};
exports.createNewAdminsTable = function () {
    const query = "CREATE TABLE IF NOT EXISTS " +
        ADMINS_TABLE_NAME +
        " (id INT PRIMARY KEY, date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
    return sqlHandlers.createNewTable(con, DB_NAME, ADMINS_TABLE_NAME, query);
};
exports.insertAdmin = function (id) {
    let query = "INSERT IGNORE INTO " + ADMINS_TABLE_NAME +
        " (id) VALUES (" + id + ")";
    return sqlHandlers.insertValueToDB(con, DB_NAME, query);
};
exports.getAllAdmins = function (orderBy) {
    return sqlHandlers.getAllFromDB(con, DB_NAME, ADMINS_TABLE_NAME, orderBy);
};
exports.getById = function (id, orderBy) {
    return sqlHandlers.getById(con, DB_NAME, ADMINS_TABLE_NAME, id, orderBy);
};
exports.deleteAdminById = function (id) {
    return sqlHandlers.deleteRecordById(con, DB_NAME, ADMINS_TABLE_NAME, id);
};
exports.isAdmin = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let results = yield sqlHandlers.getByFieldNotString(con, DB_NAME, ADMINS_TABLE_NAME, 'id', id);
            return results !== undefined && results.length > 0;
        }
        catch (e) {
            return false;
        }
    });
};
//# sourceMappingURL=adminsDBHandlers.js.map