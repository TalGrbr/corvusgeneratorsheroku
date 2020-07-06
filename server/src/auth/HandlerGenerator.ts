import has = Reflect.has;

class HandlerGenerator {
    async login(req, res) {
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
                let user = (await usersDB.getByUsername(username))[0];

                if (user) {
                    const match = await bcrypt.compare(password, user.password);
                    if (match) {
                        let token = jwt.sign({id: user.id},
                            config.secret,
                            {
                                expiresIn: '24h' // expires in 24 hours
                            }
                        );
                        //console.log('created token: ' + token);
                        // check the role
                        let role = roles.USER;
                        let id = user.id;
                        if (await mastersDB.isMaster(id)) {
                            role = roles.MASTER;
                        } else if (await adminsDB.isAdmin(id)) {
                            role = roles.ADMIN;
                        } else if (await modsDB.isMod(id)) {
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
                    } else {
                        res.writeHead(403, {"Content-Type": "application/json"});
                        res.write(JSON.stringify({
                            success: false,
                            message: 'Incorrect username or password'
                        }));
                        res.end();
                    }
                } else {
                    res.writeHead(403, {"Content-Type": "application/json"});
                    res.write(JSON.stringify({
                        success: false,
                        message: 'Incorrect username or password'
                    }));
                    res.end();
                }
            } catch (e) {
                console.log(e);
                res.writeHead(500, {"Content-Type": "application/json"});
                res.write(JSON.stringify({message: 'Internal server error'}));
                res.end();
            }
        } else {
            res.writeHead(500, {"Content-Type": "application/json"});
            res.write(JSON.stringify({
                success: false,
                message: 'Authentication failed! Please check the request'
            }));
            res.end();
        }
    }
}

module.exports = HandlerGenerator;
