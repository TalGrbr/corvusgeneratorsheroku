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
const pageUtilities = require('../utilities/pageUtilities');
const userUtilities = require('../utilities/usersUtilities');
const errors = require('../utilities/errors');
const constants = require('../utilities/constants');
// dbs
const pageDB = require('../mysqlhandlers/pageDBHandlers');
const modsDB = require('../mysqlhandlers/modsDBHandlers');
const adminsDB = require('../mysqlhandlers/adminsDBHandlers');
const mastersDB = require('../mysqlhandlers/mastersDBHandlers');
const initsDbs = require('../mysqlhandlers/initDbs');
// http
const httpHelpers = require('../httpHelpers');
const axios = require('axios');
const cheerio = require('cheerio');
exports.showPage = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = url.parse(request.url, true);
        let name = q.query.name;
        try {
            let results = yield pageDB.getByName(name, 'date_of_creation');
            //console.log('we got: ' + results[0]);
            if (results != undefined) {
                if (results.length > 0) {
                    let buff = Buffer.from(results[0].content, 'base64');
                    let text = buff.toString('utf8');
                    JSON.parse(text);
                    httpHelpers.sendSuccess(response, undefined, text);
                    response.end();
                }
                else {
                    httpHelpers.sendError(response, 404, errors.PAGE_404);
                    return;
                }
            }
        }
        catch (e) {
            httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR + name);
        }
    });
};
exports.get5Threads = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const q = url.parse(request.url, true);
            let forumId = q.query.id;
            let articles = yield getArticles(forumId);
            let finalString = '[U]';
            Object.keys(articles).forEach(key => {
                finalString += `[URL="${key}"][COLOR=#0000cd]${articles[key]}[/COLOR][/URL]<br>`;
            });
            finalString = finalString.substr(0, finalString.length - '<br>'.length);
            finalString += '[/U]';
            httpHelpers.sendSuccess(response, finalString);
            response.end();
        }
        catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, 'Threads not found');
        }
    });
};
function getHtml(forumId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const htmlPromise = new Promise((resolve, reject) => {
                let data = '';
                const https = require('https');
                const options = {
                    host: 'www.fxp.co.il',
                    port: 443,
                    path: `/forumdisplay.php`,
                    qs: { f: forumId },
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/html; charset=UTF-8'
                    }
                };
                const req = https.request(options, (res) => {
                    console.log(`${options.host} : ${res.statusCode}`);
                    console.log(res);
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        resolve(data);
                    });
                });
                req.on('error', (err) => {
                    console.log(err);
                    reject(err);
                });
                req.end();
            });
            return yield htmlPromise;
            //let response = await axios.get('https://corvusgenerators.herokuapp.com/main');
            //const html = response.data;
            //const $ = cheerio.load(html, {decodeEntities: false});
            // Get text
            //console.log("------- with axios module -------")
            //console.log($.text());
            // Get HTML
            //return $.html();
        }
        catch (e) {
            console.log(e);
            return '';
        }
    });
}
function getArticles(forumId) {
    return __awaiter(this, void 0, void 0, function* () {
        let html = (yield getHtml(forumId)).toString();
        if (html.length === 0) {
            return {};
        }
        console.log(html);
        let sepRegex = /<li class="threadbit/g;
        // split and get rid of the sticky
        let htmlBroken = html.split(sepRegex).filter(elm => elm.includes('nonsticky'));
        html = htmlBroken.join();
        let regex = /<a class="title.{0,19}" href="showthread\.php\?t=[0-9]+" id="thread_title_[0-9]+">.+<\/a>/g;
        let rawArticles = html.match(regex);
        let processed = linkAndTitleFromRaw(rawArticles);
        return selectRandomFromJson(processed, 5);
    });
}
function selectRandomFromJson(json, n) {
    let randoms = {};
    const keys = Object.keys(json);
    while (Object.keys(randoms).length < n) {
        const randIndex = Math.floor(Math.random() * keys.length);
        const randKey = keys[randIndex];
        if (!randoms.hasOwnProperty(randKey)) {
            randoms[randKey] = json[randKey];
        }
    }
    return randoms;
}
function linkAndTitleFromRaw(raw) {
    let processed = {};
    const idRegex = /[0-9]+/u;
    const titleRegex = /(?<=>).*(?=<\/a>)/u;
    const urlTemplate = 'https://www.fxp.co.il/showthread.php?t=';
    raw.forEach(line => {
        processed[urlTemplate + line.match(idRegex)[0]] = line.match(titleRegex)[0];
    });
    return processed;
}
exports.savePage = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        if ((yield adminsDB.isAdmin(requestingId)) || (yield mastersDB.isMaster(requestingId))) {
            yield initsDbs.init_pages_db(response);
            yield initsDbs.init_pages_table(response);
            try { // try to insert the page to the db
                let data = request.body.data;
                yield pageDB.insertPage(data, requestingId);
                httpHelpers.sendSuccess(response, 'Page created successfully');
                response.end();
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
    });
};
//TODO: fix this, i changed get all pages to return the full results and not just the content
exports.pages = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let contents = { 'contents': yield pageDB.getAllPages('date_of_creation') };
            httpHelpers.sendSuccess(response, undefined, JSON.stringify(contents));
            response.end();
        }
        catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.CANT_GET_PAGES_ERROR);
        }
    });
};
exports.pagesByUser = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        try {
            let results = yield pageDB.getAllPagesRelatedToUserWithRoles(requestingId);
            httpHelpers.sendSuccess(response, undefined, JSON.stringify(results));
            response.end();
        }
        catch (e) {
            console.log(e);
            httpHelpers.sendError(response, 500, errors.CANT_GET_PAGES_ERROR);
        }
    });
};
exports.updatePage = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        let isMaster = yield mastersDB.isMaster(requestingId);
        const q = url.parse(request.url, true);
        let name = pageUtilities.handleText(q.query.name);
        let page = (yield pageDB.getByName(name))[0];
        let pageId = page.id;
        if (!page) {
            httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
            return;
        }
        if (((yield modsDB.isMod(requestingId)) && page.mods_ids.slice(',').includes(requestingId.toString())) ||
            ((yield adminsDB.isAdmin(requestingId)) && (page.sub_admins_ids.slice(',').includes(requestingId.toString()) || page.admin_id == requestingId)) ||
            isMaster) {
            let data = request.body.content;
            try {
                let stringed = JSON.stringify(data);
                let buff = Buffer.from(stringed);
                let base64data = buff.toString('base64');
                yield pageDB.updatePageById({
                    'page_name': pageUtilities.handleText(request.body.content.name),
                    'content': base64data
                }, pageId);
                httpHelpers.sendSuccess(response, 'Page updated successfully');
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
exports.deletePage = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        let isMaster = yield mastersDB.isMaster(requestingId);
        const q = url.parse(request.url, true);
        let name = pageUtilities.handleText(q.query.name);
        let page = (yield pageDB.getById(yield pageDB.getIdByName(name)))[0];
        if (((yield adminsDB.isAdmin(requestingId)) && page.admin_id == requestingId) || isMaster) {
            try {
                yield pageDB.deletePageById(yield pageDB.getIdByName(name));
                httpHelpers.sendSuccess(response, 'Page deleted successfully');
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
exports.getRoleInPage = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = url.parse(request.url, true);
        let name = pageUtilities.handleText(q.query.name);
        let requestingId = request.decoded.id;
        let role = constants.ROLES.GUEST;
        try {
            let page = (yield pageDB.getByName(name))[0];
            if (yield mastersDB.isMaster(requestingId)) {
                role = constants.ROLES.MASTER;
            }
            else if (page.admin_id == requestingId) {
                role = constants.ROLES.ADMIN;
            }
            else if (page.sub_admins_ids.split(',').includes(requestingId.toString())) {
                role = constants.ROLES.SUB_ADMIN;
            }
            else if (page.mods_ids.split(',').includes(requestingId.toString())) {
                role = constants.ROLES.MOD;
            }
            else if (page.users_ids.split(',').includes(requestingId.toString())) {
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
exports.getPageUsers = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        const q = url.parse(request.url, true);
        let pageName = pageUtilities.handleText(q.query.name);
        let page = (yield pageDB.getByName(pageName))[0];
        if (page) {
            if ((yield mastersDB.isMaster(requestingId)) ||
                ((yield adminsDB.isAdmin(requestingId)) && (page.admin_id == requestingId || page.sub_admins_ids.slice(',').includes(requestingId.toString()))) ||
                ((yield modsDB.isMod(requestingId)) && page.mods_ids.slice(',').includes(requestingId.toString()))) {
                try {
                    let results = yield pageDB.getByName(pageName);
                    httpHelpers.sendSuccess(response, undefined, JSON.stringify({ content: yield userUtilities.convertIdsToNames(results[0].users_ids) }));
                    response.end();
                }
                catch (e) {
                    console.log(e);
                    httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
                }
            }
            else {
                httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 400, errors.CANT_GET_PAGE_ERROR);
        }
    });
};
exports.getPageMods = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        const q = url.parse(request.url, true);
        let pageName = pageUtilities.handleText(q.query.name);
        let page = (yield pageDB.getByName(pageName))[0];
        if (page && ((yield mastersDB.isMaster(requestingId)) ||
            page.admin_id == requestingId ||
            page.sub_admins_ids.slice(',').includes(requestingId))) {
            try {
                let results = yield pageDB.getByName(pageName);
                httpHelpers.sendSuccess(response, undefined, JSON.stringify({ content: yield userUtilities.convertIdsToNames(results[0].mods_ids) }));
                response.end();
            }
            catch (e) {
                console.log(e);
                httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
            }
        }
    });
};
exports.updatePageAdmin = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingMasterId = request.decoded.id;
        let adminToRegisterName = request.body.content;
        let adminToRegisterId = (yield userUtilities.convertNamesToIds(adminToRegisterName)).toString();
        const q = url.parse(request.url, true);
        let pageName = pageUtilities.handleText(q.query.name);
        let page = (yield pageDB.getByName(pageName))[0];
        if (page && (yield mastersDB.isMaster(requestingMasterId))) {
            if (yield adminsDB.isAdmin(adminToRegisterId)) {
                yield pageDB.updateAdmin(adminToRegisterId, page.id);
                httpHelpers.sendSuccess(response, 'admin updated');
                response.end();
            }
            else {
                httpHelpers.sendError(response, 400, 'user is not admin');
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.getPageAdmin = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        const q = url.parse(request.url, true);
        let pageName = pageUtilities.handleText(q.query.name);
        if (yield mastersDB.isMaster(requestingId)) {
            try {
                let results = yield pageDB.getByName(pageName);
                httpHelpers.sendSuccess(response, undefined, JSON.stringify({ content: yield userUtilities.convertIdsToNames(results[0].admin_id) }));
                response.end();
            }
            catch (e) {
                httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.getPageSubAdmins = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        const q = url.parse(request.url, true);
        let pageName = pageUtilities.handleText(q.query.name);
        let page = (yield pageDB.getByName(pageName))[0];
        if (page && ((yield mastersDB.isMaster(requestingId)) || page.admin_id == requestingId)) {
            try {
                httpHelpers.sendSuccess(response, undefined, JSON.stringify({ content: yield userUtilities.convertIdsToNames(page.sub_admins_ids) }));
                response.end();
            }
            catch (e) {
                httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
            }
        }
        else {
            httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
        }
    });
};
exports.updatePageSubAdmins = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestingId = request.decoded.id;
        let newSubAdminsNames = request.body.content.toString();
        let newSubAdminsIds = (yield userUtilities.convertNamesToIds(newSubAdminsNames)).toString();
        const q = url.parse(request.url, true);
        let pageName = pageUtilities.handleText(q.query.name);
        let page = (yield pageDB.getByName(pageName))[0];
        if (page && ((yield mastersDB.isMaster(requestingId)) || page.admin_id == requestingId)) {
            try {
                if (yield userUtilities.checkAdminsIds(newSubAdminsIds)) {
                    yield pageDB.updateSubAdmins(newSubAdminsIds, page.id);
                    httpHelpers.sendSuccess(response, 'page sub admins updated successfully');
                    response.end();
                }
                else {
                    httpHelpers.sendError(response, 400, 'user isn\'t admin');
                }
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
exports.isPageNameAvailable = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = url.parse(request.url, true);
        let pageName = pageUtilities.handleText(q.query.name);
        try {
            let page = yield pageDB.getByName(pageName);
            if (page && page.length > 0) {
                console.log('taken');
                httpHelpers.sendSuccess(response, undefined, 'true');
                response.end();
            }
            else {
                console.log('not taken');
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
//# sourceMappingURL=page-requests-handlers.js.map