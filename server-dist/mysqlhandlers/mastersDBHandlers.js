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
const MASTERS_TABLE_NAME = 'masters';
const mysql = require('mysql');
const con = mysql.createPool({
    connectionLimit: 20,
    host: config.dbHost,
    user: config.dbUserName,
    password: config.dbPassword,
    database: DB_NAME
});
exports.createMasterDB = function () {
    const conNoDb = mysql.createPool({
        connectionLimit: 20,
        host: config.dbHost,
        user: config.dbUserName,
        password: config.dbPassword
    });
    return sqlHandlers.createNewDataBase(conNoDb, DB_NAME);
};
exports.createNewMastersTable = function () {
    const query = 'CREATE TABLE IF NOT EXISTS ' +
        MASTERS_TABLE_NAME +
        ' (id INT PRIMARY KEY, date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)';
    return sqlHandlers.createNewTable(con, DB_NAME, MASTERS_TABLE_NAME, query);
};
exports.insertMaster = function (id) {
    let query = 'INSERT IGNORE INTO ' + MASTERS_TABLE_NAME +
        ' (id) VALUES (' + id + ')';
    return sqlHandlers.insertValueToDB(con, DB_NAME, query);
};
exports.getAllMasters = function (orderBy) {
    return sqlHandlers.getAllFromDB(con, DB_NAME, MASTERS_TABLE_NAME, orderBy);
};
exports.getById = function (id, orderBy) {
    return sqlHandlers.getById(con, DB_NAME, MASTERS_TABLE_NAME, id, orderBy);
};
exports.deleteMasterById = function (id) {
    return sqlHandlers.deleteRecordById(con, DB_NAME, MASTERS_TABLE_NAME, id);
};
exports.isMaster = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let results = yield sqlHandlers.getByFieldNotString(con, DB_NAME, MASTERS_TABLE_NAME, 'id', id);
            return results !== undefined && results.length > 0;
        }
        catch (e) {
            return false;
        }
    });
};
//# sourceMappingURL=mastersDBHandlers.js.map