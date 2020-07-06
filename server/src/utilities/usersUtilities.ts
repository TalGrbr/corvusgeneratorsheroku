const usersDB = require('../mysqlhandlers/usersDBHandlers');
const adminDB = require('../mysqlhandlers/adminsDBHandlers');

exports.checkUsersIds = async function (ids: string) {
    let idsArray = ids.split(',');
    for (let id of idsArray) {
        if (id && id.trim().length > 0) {
            if (!(await usersDB.isUserAvailable(undefined, +(id.trim())))) {
                return false;
            }
        }
    }
    return true;
}

exports.checkAdminsIds = async function (adminsIds: string) {
    let idsArray = adminsIds.split(',');
    for (let id of idsArray) {
        if (!(await adminDB.isAdmin(+id))) {
            return false;
        }
    }
    return true;
}

exports.convertNamesToIds = async function (names) {
    let namesArray = names.trim().split(',');
    let ids = [];
    for (const name of namesArray) {
        try {
            if (name.trim().length > 0) {
                let id = await usersDB.getIdByName(name.trim());
                if (id) ids.push(id);
            }
        } catch (e) {
            console.log(e);
        }
    }
    return ids;
}

exports.convertIdsToNames = async function (ids) {
    let idsArray = ids.trim().split(',');
    let names = [];

    for (const id of idsArray) {
        try {
            if (id.trim().length > 0) {
                let results = await usersDB.getById(id.trim());
                if (results[0]) names.push(results[0].username);
            }
        } catch (e) {
            console.log(e);
        }
    }
    return names;
}
