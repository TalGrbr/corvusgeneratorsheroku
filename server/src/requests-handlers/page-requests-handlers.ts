export {};
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
const http = require('http');

exports.showPage = async function(request, response) {
  const q = url.parse(request.url, true);
  let name = q.query.name;

  try {
    let results = await pageDB.getByName(
      name,
      'date_of_creation');
    //console.log('we got: ' + results[0]);
    if (results != undefined) {
      if (results.length > 0) {
        let buff = Buffer.from(results[0].content, 'base64');
        let text = buff.toString('utf8');
        JSON.parse(text);
        httpHelpers.sendSuccess(response, undefined, text);
        response.end();
      } else {
        httpHelpers.sendError(response, 404, errors.PAGE_404);
        return;
      }
    }
  } catch (e) {
    httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR + name);
  }
};

exports.get5Threads = async function(request, response) {
  try {
    const q = url.parse(request.url, true);
    let forumId = q.query.id;
    let articles = await getArticles(forumId);
    let finalString = '[U]';
    Object.keys(articles).forEach(key => {
      finalString += `[URL="${key}"][COLOR=#0000cd]${articles[key]}[/COLOR][/URL]<br>`;
    });
    finalString = finalString.substr(0, finalString.length - '<br>'.length);

    finalString += '[/U]';
    httpHelpers.sendSuccess(response, finalString);
    response.end();
  } catch (e) {
    console.log(e);
    httpHelpers.sendError(response, 500, 'Threads not found');
  }
};

async function getHtml(forumId) {
  try {
    //let response = await axios.get('https://www.fxp.co.il/forumdisplay.php?f=' + forumId);
    const opts = {
      host: 'www.fxp.co.il',
      port: 443,
      path: '/forumdisplay.php?f=' + forumId
    };
    const htmlPromise = new Promise((resolve, reject) => {
      http.get(opts, (res) => {
        res.on('data', (chunk) => {
          console.log('BODY: ' + chunk);
          resolve(chunk);
        });
      }).on('error', (e) => {
        console.log(e);
        reject(e);
      });
    });
    return await htmlPromise;
    //let response = await axios.get('https://corvusgenerators.herokuapp.com/main');
      //const html = response.data;
      //const $ = cheerio.load(html, {decodeEntities: false});
      // Get text
      //console.log("------- with axios module -------")
      //console.log($.text());
      // Get HTML
      //return $.html();
  } catch (e) {
    console.log(e);
    return '';
  }
}

