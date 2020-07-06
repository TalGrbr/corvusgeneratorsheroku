import {ROLES} from '../utilities/constants';

export {};
const sqlHandlers = require('./mysqlhandlers');
const config = require('../config');
const PAGES_DB_NAME = config.dbName;
const PAGES_TABLE_NAME = 'pages';
const mysql = require('mysql');
const mastersDB = require('./mastersDBHandlers');
const con = require('../server').con;

exports.createPageDB = function() {
  const conNoDb = mysql.createPool({
    connectionLimit: config.maxCon,
    host: config.dbHost,
    user: config.dbUserName,
    password: config.dbPassword
  });
  return sqlHandlers.createNewDataBase(conNoDb, PAGES_DB_NAME);
};

exports.createNewPageTable = function() {
  const query =
    'CREATE TABLE IF NOT EXISTS ' +
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

exports.insertPage = function(pageContent, adminId) {
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

exports.getAllPages = async function(orderBy ?: string) {
  let results = await sqlHandlers.getAllFromDB(con, PAGES_DB_NAME, PAGES_TABLE_NAME, orderBy);
  let contentsArray = [];

  results.forEach(result => {
    if (result != undefined) {
      let buff = Buffer.from(result.content, 'base64');
      result.content = buff.toString('utf8');
      contentsArray.push(result);
    }
  });
  return contentsArray;
};

exports.getById = function(id, orderBy ?: string) {
  return sqlHandlers.getById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, id, orderBy);
};

exports.getByIds = function(ids, orderBy?: string) {
  return sqlHandlers.getByFieldMultipleValues(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'id', ids, orderBy);
};

exports.getByName = function(pageName, orderBy ?: string) {
  return sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'page_name', pageName, orderBy);
};

exports.getByAdminId = function(adminId, orderBy ?: string) {
  return sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'admin_id', adminId, orderBy);
};

exports.getIdByName = async function(pageName) {
  try {
    let results = await sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'page_name', pageName);
    return results[0].id;
  } catch (e) {
    return -1;
  }
};

exports.getByWildCardName = function(partOfPageName, orderBy ?: string) {
  return sqlHandlers.getWithWildCard(con, PAGES_DB_NAME, PAGES_TABLE_NAME, 'page_name', partOfPageName, orderBy);
};

exports.deletePageById = function(id) {
  return sqlHandlers.deleteRecordById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, id);
};

exports.updatePageById = function(fieldValueDict, id) {
  return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, fieldValueDict, id);
};

exports.updateUsers = function(usersIds, id) {
  return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, {'users_ids': usersIds}, id);
};

exports.updateMods = function(modsIds, id) {
  return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, {'mods_ids': modsIds}, id);
};

exports.updateAdmin = function(adminId, id) {
  return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, {'admin_id': adminId}, id);
};

exports.updateSubAdmins = function(subAdminsIds, id) {
  return sqlHandlers.updateValuesById(con, PAGES_DB_NAME, PAGES_TABLE_NAME, {'sub_admins_ids': subAdminsIds}, id);
};

exports.getPagesByField = async function(field, valueToSearch) {
  let pages = [];
  try {
    let results = await sqlHandlers.getByField(con, PAGES_DB_NAME, PAGES_TABLE_NAME, field, valueToSearch);
    results.forEach(result => pages.push(result));
  } catch (e) {
    console.log(e);
  }
  return pages;
};

exports.getPagesByUser = async function(userId) {
  let query = 'SELECT * FROM ' + PAGES_TABLE_NAME + ' WHERE FIND_IN_SET(' + userId + ', users_ids)';
  return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
};

exports.getPagesByMod = async function(modId) {
  let query = 'SELECT * FROM ' + PAGES_TABLE_NAME + ' WHERE FIND_IN_SET(' + modId + ', mods_ids)';
  return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
};

exports.getPagesByAdmin = async function(adminId) {
  return this.getPagesByField('admin_id', adminId);
};

exports.getPagesBySubAdmin = async function(subAdminId) {
  let query = 'SELECT * FROM ' + PAGES_TABLE_NAME + ' WHERE FIND_IN_SET(' + subAdminId + ', sub_admins_ids)';
  return sqlHandlers.executeQuery(con, PAGES_DB_NAME, query);
};

exports.removeAdminFromAllPages = async function(adminId) {
  let pages = await this.getPagesByField('admin_id', adminId);
  for (const page of pages) {
    let pageId = await this.getIdByName(page.page_name);
    // set the first user (me) to be admin
    await this.updateAdmin(1, pageId);
    // remove from sub admins as well
    await this.updateSubAdmins((page.sub_admins_ids.split(',').filter((id) => (id != adminId))).toString(), pageId);
  }
};

exports.removeUserFromAllPages = async function(userId) {
  let pages = await this.getAllPagesRelatedToUser(userId);
  // UPDATE THIS
  for (let page of pages) {
    let pageId = await this.getIdByName(page.page_name);
    if (pageId !== -1) {
      // remove from users ion all pages
      await this.updateUsers((page.users_ids.split(',').filter((id) => (id != userId))).toString(), pageId);
      // remove from mods in all pages
      await this.updateMods((page.mods_ids.split(',').filter((id) => (id != userId))).toString(), pageId);
      // remove from sub admins in all pages
      await this.updateSubAdmins((page.sub_admins_ids.split(',').filter((id) => (id != userId))).toString(), pageId);
      // remove from admins
      await this.updateAdmin(1, pageId);
    }
  }
};

exports.getAllPagesRelatedToUser = async function(userId) {
  let pages = [];
  let pagesByUser = await this.getPagesByUser(userId);
  let pagesByMod = await this.getPagesByMod(userId);
  let pagesByAdmin = await this.getPagesByAdmin(userId);
  let pagesBySubAdmin = await this.getPagesBySubAdmin(userId);

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
};

exports.addNoDupes = function(arrayDist, arraySource) {
  arraySource.forEach(row => {
    if (!arrayDist.find(r => r.id === row.id)) {
      arrayDist.push(row);
    }
  });
  return arrayDist;
};

exports.getAllPagesRelatedToUserWithRoles = async function(userId) {
  let isMaster = await mastersDB.isMaster(userId);
  let pages: any[];
  if (isMaster) {
    pages = await this.getAllPages();
  } else {
    pages = await this.getAllPagesRelatedToUser(userId);
  }

  let pagesWithRoles = [];
  let role = ROLES.GUEST;
  pages.forEach(page => {
    role = ROLES.GUEST;
    if (page) {
      if (page.admin_id == userId) {
        role = ROLES.ADMIN;
      } else if (page.sub_admins_ids.split(',').includes(userId.toString())) {
        role = ROLES.SUB_ADMIN;
      } else if (page.mods_ids.split(',').includes(userId.toString())) {
        role = ROLES.MOD;
      } else if (page.users_ids.split(',').includes(userId.toString())) {
        role = ROLES.USER;
      }
      pagesWithRoles.push({page: page.page_name, role: role, about: (JSON.parse(page.content))['about']});
    }
  });

  return pagesWithRoles;
}
