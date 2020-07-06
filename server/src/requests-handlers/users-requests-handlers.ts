export {}
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

exports.getRole = async function (request, response) {
    let requestingId = request.decoded.id;
    let role = constants.ROLES.GUEST;
    try {
        if (await mastersDB.isMaster(requestingId)) {
            role = constants.ROLES.MASTER;
        } else if (await adminsDB.isAdmin(requestingId)) {
            role = constants.ROLES.ADMIN;
        } else if (await modsDB.isMod(requestingId)) {
            role = constants.ROLES.MOD;
        } else if (await usersDB.isUser(requestingId)) {
            role = constants.ROLES.USER;
        }
        httpHelpers.sendSuccess(response, undefined, JSON.stringify({role: role}));
        response.end();
    } catch (e) {
        console.log(e);
        httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
    }
}

exports.registerUser = async function (request, response) {
    const q = url.parse(request.url, true);

    let requestingId = request.decoded.id;
    if (requestingId) {
        if (await modsDB.isMod(requestingId) || await adminsDB.isAdmin(requestingId) || await mastersDB.isMaster(requestingId)) {
            try { // try to insert the user to the db
                let user = await usersDB.getByUsername(q.query.username);
                if (user && user.length > 0) {
                    httpHelpers.sendError(response, 400, errors.USERNAME_TAKEN);
                    return;
                }
                if (q.query.username.length < 3) {
                    httpHelpers.sendError(response, 400, 'username not valid');
                    return;
                }
                await initsDbs.init_users_db(response);
                await initsDbs.init_users_table(response);
                bcrypt.hash(constants.DEFAULT_PASSWORD, saltRounds, async function (err, hash) {
                    await usersDB.insertUser({username: q.query.username, password: hash});
                    httpHelpers.sendSuccess(response, 'User added successfully');
                    response.end();
                });
            } catch (e) {
                console.log(e);
                httpHelpers.sendError(response, 500, errors.DB_ERROR);
                return;
            }
        } else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    } else {
        httpHelpers.sendError(response, 500, 'bad request');
    }
}

