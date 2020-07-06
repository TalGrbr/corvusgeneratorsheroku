export {};
const sqlHandlers = require('./mysqlhandlers');
const config = require('../config');
const DB_NAME = config.dbName;
const MODS_TABLE_NAME = 'mods';
const mysql = require('mysql');

const con = require('../server').con;


exports.createModsDB = function() {
  const conNoDb = mysql.createPool({
    connectionLimit: config.maxCon,
    host: config.dbHost,
    user: config.dbUserName,
    password: config.dbPassword
  });
  return sqlHandlers.createNewDataBase(conNoDb, DB_NAME);
};

exports.createNewModsTable = function() {
  const query =
    'CREATE TABLE IF NOT EXISTS ' +
    MODS_TABLE_NAME +
    ' (id INT PRIMARY KEY, date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)';
  return sqlHandlers.createNewTable(con, DB_NAME, MODS_TABLE_NAME, query);
};

exports.insertMod = function(id) {
  let query = 'INSERT IGNORE INTO ' + MODS_TABLE_NAME +
    ' (id) VALUES (' + id + ')';
  return sqlHandlers.insertValueToDB(con, DB_NAME, query);
};

exports.insertMods = function(ids) {
  let query = 'INSERT IGNORE INTO ' + MODS_TABLE_NAME + ' (id) VALUES ?';
  return sqlHandlers.insertValuesToDB(con, DB_NAME, query, ids);
};

exports.getAllMods = function(orderBy ?: string) {
  return sqlHandlers.getAllFromDB(con, DB_NAME, MODS_TABLE_NAME, orderBy);
};

exports.getById = function(id, orderBy ?: string) {
  return sqlHandlers.getById(con, DB_NAME, MODS_TABLE_NAME, id, orderBy);
};

exports.deleteModById = function(id) {
  return sqlHandlers.deleteRecordById(con, DB_NAME, MODS_TABLE_NAME, id);
};

exports.isMod = async function(id) {
  try {
    let results = await sqlHandlers.getByFieldNotString(con, DB_NAME, MODS_TABLE_NAME, 'id', id);
    return results !== undefined && results.length > 0;
  } catch (e) {
    return false;
  }
};
