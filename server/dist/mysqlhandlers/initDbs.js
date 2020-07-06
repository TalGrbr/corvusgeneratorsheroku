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
const pageDB = require('./pageDBHandlers');
const usersDB = require('./usersDBHandlers');
const modsDB = require('./modsDBHandlers');
const adminsDB = require('./adminsDBHandlers');
const mastersDB = require('./mastersDBHandlers');
const errors = require('../utilities/errors');
// PAGES
exports.init_pages_db = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init pages db';
        try { // try to create new db if it doesnt exist
            result = yield pageDB.createPageDB();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
exports.init_pages_table = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init pages table';
        try { // try to create a new table if it doesnt exist
            result = yield pageDB.createNewPageTable();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
// USERS
exports.init_users_db = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init users database';
        try { // try to create new db if it doesnt exist
            result = yield usersDB.createUsersDB();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
exports.init_users_table = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init users table';
        try { // try to create a new table if it doesnt exist
            result = yield usersDB.createNewUsersTable();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
// MODS
exports.init_mods_db = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init mods database';
        try { // try to create new db if it doesnt exist
            result = yield modsDB.createModsDB();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
exports.init_mods_table = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init mods table';
        try { // try to create a new table if it doesnt exist
            result = yield modsDB.createNewModsTable();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
// ADMINS
exports.init_admins_db = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init admins database';
        try { // try to create new db if it doesnt exist
            result = yield adminsDB.createAdminDB();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
exports.init_admins_table = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init admins table';
        try { // try to create a new table if it doesnt exist
            result = yield adminsDB.createNewAdminsTable();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
// MASTERS
exports.init_masters_db = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init masters database';
        try { // try to create new db if it doesnt exist
            result = yield mastersDB.createMasterDB();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
exports.init_masters_table = function (response) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = 'trying to init masters table';
        try { // try to create a new table if it doesnt exist
            result = yield mastersDB.createNewMastersTable();
        }
        catch (e) {
            result = e.toString();
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ message: errors.DB_ERROR }));
            response.end();
            return;
        }
        finally {
            console.log('result: ' + result);
        }
    });
};
//# sourceMappingURL=initDbs.js.map