var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
exports.createNewDataBase = function (con, name) {
    let res = 'trying to create database ' + name;
    return new Promise((resolve, reject) => {
        con.getConnection(function (err, connection) {
            if (err) {
                if (connection && con._freeConnections.indexOf(connection) === -1) {
                    connection.release();
                }
                reject(err);
            }
            con.query('CREATE DATABASE IF NOT EXISTS ' + name, function (err, result) {
                if (connection && con._freeConnections.indexOf(connection) === -1) {
                    connection.release();
                }
                if (err) {
                    reject(err);
                }
                res = 'Database ' + name + ' created';
                resolve(res);
            });
        });
    });
};
exports.createNewTable = function (con, dbName, tableName, query) {
    return this.executeQuery(con, dbName, query);
};
exports.insertValueToDB = function (con, dbName, query) {
    return this.executeQuery(con, dbName, query);
};
exports.insertValuesToDB = function (con, dbName, query, values) {
    let res = 'trying to insert ' + values.length + ' records';
    let valuesArray = [];
    values.forEach(value => valuesArray.push([value]));
    return new Promise((resolve, reject) => {
        con.getConnection(function (err, connection) {
            if (err) {
                if (connection && con._freeConnections.indexOf(connection) === -1) {
                    connection.release();
                }
                reject(err);
            }
            con.query(query, [valuesArray], function (err, result) {
                connection.release();
                if (err) {
                    reject(err);
                }
                res = 'Number of records inserted: ' + result.affectedRows;
                resolve(res);
            });
        });
    });
};
exports.getAllFromDB = function (con, dbName, tableName, orderBy) {
    let query = 'SELECT * FROM ' + tableName;
    if (orderBy) {
        query += ' ORDER BY ' + orderBy;
    }
    return this.executeQuery(con, dbName, query);
};
exports.getById = function (con, dbName, tableName, id, orderBy) {
    let query = 'SELECT * FROM ' + tableName + ' WHERE id=' + id;
    if (orderBy) {
        query += ' ORDER BY ' + orderBy;
    }
    return this.executeQuery(con, dbName, query);
};
exports.getByFieldMultipleValues = function (con, dbName, tableName, field, values, orderBy) {
    let query = 'SELECT * FROM ' + tableName + ' WHERE ' + field + '=\'';
    values.forEach(value => {
        query += value;
        query += '\' OR';
    });
    query = query.substr(0, query.length - 2); // remove the last OR
    if (orderBy) {
        query += ' ORDER BY ' + orderBy;
    }
    return this.executeQuery(con, dbName, query);
};
exports.getByField = function (con, dbName, tableName, field, valueToSearch, orderBy) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = 'SELECT * FROM ' + tableName + ' WHERE ' + field + '=\'' + valueToSearch + '\'';
        if (orderBy) {
            query += ' ORDER BY ' + orderBy;
        }
        return this.executeQuery(con, dbName, query);
    });
};
exports.getByFieldNotString = function (con, dbName, tableName, field, valueToSearch, orderBy) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = 'SELECT * FROM ' + tableName + ' WHERE ' + field + '=' + valueToSearch + '';
        if (orderBy) {
            query += ' ORDER BY ' + orderBy;
        }
        return this.executeQuery(con, dbName, query);
    });
};
exports.getByFields = function (con, dbName, tableName, fields, values, orderBy) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = 'SELECT * FROM ' + tableName + ' WHERE ';
        for (let i = 0; i < fields.length; i++) {
            query += fields[i] + ' = \'' + values[i] + '\'';
            if (i < fields.length - 1) {
                query += ' AND ';
            }
        }
        if (orderBy) {
            query += ' ORDER BY ' + orderBy;
        }
        return this.executeQuery(con, dbName, query);
    });
};
exports.getWithWildCard = function (con, dbName, tableName, field, valueToSearch, orderBy) {
    let query = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' LIKE \'%' + valueToSearch + '%\'';
    if (orderBy) {
        query += ' ORDER BY ' + orderBy;
    }
    return this.executeQuery(con, dbName, query);
};
exports.deleteRecordById = function (con, dbName, tableName, id) {
    const query = 'DELETE FROM ' + tableName + ' WHERE id = \'' + id + '\'';
    return this.executeQuery(con, dbName, query);
};
exports.updateValuesById = function (con, dbName, tableName, fieldsValuesDict, id) {
    return this.updateValuesByIdSpecial(con, dbName, tableName, fieldsValuesDict, undefined, id);
};
exports.updateValuesByIdSpecial = function (con, dbName, tableName, fieldsValuesStringDict, fieldsValuesDict, id) {
    let query = 'UPDATE ' + tableName + ' SET ';
    if (fieldsValuesStringDict) {
        Object.keys(fieldsValuesStringDict).forEach(key => {
            query += key + ' = \'' + fieldsValuesStringDict[key] + '\',';
        });
    }
    if (fieldsValuesDict) {
        Object.keys(fieldsValuesDict).forEach(key => {
            query += key + ' = ' + fieldsValuesDict[key] + ',';
        });
    }
    query = query.slice(0, -1); // remove last ','
    query += ' WHERE id = ' + id;
    return this.executeQuery(con, dbName, query);
};
exports.executeQuery = function (con, dbName, query) {
    return new Promise((resolve, reject) => {
        con.getConnection(function (err, connection) {
            if (err) {
                if (connection && con._freeConnections.indexOf(connection) === -1) {
                    connection.release();
                }
                reject(err);
                return;
            }
            connection.query(query, function (err, result) {
                if (connection && con._freeConnections.indexOf(connection) === -1) {
                    connection.release();
                }
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    });
};
//# sourceMappingURL=mysqlhandlers.js.map