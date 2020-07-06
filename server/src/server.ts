// app
import {type} from 'os';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// security
const cors = require('cors');
const corsOptions = {
  origin: 'https://corvusgenerators.herokuapp.com',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// users
const HandlerGenerator = require('./auth/HandlerGenerator');
const middleware = require('./auth/auth');
let handlers = new HandlerGenerator();

// handlers
const pageRequestsHandlers = require('./requests-handlers/page-requests-handlers');
const usersRequestsHandlers = require('./requests-handlers/users-requests-handlers');

// get db connection
const mysql = require('mysql');
const config = require('./config');
const con = mysql.createPool({
  connectionLimit: config.maxCon,
  waitForConnections: true,
  host: config.dbHost,
  user: config.dbUserName,
  password: config.dbPassword,
  database: config.dbName
});

// start server
app.listen(8000, () => {
  console.log('Server started');
  console.log('server started - con:');
  console.log(con);
});

// PAGES
app.get('/showPage', middleware.checkToken, pageRequestsHandlers.showPage);
app.post('/savePage', middleware.checkToken, pageRequestsHandlers.savePage);
app.get('/pages', middleware.checkToken, pageRequestsHandlers.pages);
app.get('/pagesByUser', middleware.checkToken, pageRequestsHandlers.pagesByUser);
app.post('/updatePage', middleware.checkToken, pageRequestsHandlers.updatePage);
app.post('/deletePage', middleware.checkToken, pageRequestsHandlers.deletePage);
app.get('/getRoleInPage', middleware.checkToken, pageRequestsHandlers.getRoleInPage);
app.get('/isPageNameAvailable', middleware.checkToken, pageRequestsHandlers.isPageNameAvailable);
app.get('/get5Threads', middleware.checkToken, pageRequestsHandlers.get5Threads);

// USERS SYSTEM
app.get('/getRole', middleware.checkToken, usersRequestsHandlers.getRole);
// USERS
app.post('/loginUser', handlers.login);
app.post('/registerUser', middleware.checkToken, usersRequestsHandlers.registerUser);
app.get('/getAllAvailableUsers', middleware.checkToken, usersRequestsHandlers.getAllAvailableUsers);
app.get('/users', middleware.checkToken, usersRequestsHandlers.getAllUsers);
app.post('/updatePageUsers', middleware.checkToken, usersRequestsHandlers.updatePageUsers);
app.get('/getPageUsers', middleware.checkToken, pageRequestsHandlers.getPageUsers);
app.post('/removeUser', middleware.checkToken, usersRequestsHandlers.removeUser);
app.post('/updatePassword', middleware.checkToken, usersRequestsHandlers.updatePassword);
app.post('/resetPassword', middleware.checkToken, usersRequestsHandlers.resetPassword);
app.get('/isUsernameAvailable', middleware.checkToken, usersRequestsHandlers.isUsernameAvailable);

// MODS
app.get('/mods', middleware.checkToken, usersRequestsHandlers.mods);
app.post('/updatePageMods', middleware.checkToken, usersRequestsHandlers.updatePageMods);
app.get('/getPageMods', middleware.checkToken, pageRequestsHandlers.getPageMods);

// ADMINS
app.get('/admins', middleware.checkToken, usersRequestsHandlers.admins);
app.post('/registerAdmin', middleware.checkToken, usersRequestsHandlers.registerAdmin);
app.post('/updatePageAdmin', middleware.checkToken, pageRequestsHandlers.updatePageAdmin);
app.get('/getPageAdmin', middleware.checkToken, pageRequestsHandlers.getPageAdmin);
app.post('/removeAdmin', middleware.checkToken, usersRequestsHandlers.removeAdmin);

// SUB ADMINS
app.get('/getPageSubAdmins', middleware.checkToken, pageRequestsHandlers.getPageSubAdmins);
app.post('/updatePageSubAdmins', middleware.checkToken, pageRequestsHandlers.updatePageSubAdmins);

console.log(con);
module.exports = {app, con};
