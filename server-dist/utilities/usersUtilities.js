var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const usersDB = require('../mysqlhandlers/usersDBHandlers');
const adminDB = require('../mysqlhandlers/adminsDBHandlers');
exports.checkUsersIds = function (ids) {
    return __awaiter(this, void 0, void 0, function* () {
        let idsArray = ids.split(',');
        for (let id of idsArray) {
            if (id && id.trim().length > 0) {
                if (!(yield usersDB.isUserAvailable(undefined, +(id.trim())))) {
                    return false;
                }
            }
        }
        return true;
    });
};
exports.checkAdminsIds = function (adminsIds) {
    return __awaiter(this, void 0, void 0, function* () {
        let idsArray = adminsIds.split(',');
        for (let id of idsArray) {
            if (!(yield adminDB.isAdmin(+id))) {
                return false;
            }
        }
        return true;
    });
};
exports.convertNamesToIds = function (names) {
    return __awaiter(this, void 0, void 0, function* () {
        let namesArray = names.trim().split(',');
        let ids = [];
        for (const name of namesArray) {
            try {
                if (name.trim().length > 0) {
                    let id = yield usersDB.getIdByName(name.trim());
                    if (id)
                        ids.push(id);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        return ids;
    });
};
exports.convertIdsToNames = function (ids) {
    return __awaiter(this, void 0, void 0, function* () {
        let idsArray = ids.trim().split(',');
        let names = [];
        for (const id of idsArray) {
            try {
                if (id.trim().length > 0) {
                    let results = yield usersDB.getById(id.trim());
                    if (results[0])
                        names.push(results[0].username);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        return names;
    });
};
//# sourceMappingURL=usersUtilities.js.map