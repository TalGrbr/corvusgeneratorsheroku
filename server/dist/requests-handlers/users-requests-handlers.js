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
// imports
const url = require('url');
// utilities
const userUtilities = require('../utilities/usersUtilities');
const pageUtilities = require('../utilities/pageUtilities');
const errors = require('../utilities/errors');
const constants = require('../utilities/constants');
// dbs
const pageDB = require('../mysqlhandlers/pageDBHandlers');
const usersDB = require('../mysqlhandlers/usersDBHandlers');
const modsDB = require('../mysqlhandlers/modsDBHandlers');
const adminsDB = require('../mysqlhandlers/adminsDBHandlers');
const mastersDB = require('../mysqlhandlers/mastersDBHandlers');
const initsDbs = require('../mysqlhandlers/initDbs');
// http
const httpHelpers = require('../httpHelpers');
// encryption
const bcrypt = require('bcrypt');
const saltRounds = 12;
exports.getRole = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        let role = constants.ROLES.GUEST;
        try {
            if (yield mastersDB.isMaster(requestingId)) {
                role = constants.ROLES.MASTER;
            }
            else if (yield adminsDB.isAdmin(requestingId)) {
                role = constants.ROLES.ADMIN;
            }
            else if (yield modsDB.isMod(requestingId)) {
                role = constants.ROLES.MOD;
            }
            else if (yield usersDB.isUser(requestingId)) {
                role = constants.ROLES.USER;
            }
            httpHelpers.sendSuccess(response, undefined, JSON.stringify({ role: role }));
            response.end();
        }
        catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
        }
    });
};
exports.registerUser = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = url.parse(request.url, true);
        let requestingId = request.decoded.id;
        if (requestingId) {
            if ((yield modsDB.isMod(requestingId)) || (yield adminsDB.isAdmin(requestingId)) || (yield mastersDB.isMaster(requestingId))) {
                try { // try to insert the user to the db
                    let user = yield usersDB.getByUsername(q.query.username);
                    if (user && user.length > 0) {
                        httpHelpers.sendError(response, 400, errors.USERNAME_TAKEN);
                        return;
                    }
                    if (q.query.username.length < 3) {
                        httpHelpers.sendError(response, 400, 'username not valid');
                        return;
                    }
                    yield initsDbs.init_users_db(response);
                    yield initsDbs.init_users_table(response);
                    bcrypt.hash(constants.DEFAULT_PASSWORD, saltRounds, function (err, hash) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield usersDB.insertUser({ username: q.query.username, password: hash });
                            httpHelpers.sendSuccess(response, 'User added successfully');
                            response.end();
                        });
                    });
                }
                catch (e) {
                    console.log(e);
                    httpHelpers.sendError(response, 500, errors.DB_ERROR);
                    return;
                }
            }
            else {
                httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 500, 'bad request');
        }
    });
};
exports.getAllAvailableUsers = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        if ((yield mastersDB.isMaster(requestingId)) || (yield adminsDB.isAdmin(requestingId)) || (yield modsDB.isMod(requestingId))) {
            let results = yield usersDB.getAllAvailableUsers('date_of_creation');
            let names = [];
            results.forEach(result => names.push(result.username));
            httpHelpers.sendSuccess(response, undefined, JSON.stringify({ content: names.toString() }));
            response.end();
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.getAllUsers = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        if ((yield mastersDB.isMaster(requestingId)) || (yield adminsDB.isAdmin(requestingId)) || (yield modsDB.isMod(requestingId))) {
            let results = yield usersDB.getAllUsers('date_of_creation');
            let names = [];
            results.forEach(result => names.push(result.username));
            httpHelpers.sendSuccess(response, undefined, JSON.stringify({ content: names.toString() }));
            response.end();
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.updatePageUsers = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        let usersToRegisterNames = request.body.content;
        const q = url.parse(request.url, true);
        let name = pageUtilities.handleText(q.query.name);
        try {
            let page = (yield pageDB.getByName(name))[0];
            let isMaster = yield mastersDB.isMaster(requestingId);
            if (page) {
                if (isMaster ||
                    ((yield adminsDB.isAdmin(requestingId)) &&
                        (page.admin_id == requestingId || page.sub_admins_ids.slice(',').includes(requestingId.toString()))) ||
                    ((yield modsDB.isMod(requestingId)) && page.mods_ids.slice(',').includes(requestingId.toString()))) {
                    let usersToRegisterIds = yield userUtilities.convertNamesToIds(usersToRegisterNames);
                    if (yield userUtilities.checkUsersIds(usersToRegisterIds.toString())) {
                        yield pageDB.updateUsers(usersToRegisterIds, page.id); // update page's mods list
                        httpHelpers.sendSuccess(response, 'users updated');
                        response.end();
                    }
                    else {
                        httpHelpers.sendError(response, 400, 'users not valid');
                    }
                }
            }
            else {
                httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
            }
        }
        catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.DB_ERROR);
        }
    });
};
exports.mods = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        if (yield mastersDB.isMaster(requestingId)) {
            try {
                let results = yield modsDB.getAllMods('date_added');
                let contentsArray = [];
                for (const result of results) {
                    if (result != undefined) {
                        contentsArray.push(yield userUtilities.convertIdsToNames(result.content));
                    }
                }
                let contents = { 'content': contentsArray };
                httpHelpers.sendSuccess(response, undefined, JSON.stringify(contents));
                response.end();
            }
            catch (e) {
                console.log(e);
                httpHelpers.sendError(response, 500, errors.DB_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.updatePageMods = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingAdminId = request.decoded.id;
        let modsToRegisterNames = request.body.content;
        let modsToRegisterIds = (yield userUtilities.convertNamesToIds(modsToRegisterNames)).toString();
        const q = url.parse(request.url, true);
        let name = pageUtilities.handleText(q.query.name);
        try {
            let page = (yield pageDB.getByName(name))[0];
            let isMaster = yield mastersDB.isMaster(requestingAdminId);
            if (page) {
                if (isMaster ||
                    ((yield adminsDB.isAdmin(requestingAdminId)) &&
                        (page.admin_id == requestingAdminId || page.sub_admins_ids.slice(',').includes(requestingAdminId.toString())))) {
                    if (yield userUtilities.checkUsersIds(modsToRegisterIds)) {
                        yield initsDbs.init_mods_db(response);
                        yield initsDbs.init_mods_table(response);
                        let oldMods = page.mods_ids.split(',');
                        let newMods = modsToRegisterIds.split(',');
                        yield modsDB.insertMods(modsToRegisterIds.split(',')); // insert user id to mods table
                        yield pageDB.updateMods(modsToRegisterIds, page.id); // update page's mods list
                        yield updateMods(oldMods, newMods);
                        httpHelpers.sendSuccess(response, 'mods updated');
                        response.end();
                        return;
                    }
                    else {
                        httpHelpers.sendError(response, 400, 'mods not valid');
                    }
                }
            }
            else {
                httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
            }
        }
        catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.DB_ERROR);
        }
    });
};
exports.removeUser = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingMasterId = request.decoded.id;
        let userToRemoveName = request.body.content;
        let userToRemoveId = (yield userUtilities.convertNamesToIds(userToRemoveName)).toString();
        if (requestingMasterId == userToRemoveId) {
            httpHelpers.sendError(response, 400, 'You can\'t remove yourself');
            return;
        }
        if (yield mastersDB.isMaster(requestingMasterId)) {
            yield pageDB.removeUserFromAllPages(userToRemoveId);
            yield usersDB.deleteUserById(userToRemoveId);
            httpHelpers.sendSuccess(response, 'user removed');
            response.end();
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.admins = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        if ((yield mastersDB.isMaster(requestingId)) || (yield adminsDB.isAdmin(requestingId))) {
            try {
                let results = yield adminsDB.getAllAdmins('date_added');
                let contentsArray = [];
                results.forEach(result => {
                    if (result != undefined) {
                        contentsArray.push(result.id);
                    }
                });
                let names = (yield userUtilities.convertIdsToNames(contentsArray.toString())).toString();
                let contents = { 'content': names };
                httpHelpers.sendSuccess(response, undefined, JSON.stringify(contents));
                response.end();
            }
            catch (e) {
                httpHelpers.sendError(response, 500, errors.DB_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.registerAdmin = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingMasterId = request.decoded.id;
        let adminToRegisterName = request.body.content;
        let adminToRegisterId = (yield userUtilities.convertNamesToIds(adminToRegisterName)).toString();
        if (yield mastersDB.isMaster(requestingMasterId)) {
            if (yield usersDB.isUserAvailable(undefined, adminToRegisterId)) {
                yield initsDbs.init_admins_db(response);
                yield initsDbs.init_admins_table(response);
                yield adminsDB.insertAdmin(adminToRegisterId);
                httpHelpers.sendSuccess(response, 'admin added');
                response.end();
            }
            else {
                httpHelpers.sendError(response, 400, 'user not available');
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.removeAdmin = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingMasterId = request.decoded.id;
        let adminToRemoveName = request.body.content;
        let adminToRemoveId = (yield userUtilities.convertNamesToIds(adminToRemoveName)).toString();
        if (requestingMasterId == adminToRemoveId) {
            httpHelpers.sendError(response, 400, 'You can\'t remove yourself');
            return;
        }
        if (yield mastersDB.isMaster(requestingMasterId)) {
            yield adminsDB.deleteAdminById(adminToRemoveId);
            yield pageDB.removeAdminFromAllPages(adminToRemoveId);
            httpHelpers.sendSuccess(response, 'admin removed');
            response.end();
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
function updateMods(oldMods, newMods) {
    return __awaiter(this, void 0, void 0, function* () {
        // If mod is removed, check if he is mod elsewhere. If he's not, remove from mods table
        let modsToRemove = oldMods.filter((mod) => !newMods.includes(mod));
        for (const modId of modsToRemove) {
            if (modId && modId.length > 0) {
                if ((yield pageDB.getPagesByMod(modId)).length === 0) {
                    yield modsDB.deleteModById(modId);
                }
            }
        }
    });
}
exports.updatePassword = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingUserId = request.decoded.id;
        let usernameToUpdate = request.body.content.username;
        let newPassword = request.body.content.password;
        let userId = (yield userUtilities.convertNamesToIds(usernameToUpdate)).toString();
        if (requestingUserId == userId) {
            try {
                bcrypt.hash(newPassword, saltRounds, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield usersDB.updatePassword(userId, hash, false);
                        httpHelpers.sendSuccess(response, 'password updated');
                        response.end();
                    });
                });
            }
            catch (e) {
                console.log(e);
                httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.resetPassword = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingUserId = request.decoded.id;
        let usernameToUpdate = request.body.content;
        let userId = (yield userUtilities.convertNamesToIds(usernameToUpdate)).toString();
        if (userId == requestingUserId ||
            (yield mastersDB.isMaster(requestingUserId)) ||
            ((yield adminsDB.isAdmin(requestingUserId)) && !(yield adminsDB.isAdmin(userId)) && !(yield mastersDB.isMaster(userId)))) {
            try {
                bcrypt.hash(constants.DEFAULT_PASSWORD, saltRounds, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield usersDB.updatePassword(userId, hash, true);
                        httpHelpers.sendSuccess(response, 'password reset successfully');
                        response.end();
                    });
                });
                yield pageDB.removeUserFromAllPages(userId);
            }
            catch (e) {
                console.log(e);
                httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.isUsernameAvailable = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = url.parse(request.url, true);
        let username = pageUtilities.handleText(q.query.name);
        try {
            let user = yield usersDB.getByUsername(username);
            if (user && user.length > 0) {
                httpHelpers.sendSuccess(response, undefined, 'true');
                response.end();
            }
            else {
                httpHelpers.sendSuccess(response, undefined, 'false');
                response.end();
            }
        }
        catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
        }
    });
};
//# sourceMappingURL=users-requests-handlers.js.map