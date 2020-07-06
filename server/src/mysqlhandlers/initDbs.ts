import {response} from "express";

export {}
const pageDB = require('./pageDBHandlers');
const usersDB = require('./usersDBHandlers');
const modsDB = require('./modsDBHandlers');
const adminsDB = require('./adminsDBHandlers');
const mastersDB = require('./mastersDBHandlers');
const errors = require('../utilities/errors');

// PAGES
exports.init_pages_db = async function (response) {
    let result = 'trying to init pages db';
    try { // try to create new db if it doesnt exist
        result = await pageDB.createPageDB();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}

exports.init_pages_table = async function (response) {
    let result = 'trying to init pages table';
    try { // try to create a new table if it doesnt exist
        result = await pageDB.createNewPageTable();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}


// USERS
exports.init_users_db = async function (response) {
    let result = 'trying to init users database';
    try { // try to create new db if it doesnt exist
        result = await usersDB.createUsersDB();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}

exports.init_users_table = async function (response) {
    let result = 'trying to init users table';
    try { // try to create a new table if it doesnt exist
        result = await usersDB.createNewUsersTable();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}


// MODS
exports.init_mods_db = async function (response) {
    let result = 'trying to init mods database';
    try { // try to create new db if it doesnt exist
        result = await modsDB.createModsDB();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}

exports.init_mods_table = async function (response) {
    let result = 'trying to init mods table';
    try { // try to create a new table if it doesnt exist
        result = await modsDB.createNewModsTable();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}


// ADMINS
exports.init_admins_db = async function (response) {
    let result = 'trying to init admins database';
    try { // try to create new db if it doesnt exist
        result = await adminsDB.createAdminDB();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}

exports.init_admins_table = async function (response) {
    let result = 'trying to init admins table';
    try { // try to create a new table if it doesnt exist
        result = await adminsDB.createNewAdminsTable();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}


// MASTERS
exports.init_masters_db = async function (response) {
    let result = 'trying to init masters database';
    try { // try to create new db if it doesnt exist
        result = await mastersDB.createMasterDB();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}

exports.init_masters_table = async function (response) {
    let result = 'trying to init masters table';
    try { // try to create a new table if it doesnt exist
        result = await mastersDB.createNewMastersTable();
    } catch (e) {
        result = e.toString();
        response.writeHead(500, {"Content-Type": "application/json"});
        response.write(JSON.stringify({message: errors.DB_ERROR}));
        response.end();
        return;
    } finally {
        console.log('result: ' + result);
    }
}
