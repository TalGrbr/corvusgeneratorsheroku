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
const constants_1 = require("../utilities/constants");
const sqlHandlers = require('./mysqlhandlers');
const config = require('../config');
const PAGES_DB_NAME = config.dbName;
const PAGES_TABLE_NAME = 'pages';
const mysql = require('mysql');
const mastersDB = require('./mastersDBHandlers');
const con = mysql.createPool({
    connectionLimit: 20,
    host: config.dbHost,
    user: config.dbUserName,
    password: config.dbPassword,
    database: PAGES_DB_NAME
});
exports.createPageDB = function () {
    const conNoDb = mysql.createPool({
        connectionLimit: 20,
        host: config.dbHost,
        user: config.dbUserName,
        password: config.dbPassword
    });
    return sqlHandlers.createNewDataBase(conNoDb, PAGES_DB_NAME);
};
exports.createNewPageTable = function () {
    const query = 'CREATE TABLE IF NOT EXISTS ' +
        PAGES_TABLE_NAME +
        ' (id INT AUTO_INCREMENT PRIMARY KEY UNIQUE, ' +
        'page_name VARCHAR(255) UNIQUE, ' +
        'content LONGTEXT, ' +
        'date_of_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
        'users_ids LONGTEXT, ' +
        'mods_ids LONGTEXT, ' +
        'admin_id VARCHAR(255), ' +
        'sub_admins_ids LONGTEXT ' +
        ')';
    return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
};
exports.insertPage = function (pageContent, adminId) {
    let buff = Buffer.from(JSON.stringify(pageContent));
    let base64data = buff.toString('base64');
    let query = 'INSERT IGNORE  INTO ' + PAGES_TABLE_NAME +
        ' (page_name, content, admin_id, users_ids, mods_ids, sub_admins_ids) VALUES (\'' +
        pageContent.name + '\', \'' +
        base64data + '\', \'' +
        adminId + '\', \'' +
        '' + '\', \'' +
        '' + '\', \'' +
        '' +
        '\')';
    return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
};
exports.getAllPages = function (orderBy) {
    return __awaiter(this, void 0, void 0, function* () {
        let results = yield sqlHandlers.getAllFromDB(con, PAGES_DB_NAME, PAGES_TABLE_NAME, orderBy);
        let contentsArray = [];
        results.forEach(result => {
            if (result != undefined) {
                let buff = Buffer.from(result.content, 'base64');
                result.content = buff.toString('utf8');
                contentsArray.push(result);
            }
        });
        return contentsArray;
    });
};
exports.getById = function (id, orderBy) {
    return sqlHandlers.getById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, id, orderBy);
};
exports.getByIds = function (ids, orderBy) {
    return sqlHandlers.getByFieldMultipleValues(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'id', ids, orderBy);
};
exports.getByName = function (pageName, orderBy) {
    return sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'page_name', pageName, orderBy);
};
exports.getByAdminId = function (adminId, orderBy) {
    return sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'admin_id', adminId, orderBy);
};
exports.getIdByName = function (pageName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let results = yield sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'page_name', pageName);
            return results[0].id;
        }
        catch (e) {
            return -1;
        }
    });
};
exports.getByWildCardName = function (partOfPageName, orderBy) {
    return sqlHandlers.getWithWildCard(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'page_name', partOfPageName, orderBy);
};
exports.deletePageById = function (id) {
    return sqlHandlers.deleteRecordById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, id);
};
exports.updatePageById = function (fieldValueDict, id) {
    return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, fieldValueDict, id);
};
exports.updateUsers = function (usersIds, id) {
    return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, { 'users_ids': usersIds }, id);
};
exports.updateMods = function (modsIds, id) {
    return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, { 'mods_ids': modsIds }, id);
};
exports.updateAdmin = function (adminId, id) {
    return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, { 'admin_id': adminId }, id);
};
exports.updateSubAdmins = function (subAdminsIds, id) {
    return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, { 'sub_admins_ids': subAdminsIds }, id);
};
exports.getPagesByField = function (field, valueToSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = [];
        try {
            let results = yield sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, field, valueToSearch);
            results.forEach(result => pages.push(result));
        }
        catch (e) {
            console.log(e);
        }
        return pages;
    });
};
exports.getPagesByUser = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = 'SELECT * FROM ' + PAGES_TABLE_NAME + ' WHERE FIND_IN_SET(' + userId + ', users_ids)';
        return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
    });
};
exports.getPagesByMod = function (modId) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = 'SELECT * FROM ' + PAGES_TABLE_NAME + ' WHERE FIND_IN_SET(' + modId + ', mods_ids)';
        return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
    });
};
exports.getPagesByAdmin = function (adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.getPagesByField('admin_id', adminId);
    });
};
exports.getPagesBySubAdmin = function (subAdminId) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = 'SELECT * FROM ' + PAGES_TABLE_NAME + ' WHERE FIND_IN_SET(' + subAdminId + ', sub_admins_ids)';
        return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
    });
};
exports.removeAdminFromAllPages = function (adminId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = yield this.getPagesByField('admin_id', adminId);
        for (const page of pages) {
            let pageId = yield this.getIdByName(page.page_name);
            // set the first user (me) to be admin
            yield this.updateAdmin(1, pageId);
            // remove from sub admins as well
            yield this.updateSubAdmins((page.sub_admins_ids.split(',').filter((id) => (id != adminId))).toString(), pageId);
        }
    });
};
exports.removeUserFromAllPages = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = yield this.getAllPagesRelatedToUser(userId);
        // UPDATE THIS
        for (let page of pages) {
            let pageId = yield this.getIdByName(page.page_name);
            if (pageId !== -1) {
                // remove from users ion all pages
                yield this.updateUsers((page.users_ids.split(',').filter((id) => (id != userId))).toString(), pageId);
                // remove from mods in all pages
                yield this.updateMods((page.mods_ids.split(',').filter((id) => (id != userId))).toString(), pageId);
                // remove from sub admins in all pages
                yield this.updateSubAdmins((page.sub_admins_ids.split(',').filter((id) => (id != userId))).toString(), pageId);
                // remove from admins
                yield this.updateAdmin(1, pageId);
            }
        }
    });
};
exports.getAllPagesRelatedToUser = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = [];
        let pagesByUser = yield this.getPagesByUser(userId);
        let pagesByMod = yield this.getPagesByMod(userId);
        let pagesByAdmin = yield this.getPagesByAdmin(userId);
        let pagesBySubAdmin = yield this.getPagesBySubAdmin(userId);
        pages = this.addNoDupes(pages, pagesByUser);
        pages = this.addNoDupes(pages, pagesByMod);
        pages = this.addNoDupes(pages, pagesByAdmin);
        pages = this.addNoDupes(pages, pagesBySubAdmin);
        // decode
        pages.forEach(page => {
            let buff = Buffer.from(page.content, 'base64');
            page.content = buff.toString('utf8');
        });
        return pages;
    });
};
exports.addNoDupes = function (arrayDist, arraySource) {
    arraySource.forEach(row => {
        if (!arrayDist.find(r => r.id === row.id)) {
            arrayDist.push(row);
        }
    });
    return arrayDist;
};
exports.getAllPagesRelatedToUserWithRoles = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let isMaster = yield mastersDB.isMaster(userId);
        let pages;
        if (isMaster) {
            pages = yield this.getAllPages();
        }
        else {
            pages = yield this.getAllPagesRelatedToUser(userId);
        }
        let pagesWithRoles = [];
        let role = constants_1.ROLES.GUEST;
        pages.forEach(page => {
            role = constants_1.ROLES.GUEST;
            if (page) {
                if (page.admin_id == userId) {
                    role = constants_1.ROLES.ADMIN;
                }
                else if (page.sub_admins_ids.split(',').includes(userId.toString())) {
                    role = constants_1.ROLES.SUB_ADMIN;
                }
                else if (page.mods_ids.split(',').includes(userId.toString())) {
                    role = constants_1.ROLES.MOD;
                }
                else if (page.users_ids.split(',').includes(userId.toString())) {
                    role = constants_1.ROLES.USER;
                }
                pagesWithRoles.push({ page: page.page_name, role: role, about: (JSON.parse(page.content))['about'] });
            }
        });
        return pagesWithRoles;
    });
};
//# sourceMappingURL=pageDBHandlers.js.map