exports.getAllAvailableUsers = async function (request, response) {
    let requestingId = request.decoded.id;

    if (await mastersDB.isMaster(requestingId) || await adminsDB.isAdmin(requestingId) || await modsDB.isMod(requestingId)) {
        let results = await usersDB.getAllAvailableUsers('date_of_creation');
        let names = [];
        results.forEach(result => names.push(result.username));
        httpHelpers.sendSuccess(response, undefined, JSON.stringify({content: names.toString()}));
        response.end();
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.getAllUsers = async function (request, response) {
    let requestingId = request.decoded.id;

    if (await mastersDB.isMaster(requestingId) || await adminsDB.isAdmin(requestingId) || await modsDB.isMod(requestingId)) {
        let results = await usersDB.getAllUsers('date_of_creation');
        let names = [];
        results.forEach(result => names.push(result.username));
        httpHelpers.sendSuccess(response, undefined, JSON.stringify({content: names.toString()}));
        response.end();
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.updatePageUsers = async function (request, response) {
    let requestingId = request.decoded.id;
    let usersToRegisterNames = request.body.content;
    const q = url.parse(request.url, true);
    let name = pageUtilities.handleText(q.query.name);
    try {
        let page = (await pageDB.getByName(name))[0];
        let isMaster = await mastersDB.isMaster(requestingId);
        if (page) {
            if (isMaster ||
                (await adminsDB.isAdmin(requestingId) &&
                    (page.admin_id == requestingId || page.sub_admins_ids.slice(',').includes(requestingId.toString()))) ||
                (await modsDB.isMod(requestingId) && page.mods_ids.slice(',').includes(requestingId.toString()))
            ) {
                let usersToRegisterIds = await userUtilities.convertNamesToIds(usersToRegisterNames);
                if (await userUtilities.checkUsersIds(usersToRegisterIds.toString())) {
                    await pageDB.updateUsers(usersToRegisterIds, page.id); // update page's mods list
                    httpHelpers.sendSuccess(response, 'users updated');
                    response.end();
                } else {
                    httpHelpers.sendError(response, 400, 'users not valid');
                }
            }
        } else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    } catch (e) {
        console.log(e);
        httpHelpers.sendError(response, 500, errors.DB_ERROR);
    }
}

exports.mods = async function (request, response) {
    let requestingId = request.decoded.id;

    if (await mastersDB.isMaster(requestingId)) {
        try {
            let results = await modsDB.getAllMods('date_added');
            let contentsArray = [];
            for (const result of results) {
                if (result != undefined) {
                    contentsArray.push(await userUtilities.convertIdsToNames(result.content));
                }
            }
            let contents = {'content': contentsArray};
            httpHelpers.sendSuccess(response, undefined, JSON.stringify(contents));
            response.end();
        } catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.DB_ERROR);
        }
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.updatePageMods = async function (request, response) {
    let requestingAdminId = request.decoded.id;
    let modsToRegisterNames = request.body.content;
    let modsToRegisterIds = (await userUtilities.convertNamesToIds(modsToRegisterNames)).toString();
    const q = url.parse(request.url, true);
    let name = pageUtilities.handleText(q.query.name);
    try {
        let page = (await pageDB.getByName(name))[0];
        let isMaster = await mastersDB.isMaster(requestingAdminId);
        if (page) {
            if (isMaster ||
                (await adminsDB.isAdmin(requestingAdminId) &&
                    (page.admin_id == requestingAdminId || page.sub_admins_ids.slice(',').includes(requestingAdminId.toString())))
            ) {
                if (await userUtilities.checkUsersIds(modsToRegisterIds)) {
                    await initsDbs.init_mods_db(response);
                    await initsDbs.init_mods_table(response);

                    let oldMods = page.mods_ids.split(',');
                    let newMods = modsToRegisterIds.split(',');

                    await modsDB.insertMods(modsToRegisterIds.split(',')); // insert user id to mods table
                    await pageDB.updateMods(modsToRegisterIds, page.id); // update page's mods list
                    await updateMods(oldMods, newMods);
                    httpHelpers.sendSuccess(response, 'mods updated');
                    response.end();
                    return;
                } else {
                    httpHelpers.sendError(response, 400, 'mods not valid');
                }
            }
        } else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    } catch (e) {
        console.log(e);
        httpHelpers.sendError(response, 500, errors.DB_ERROR);
    }
}

exports.removeUser = async function (request, response) {
    let requestingMasterId = request.decoded.id;
    let userToRemoveName = request.body.content;
    let userToRemoveId = (await userUtilities.convertNamesToIds(userToRemoveName)).toString();
    if (requestingMasterId == userToRemoveId) {
        httpHelpers.sendError(response, 400, 'You can\'t remove yourself');
        return;
    }
    if (await mastersDB.isMaster(requestingMasterId)) {
        await pageDB.removeUserFromAllPages(userToRemoveId);
        await usersDB.deleteUserById(userToRemoveId);
        httpHelpers.sendSuccess(response, 'user removed');
        response.end();
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.admins = async function (request, response) {
    let requestingId = request.decoded.id;

    if (await mastersDB.isMaster(requestingId) || await adminsDB.isAdmin(requestingId)) {
        try {
            let results = await adminsDB.getAllAdmins('date_added');
            let contentsArray = [];
            results.forEach(result => {
                if (result != undefined) {
                    contentsArray.push(result.id);
                }
            });
            let names = (await userUtilities.convertIdsToNames(contentsArray.toString())).toString();
            let contents = {'content': names};

            httpHelpers.sendSuccess(response, undefined, JSON.stringify(contents));
            response.end();
        } catch (e) {
            httpHelpers.sendError(response, 500, errors.DB_ERROR);
        }
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.registerAdmin = async function (request, response) {
    let requestingMasterId = request.decoded.id;
    let adminToRegisterName = request.body.content;
    let adminToRegisterId = (await userUtilities.convertNamesToIds(adminToRegisterName)).toString();

    if (await mastersDB.isMaster(requestingMasterId)) {
        if (await usersDB.isUserAvailable(undefined, adminToRegisterId)) {
            await initsDbs.init_admins_db(response);
            await initsDbs.init_admins_table(response);

            await adminsDB.insertAdmin(adminToRegisterId);
            httpHelpers.sendSuccess(response, 'admin added');
            response.end();
        } else {
            httpHelpers.sendError(response, 400, 'user not available');
        }
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.removeAdmin = async function (request, response) {
    let requestingMasterId = request.decoded.id;
    let adminToRemoveName = request.body.content;
    let adminToRemoveId = (await userUtilities.convertNamesToIds(adminToRemoveName)).toString();
    if (requestingMasterId == adminToRemoveId) {
        httpHelpers.sendError(response, 400, 'You can\'t remove yourself');
        return;
    }
    if (await mastersDB.isMaster(requestingMasterId)) {
        await adminsDB.deleteAdminById(adminToRemoveId);
        await pageDB.removeAdminFromAllPages(adminToRemoveId);
        httpHelpers.sendSuccess(response, 'admin removed');
        response.end();
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

async function updateMods(oldMods, newMods) {
    // If mod is removed, check if he is mod elsewhere. If he's not, remove from mods table
    let modsToRemove = oldMods.filter((mod) => !newMods.includes(mod));

    for (const modId of modsToRemove) {
        if (modId && modId.length > 0) {
            if ((await pageDB.getPagesByMod(modId)).length === 0) {
                await modsDB.deleteModById(modId);
            }
        }
    }
}

exports.updatePassword = async function (request, response) {
    let requestingUserId = request.decoded.id;
    let usernameToUpdate = request.body.content.username;
    let newPassword = request.body.content.password;
    let userId = (await userUtilities.convertNamesToIds(usernameToUpdate)).toString();

    if (requestingUserId == userId) {
        try {
            bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
                await usersDB.updatePassword(userId, hash, false);
                httpHelpers.sendSuccess(response, 'password updated');
                response.end();
            });
        } catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
        }
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.resetPassword = async function (request, response) {
    let requestingUserId = request.decoded.id;
    let usernameToUpdate = request.body.content;
    let userId = (await userUtilities.convertNamesToIds(usernameToUpdate)).toString();
    if (userId == requestingUserId ||
        await mastersDB.isMaster(requestingUserId) ||
        (await adminsDB.isAdmin(requestingUserId) && !(await adminsDB.isAdmin(userId)) && !(await mastersDB.isMaster(userId)))) {
        try {
            bcrypt.hash(constants.DEFAULT_PASSWORD, saltRounds, async function (err, hash) {
                await usersDB.updatePassword(userId, hash, true);
                httpHelpers.sendSuccess(response, 'password reset successfully');
                response.end();
            });
            await pageDB.removeUserFromAllPages(userId);
        } catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
        }
    } else {
        httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
}

exports.isUsernameAvailable = async function (request, response) {
    const q = url.parse(request.url, true);
    let username = pageUtilities.handleText(q.query.name);

    try {
        let user = await usersDB.getByUsername(username);
        if (user && user.length > 0) {
            httpHelpers.sendSuccess(response, undefined, 'true');
            response.end();
        } else {
            httpHelpers.sendSuccess(response, undefined, 'false');
            response.end();
        }
    } catch (e) {
        console.log(e);
        httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
    }
}