async function getArticles(forumId) {
  let html = (await getHtml(forumId)).toString();
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

exports.savePage = async function(request, response) {
  let requestingId = request.decoded.id;

  if (await adminsDB.isAdmin(requestingId) || await mastersDB.isMaster(requestingId)) {
    await initsDbs.init_pages_db(response);
    await initsDbs.init_pages_table(response);

    try { // try to insert the page to the db
      let data = request.body.data;

      await pageDB.insertPage(data, requestingId);
      httpHelpers.sendSuccess(response, 'Page created successfully');
      response.end();
    } catch (e) {
      console.log(e);
      httpHelpers.sendError(response, 500, errors.DB_ERROR);
      return;
    }
  } else {
    httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
  }
};

//TODO: fix this, i changed get all pages to return the full results and not just the content
exports.pages = async function(request, response) {
  try {
    let contents = {'contents': await pageDB.getAllPages('date_of_creation')};
    httpHelpers.sendSuccess(response, undefined, JSON.stringify(contents));
    response.end();
  } catch (e) {
    console.log(e);
    httpHelpers.sendError(response, 500, errors.CANT_GET_PAGES_ERROR);
  }
};

exports.pagesByUser = async function(request, response) {
  let requestingId = request.decoded.id;

  try {
    let results = await pageDB.getAllPagesRelatedToUserWithRoles(requestingId);
    httpHelpers.sendSuccess(response, undefined, JSON.stringify(results));
    response.end();
  } catch (e) {
    console.log(e);
    httpHelpers.sendError(response, 500, errors.CANT_GET_PAGES_ERROR);
  }
};

exports.updatePage = async function(request, response) {
  let requestingId = request.decoded.id;
  let isMaster = await mastersDB.isMaster(requestingId);

  const q = url.parse(request.url, true);
  let name = pageUtilities.handleText(q.query.name);
  let page = (await pageDB.getByName(name))[0];
  let pageId = page.id;
  if (!page) {
    httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
    return;
  }
  if ((await modsDB.isMod(requestingId) && page.mods_ids.slice(',').includes(requestingId.toString())) ||
    (await adminsDB.isAdmin(requestingId) && (page.sub_admins_ids.slice(',').includes(requestingId.toString()) || page.admin_id == requestingId)) ||
    isMaster) {

    let data = request.body.content;
    try {
      let stringed = JSON.stringify(data);
      let buff = Buffer.from(stringed);
      let base64data = buff.toString('base64');

      await pageDB.updatePageById({
        'page_name': pageUtilities.handleText(request.body.content.name),
        'content': base64data
      }, pageId);
      httpHelpers.sendSuccess(response, 'Page updated successfully');
      response.end();
    } catch (e) {
      httpHelpers.sendError(response, 500, errors.DB_ERROR);
    }
  } else {
    httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
  }
};

exports.deletePage = async function(request, response) {
  let requestingId = request.decoded.id;
  let isMaster = await mastersDB.isMaster(requestingId);

  const q = url.parse(request.url, true);
  let name = pageUtilities.handleText(q.query.name);
  let page = (await pageDB.getById(await pageDB.getIdByName(name)))[0];

  if ((await adminsDB.isAdmin(requestingId) && page.admin_id == requestingId) || isMaster) {
    try {
      await pageDB.deletePageById(await pageDB.getIdByName(name));
      httpHelpers.sendSuccess(response, 'Page deleted successfully');
      response.end();
    } catch (e) {
      console.log(e);
      httpHelpers.sendError(response, 500, errors.DB_ERROR);
    }
  } else {
    httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
  }
};

exports.getRoleInPage = async function(request, response) {
  const q = url.parse(request.url, true);
  let name = pageUtilities.handleText(q.query.name);
  let requestingId = request.decoded.id;
  let role = constants.ROLES.GUEST;
  try {
    let page = (await pageDB.getByName(name))[0];
    if (await mastersDB.isMaster(requestingId)) {
      role = constants.ROLES.MASTER;
    } else if (page.admin_id == requestingId) {
      role = constants.ROLES.ADMIN;
    } else if (page.sub_admins_ids.split(',').includes(requestingId.toString())) {
      role = constants.ROLES.SUB_ADMIN;
    } else if (page.mods_ids.split(',').includes(requestingId.toString())) {
      role = constants.ROLES.MOD;
    } else if (page.users_ids.split(',').includes(requestingId.toString())) {
      role = constants.ROLES.USER;
    }
    httpHelpers.sendSuccess(response, undefined, JSON.stringify({role: role}));
    response.end();
  } catch (e) {
    console.log(e);
    httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
  }
};

exports.getPageUsers = async function(request, response) {
  let requestingId = request.decoded.id;

  const q = url.parse(request.url, true);
  let pageName = pageUtilities.handleText(q.query.name);
  let page = (await pageDB.getByName(pageName))[0];
  if (page) {
    if (await mastersDB.isMaster(requestingId) ||
      (await adminsDB.isAdmin(requestingId) && (page.admin_id == requestingId || page.sub_admins_ids.slice(',').includes(requestingId.toString()))) ||
      (await modsDB.isMod(requestingId) && page.mods_ids.slice(',').includes(requestingId.toString()))
    ) {
      try {
        let results = await pageDB.getByName(pageName);
        httpHelpers.sendSuccess(
          response,
          undefined,
          JSON.stringify({content: await userUtilities.convertIdsToNames(results[0].users_ids)})
        );
        response.end();
      } catch (e) {
        console.log(e);
        httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
      }
    } else {
      httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
    }
  } else {
    httpHelpers.sendError(response, 400, errors.CANT_GET_PAGE_ERROR);
  }
};

exports.getPageMods = async function(request, response) {
  let requestingId = request.decoded.id;

  const q = url.parse(request.url, true);
  let pageName = pageUtilities.handleText(q.query.name);
  let page = (await pageDB.getByName(pageName))[0];
  if (page && (
    await mastersDB.isMaster(requestingId) ||
    page.admin_id == requestingId ||
    page.sub_admins_ids.slice(',').includes(requestingId)
  )) {
    try {
      let results = await pageDB.getByName(pageName);
      httpHelpers.sendSuccess(
        response,
        undefined,
        JSON.stringify({content: await userUtilities.convertIdsToNames(results[0].mods_ids)})
      );
      response.end();
    } catch (e) {
      console.log(e);
      httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
    }
  }
};

exports.updatePageAdmin = async function(request, response) {
  let requestingMasterId = request.decoded.id;
  let adminToRegisterName = request.body.content;
  let adminToRegisterId = (await userUtilities.convertNamesToIds(adminToRegisterName)).toString();

  const q = url.parse(request.url, true);
  let pageName = pageUtilities.handleText(q.query.name);
  let page = (await pageDB.getByName(pageName))[0];
  if (page && (await mastersDB.isMaster(requestingMasterId))) {
    if (await adminsDB.isAdmin(adminToRegisterId)) {
      await pageDB.updateAdmin(adminToRegisterId, page.id);
      httpHelpers.sendSuccess(response, 'admin updated');
      response.end();
    } else {
      httpHelpers.sendError(response, 400, 'user is not admin');
    }
  } else {
    httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
  }
};

exports.getPageAdmin = async function(request, response) {
  let requestingId = request.decoded.id;

  const q = url.parse(request.url, true);
  let pageName = pageUtilities.handleText(q.query.name);

  if (await mastersDB.isMaster(requestingId)) {
    try {
      let results = await pageDB.getByName(pageName);

      httpHelpers.sendSuccess(
        response,
        undefined,
        JSON.stringify({content: await userUtilities.convertIdsToNames(results[0].admin_id)})
      );
      response.end();
    } catch (e) {
      httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
    }
  } else {
    httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
  }
};

exports.getPageSubAdmins = async function(request, response) {
  let requestingId = request.decoded.id;
  const q = url.parse(request.url, true);
  let pageName = pageUtilities.handleText(q.query.name);
  let page = (await pageDB.getByName(pageName))[0];
  if (page && (await mastersDB.isMaster(requestingId) || page.admin_id == requestingId)) {
    try {
      httpHelpers.sendSuccess(
        response,
        undefined,
        JSON.stringify({content: await userUtilities.convertIdsToNames(page.sub_admins_ids)})
      );
      response.end();
    } catch (e) {
      httpHelpers.sendError(response, 500, errors.CANT_GET_PAGE_ERROR);
    }
  } else {
    httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
  }
};

exports.updatePageSubAdmins = async function(request, response) {
  let requestingId = request.decoded.id;
  let newSubAdminsNames = request.body.content.toString();
  let newSubAdminsIds = (await userUtilities.convertNamesToIds(newSubAdminsNames)).toString();

  const q = url.parse(request.url, true);
  let pageName = pageUtilities.handleText(q.query.name);
  let page = (await pageDB.getByName(pageName))[0];
  if (page && (await mastersDB.isMaster(requestingId) || page.admin_id == requestingId)) {
    try {
      if (await userUtilities.checkAdminsIds(newSubAdminsIds)) {
        await pageDB.updateSubAdmins(newSubAdminsIds, page.id);
        httpHelpers.sendSuccess(response, 'page sub admins updated successfully');
        response.end();
      } else {
        httpHelpers.sendError(response, 400, 'user isn\'t admin');
      }
    } catch (e) {
      httpHelpers.sendError(response, 500, errors.DB_ERROR);
    }
  } else {
    httpHelpers.sendError(response, 403, errors.ACCESS_ERROR);
  }
};

exports.isPageNameAvailable = async function(request, response) {
  const q = url.parse(request.url, true);
  let pageName = pageUtilities.handleText(q.query.name);

  try {
    let page = await pageDB.getByName(pageName);
    if (page && page.length > 0) {
      console.log('taken');
      httpHelpers.sendSuccess(response, undefined, 'true');
      response.end();
    } else {
      console.log('not taken');
      httpHelpers.sendSuccess(response, undefined, 'false');
      response.end();
    }
  } catch (e) {
    console.log(e);
    httpHelpers.sendError(response, 500, errors.SERVER_ERROR);
  }
};
