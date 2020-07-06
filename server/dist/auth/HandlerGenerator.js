var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var has = Reflect.has;
class HandlerGenerator {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let username = req.body.username;
            let password = req.body.password;
            // For the given username fetch user from DB
            const jwt = require('jsonwebtoken');
            const config = require('../config');
            const usersDB = require('../mysqlhandlers/usersDBHandlers');
            const modsDB = require('../mysqlhandlers/modsDBHandlers');
            const adminsDB = require('../mysqlhandlers/adminsDBHandlers');
            const mastersDB = require('../mysqlhandlers/mastersDBHandlers');
            const roles = require('./roles');
            const bcrypt = require('bcrypt');
            if (username && password) {
                try {
                    let user = (yield usersDB.getByUsername(username))[0];
                    if (user) {
                        const match = yield bcrypt.compare(password, user.password);
                        if (match) {
                            let token = jwt.sign({ id: user.id }, config.secret, {
                                expiresIn: '24h' // expires in 24 hours
                            });
                            //console.log('created token: ' + token);
                            // check the role
                            let role = roles.USER;
                            let id = user.id;
                            if (yield mastersDB.isMaster(id)) {
                                role = roles.MASTER;
                            }
                            else if (yield adminsDB.isAdmin(id)) {
                                role = roles.ADMIN;
                            }
                            else if (yield modsDB.isMod(id)) {
                                role = roles.MOD;
                            }
                            // return the JWT token for the future API calls
                            res.json({
                                success: true,
                                message: 'Authentication successful!',
                                username: username,
                                role: role,
                                token: token,
                                init_pass: user.init_pass
                            });
                            res.end();
                        }
                        else {
                            res.writeHead(403, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({
                                success: false,
                                message: 'Incorrect username or password'
                            }));
                            res.end();
                        }
                    }
                    else {
                        res.writeHead(403, { "Content-Type": "application/json" });
                        res.write(JSON.stringify({
                            success: false,
                            message: 'Incorrect username or password'
                        }));
                        res.end();
                    }
                }
                catch (e) {
                    console.log(e);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ message: 'Internal server error' }));
                    res.end();
                }
            }
            else {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.write(JSON.stringify({
                    success: false,
                    message: 'Authentication failed! Please check the request'
                }));
                res.end();
            }
        });
    }
}
module.exports = HandlerGenerator;
//# sourceMappingURL=HandlerGenerator.js.map